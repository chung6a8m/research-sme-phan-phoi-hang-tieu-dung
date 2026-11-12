#!/usr/bin/env python3
"""R008: arithmetic/reference-model verification, not application or pilot tests.

Only Python standard library. All commercial data and tax parameters are synthetic.
Run: python3 kiem-chung-so-lieu.py --output ket-qua-so-lieu.json
The JSON is deterministic; no current timestamps, network, DB, or provider calls.
"""

import argparse
import hashlib
import json
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, FloatOperation, ROUND_FLOOR, ROUND_HALF_UP, getcontext
from pathlib import Path

D = Decimal
getcontext().prec = 50
getcontext().traps[FloatOperation] = True
CHECKS = []


def require(condition, message):
    if not condition:
        raise ValueError(message)


def check(name, actual, expected):
    if actual != expected:
        raise AssertionError(f"{name}: actual={actual!r}; expected={expected!r}")
    CHECKS.append({"id": name, "result": "pass", "actual": actual, "expected": expected})


def vnd(value):
    return int(D(value).quantize(D("1"), rounding=ROUND_HALF_UP))


def cumulative(total, quantity, returned):
    require(quantity > 0 and 0 <= returned <= quantity, "quantity outside source")
    return vnd(D(total) * D(returned) / D(quantity))


def largest_remainder(amount, weights):
    require(amount >= 0 and all(v >= 0 for v in weights.values()), "negative allocation")
    denominator = sum(weights.values())
    require(denominator > 0 or amount == 0, "positive amount without weight")
    if denominator == 0:
        return {key: 0 for key in weights}
    raw = {key: D(amount) * D(weight) / D(denominator) for key, weight in weights.items()}
    allocated = {key: int(value.to_integral_value(rounding=ROUND_FLOOR)) for key, value in raw.items()}
    remaining = amount - sum(allocated.values())
    priority = sorted(weights, key=lambda key: (-(raw[key] - allocated[key]), key))
    for key in priority[:remaining]:
        allocated[key] += 1
    require(sum(allocated.values()) == amount, "allocation does not conserve total")
    return allocated


def price_line(amount_before_discount, discount, rate, mode):
    require(0 <= discount <= amount_before_discount, "invalid discount")
    amount = amount_before_discount - discount
    rate = D(rate)
    require(rate >= 0, "tax rate is a synthetic nonnegative parameter")
    if mode == "exclusive":
        net = amount
        vat = vnd(D(net) * rate)
        gross = net + vat
    elif mode == "inclusive":
        gross = amount
        net = vnd(D(gross) / (D(1) + rate))
        vat = gross - net
    else:
        raise ValueError("unsupported price mode")
    return {"net": net, "vat": vat, "gross": gross, "discount": discount, "rate_input": str(rate), "mode": mode}


def return_amounts(source, quantity, cumulative_quantities):
    previous = {"net": 0, "vat": 0}
    result = []
    previous_quantity = 0
    for returned in cumulative_quantities:
        require(previous_quantity < returned <= quantity, "return quantity must increase")
        target = {field: cumulative(source[field], quantity, returned) for field in previous}
        delta = {field: target[field] - previous[field] for field in previous}
        delta["gross"] = delta["net"] + delta["vat"]
        result.append({"quantity": returned - previous_quantity, "cumulative_quantity": returned, **delta})
        previous, previous_quantity = target, returned
    return result


class GiftBalance:
    def __init__(self):
        self.purchase_delivered = 0
        self.purchase_returned = 0
        self.issued = {}
        self.returned = {}
        self.waived = {}
        self.waiver_ids = set()

    def purchase(self, quantity):
        self.purchase_delivered += quantity

    def accept_purchase_return(self, quantity):
        require(quantity <= self.purchase_delivered - self.purchase_returned, "excess purchase return")
        self.purchase_returned += quantity

    def gift(self, source_id, quantity):
        require(source_id not in self.issued, "duplicate gift issue")
        self.issued[source_id] = quantity
        self.returned[source_id] = 0
        self.waived[source_id] = 0

    def waive(self, waiver_id, source_id, quantity):
        if waiver_id in self.waiver_ids:
            return
        balance = self.balance()
        require(quantity <= balance["recover_due"], "waiver exceeds current recovery")
        require(quantity <= self.issued[source_id] - self.returned[source_id] - self.waived[source_id], "waiver exceeds nonwaived gift held")
        self.waived[source_id] += quantity
        self.waiver_ids.add(waiver_id)

    def accept_gift_return(self, source_id, quantity, waived_quantity=0):
        require(quantity <= self.issued[source_id] - self.returned[source_id], "excess gift return")
        require(0 <= waived_quantity <= min(quantity, self.waived[source_id]), "invalid waived return")
        nonwaived_held = self.issued[source_id] - self.returned[source_id] - self.waived[source_id]
        require(quantity - waived_quantity <= nonwaived_held, "return must identify waived units")
        self.returned[source_id] += quantity
        self.waived[source_id] -= waived_quantity

    def balance(self):
        purchase_net = self.purchase_delivered - self.purchase_returned
        entitled = purchase_net // 10
        gift_net = sum(self.issued.values()) - sum(self.returned.values())
        waived_held = sum(self.waived.values())
        return {"purchase_net": purchase_net, "entitled": entitled, "gift_net_held": gift_net,
                "gift_returned": sum(self.returned.values()), "waived_still_held": waived_held,
                "deliver_due": max(0, entitled - gift_net), "recover_due": max(0, gift_net - entitled - waived_held)}


def gift_cases():
    normal, waived = [], []
    g = GiftBalance()
    g.purchase(20)
    g.gift("G1", 2)
    normal.append({"event": "deliver_20_plus_2", **g.balance()})
    normal.append({"event": "request_or_custody_only_return_11_plus_2_no_commercial_effect", **g.balance()})
    g.accept_purchase_return(11)
    g.accept_gift_return("G1", 2)
    normal.append({"event": "accepted_return_11_plus_2", **g.balance()})
    g.purchase(11)
    normal.append({"event": "next_delivery_11_purchase", **g.balance()})
    check("F02.next_delivery_gift_due", g.balance()["deliver_due"], 2)
    g.gift("G2", 2)
    normal.append({"event": "deliver_two_reearned_gifts", **g.balance()})
    check("F02.no_duplicate_gift_due", g.balance()["deliver_due"], 0)
    w = GiftBalance()
    w.purchase(20)
    w.gift("WG1", 2)
    w.accept_purchase_return(11)
    waived.append({"event": "accepted_purchase_return_only", **w.balance()})
    check("F02.before_waiver_recovery", w.balance()["recover_due"], 2)
    w.waive("WAIVER-1-v1", "WG1", 2)
    w.waive("WAIVER-1-v1", "WG1", 2)
    waived.append({"event": "waive_two_same_id_replayed", **w.balance()})
    check("F02.waiver_not_recovered_twice", w.balance()["recover_due"], 0)
    check("F02.waiver_idempotent_quantity", w.balance()["waived_still_held"], 2)
    w.purchase(11)
    waived.append({"event": "next_purchase_11_waived_gifts_still_held", **w.balance()})
    check("F02.waived_gifts_count_as_held_when_entitlement_rises", w.balance()["deliver_due"], 0)
    w.accept_gift_return("WG1", 1, waived_quantity=1)
    waived.append({"event": "customer_returns_one_waived_gift", **w.balance()})
    check("F02.returned_waived_gift_reduces_G_and_W", [w.balance()["gift_net_held"], w.balance()["waived_still_held"], w.balance()["deliver_due"]], [1, 1, 1])
    w.gift("WG2", 1)
    w.accept_purchase_return(10)
    w.purchase(20)
    w.gift("WG3", 1)
    w.accept_purchase_return(20)
    waived.append({"event": "new_nonwaived_gift_recovery_after_later_cycle", **w.balance()})
    check("F02.waiver_does_not_cover_all_future_gifts", w.balance()["recover_due"], 1)
    return {"returned_gifts": normal, "waived_gifts": waived}


def cost_cases():
    issued = vnd(D(10000) * 2 / 3)
    independent_returns = [vnd(D(issued) / 2), vnd(D(issued) / 2)]
    correct = [cumulative(issued, 2, 1), cumulative(issued, 2, 2) - cumulative(issued, 2, 1)]
    check("F03.source_issue", issued, 6667)
    check("F03.counterexample_naive_return", sum(independent_returns), 6668)
    check("F03.cumulative_return_parts", correct, [3334, 3333])
    check("F03.inventory_full_reversal", 10000 - issued + sum(correct), 10000)
    adjusted_source = 6768
    already_returned = correct[0]
    return_cost_adjustment = cumulative(adjusted_source, 2, 1) - already_returned
    final_return = adjusted_source - already_returned - return_cost_adjustment
    check("F03.adjusted_return_already_received", return_cost_adjustment, 50)
    check("F03.adjusted_source_final_return", final_return, 3384)
    check("F03.adjusted_source_full_reversal", already_returned + return_cost_adjustment + final_return, 6768)
    partitions = [[1, 2, 3, 7], [2, 5, 7], [7]]
    partition_results = []
    for milestones in partitions:
        previous = 0
        parts = []
        for k in milestones:
            target = cumulative(10001, 7, k)
            parts.append(target - previous)
            previous = target
        check("F03.partition_" + "_".join(map(str, milestones)), sum(parts), 10001)
        partition_results.append({"cumulative_quantities": milestones, "cost_parts": parts, "total": sum(parts)})
    return {"initial_quantity": 3, "initial_value": 10000, "issue_quantity": 2, "issue_cost": issued,
            "incorrect_independent_parts": independent_returns, "correct_parts": correct,
            "adjusted_source": {"version_1_cost": issued, "version_2_cost": adjusted_source,
                                "source_adjustment": adjusted_source - issued, "first_return": already_returned,
                                "adjustment_to_first_return": return_cost_adjustment,
                                "adjustment_to_unreturned_cost": adjusted_source - issued - return_cost_adjustment,
                                "final_return": final_return}, "partitions": partition_results}


def due_cases():
    def term(delivery, days, version):
        anchor = date.fromisoformat(delivery)
        due = anchor + timedelta(days=days)
        overdue = max(0, (date(2026, 11, 16) - due).days)
        return {"delivery_local_date": delivery, "snapshot_version": version, "calendar_days": days,
                "due_date": due.isoformat(), "days_past_due_at_2026_11_16": overdue}
    rows = [term("2026-11-01", 7, "T7-v1"), term("2026-11-08", 7, "T7-v1"),
            term("2026-11-08", 14, "T14-v2-new-order"), term("2026-11-08", 10, "T10-explicit-amendment-alternative")]
    check("DUE.split_delivery_snapshot", [r["due_date"] for r in rows[:3]], ["2026-11-08", "2026-11-15", "2026-11-22"])
    check("DUE.aging", [r["days_past_due_at_2026_11_16"] for r in rows[:3]], [8, 1, 0])
    local = datetime.fromisoformat("2026-11-01T18:30:00+00:00").astimezone(timezone(timedelta(hours=7)))
    local_due = (local.date() + timedelta(days=7)).isoformat()
    check("DUE.business_timezone_before_date_addition", local_due, "2026-11-09")
    return {"rows": rows, "timezone_boundary": {"occurred_at": "2026-11-01T18:30:00+00:00", "local_date": local.date().isoformat(), "due_date": local_due}}


def tax_cases():
    weights = {"L-P": 200000, "L-Q": 100000}
    allocation = largest_remainder(10001, weights)
    check("TAX.discount_largest_remainder", allocation, {"L-P": 6667, "L-Q": 3334})
    check("TAX.discount_tie_break", largest_remainder(1, {"B": 1, "A": 1}), {"B": 0, "A": 1})
    exclusive = [price_line(weights[key], allocation[key], rate, "exclusive") for key, rate in [("L-P", "0.08"), ("L-Q", "0.10")]]
    check("TAX.exclusive_totals", [sum(x[f] for x in exclusive) for f in ["net", "vat", "gross"]], [289999, 25134, 315133])
    inclusive_weights = {"L-P": 216000, "L-Q": 110000}
    inclusive_alloc = largest_remainder(10001, inclusive_weights)
    inclusive = [price_line(inclusive_weights[key], inclusive_alloc[key], rate, "inclusive") for key, rate in [("L-P", "0.08"), ("L-Q", "0.10")]]
    check("TAX.inclusive_discount_conserved", sum(inclusive_alloc.values()), 10001)
    check("TAX.inclusive_gross_after_discount", sum(x["gross"] for x in inclusive), 315999)
    for i, row in enumerate(inclusive):
        check(f"TAX.inclusive_line_{i}_identity", row["net"] + row["vat"], row["gross"])
    partials = return_amounts(exclusive[0], 3, [1, 2, 3])
    check("TAX.full_return_net", sum(r["net"] for r in partials), exclusive[0]["net"])
    check("TAX.full_return_vat", sum(r["vat"] for r in partials), exclusive[0]["vat"])
    check("TAX.full_return_gross", sum(r["gross"] for r in partials), exclusive[0]["gross"])
    source_small = {"net": 1, "vat": 1, "gross": 2}
    separately_rounded = cumulative(source_small["net"], 2, 1) + cumulative(source_small["vat"], 2, 1)
    check("TAX.return_gross_is_sum_of_source_components", separately_rounded, 2)
    check("TAX.round_gross_independently_would_differ", cumulative(2, 2, 1), 1)
    return {"exclusive": {"allocation": allocation, "lines": exclusive},
            "inclusive": {"allocation": inclusive_alloc, "lines": inclusive},
            "source_component_partial_returns": partials,
            "small_amount_rounding_edge": {"source": source_small, "quantity": 2, "first_return_gross": 2, "second_return_gross": 0,
                                            "note": "Synthetic edge only; provider/accountant must accept component allocation profile before use."}}


def compound_cases():
    def credit(sale, confirmed_receipt, reserved_customer_credit=0):
        applied_receipt = min(sale, confirmed_receipt)
        applied_credit = min(sale - applied_receipt, reserved_customer_credit)
        return {"sale_gross": sale, "confirmed_receipt": confirmed_receipt, "receipt_applied_to_sale": applied_receipt,
                "reserved_credit_applied": applied_credit, "credit_consumed": sale - applied_receipt - applied_credit,
                "new_customer_credit": max(0, confirmed_receipt - sale)}
    rows = [credit(100, 100), credit(100, 60), credit(100, 0), credit(100, 120), credit(100, 60, 40)]
    check("COMPOUND.cash_sale_zero_credit", rows[0]["credit_consumed"], 0)
    check("COMPOUND.partial_cash_credit", rows[1]["credit_consumed"], 40)
    check("COMPOUND.unverified_bank_report_not_receipt", rows[2]["credit_consumed"], 100)
    check("COMPOUND.overpayment", [rows[3]["credit_consumed"], rows[3]["new_customer_credit"]], [0, 20])
    check("COMPOUND.server_reserved_credit", rows[4]["credit_consumed"], 0)
    return {"cases": rows, "atomicity": "proposed_contract_not_exercised_against_server", "offline_old_debt_receipt_recycles_credit": False}


class Ledger:
    def __init__(self):
        self.stock = {}
        self.cost_in = 0
        self.expense = {"sold": 0, "gift": 0, "count_loss": 0}
        self.customer = {"C-A": 0, "C-B": 0}
        self.money = {"employee_N1": 0, "cashier": 0}
        self.net = 0
        self.vat = 0
        self.events = []

    def balance(self, location, sku):
        return self.stock.setdefault(f"{location}/{sku}", {"quantity": 0, "value": 0})

    def receive(self, location, sku, quantity, value, purchase=False):
        b = self.balance(location, sku)
        b["quantity"] += quantity
        b["value"] += value
        if purchase:
            self.cost_in += value

    def take(self, location, sku, quantity):
        b = self.balance(location, sku)
        require(0 < quantity <= b["quantity"], "stock quantity outside available")
        value = b["value"] if quantity == b["quantity"] else vnd(D(b["value"]) * quantity / b["quantity"])
        b["quantity"] -= quantity
        b["value"] -= value
        return value

    def transfer(self, source, destination, sku, quantity):
        value = self.take(source, sku, quantity)
        self.receive(destination, sku, quantity, value)

    def issue(self, location, sku, quantity, category):
        value = self.take(location, sku, quantity)
        self.expense[category] += value
        return value

    def accepted_return(self, sku, quantity, cost, category):
        self.receive("QUARANTINE", sku, quantity, cost)
        self.expense[category] -= cost

    def sale(self, customer, lines):
        self.net += sum(line["net"] for line in lines)
        self.vat += sum(line["vat"] for line in lines)
        self.customer[customer] += sum(line["gross"] for line in lines)

    def credit_note(self, customer, line):
        self.net -= line["net"]
        self.vat -= line["vat"]
        self.customer[customer] -= line["gross"]

    def receipt(self, customer, amount):
        self.customer[customer] -= amount
        self.money["employee_N1"] += amount

    def refund(self, customer, amount):
        require(amount <= max(0, -self.customer[customer]), "refund exceeds customer credit")
        require(amount <= self.money["employee_N1"], "refund exceeds cash held")
        self.customer[customer] += amount
        self.money["employee_N1"] -= amount

    def hand_in(self, amount):
        require(amount <= self.money["employee_N1"], "hand-in exceeds cash held")
        self.money["employee_N1"] -= amount
        self.money["cashier"] += amount

    def record(self, event_id, posting_date, description, **extra):
        inventory_value = sum(row["value"] for row in self.stock.values())
        expense_total = sum(self.expense.values())
        ar = sum(max(0, value) for value in self.customer.values())
        credit = sum(max(0, -value) for value in self.customer.values())
        net_cash = sum(self.money.values())
        check(f"{event_id}.inventory_conservation", inventory_value + expense_total, self.cost_in)
        check(f"{event_id}.sales_money_conservation", ar - credit + net_cash, self.net + self.vat)
        require(all(row["quantity"] >= 0 and row["value"] >= 0 for row in self.stock.values()), "negative stock")
        require(all(row["quantity"] != 0 or row["value"] == 0 for row in self.stock.values()), "zero stock with residual value")
        self.events.append({"id": event_id, "posting_date": posting_date, "description": description,
                            "stock": json.loads(json.dumps(self.stock)), "inventory_value": inventory_value,
                            "expense": dict(self.expense), "total_cost_input": self.cost_in,
                            "customer_balances": dict(self.customer), "receivable": ar, "customer_credit": credit,
                            "cash_custody": dict(self.money), "net_sales_before_vat": self.net, "vat_net": self.vat,
                            "gross_sales_net": self.net + self.vat, **extra})


def multi_day_case():
    l = Ledger()
    order_discount = largest_remainder(10001, {"ORDER-P": 31 * 15000, "ORDER-Q": 5 * 30000})
    check("MD.order_discount", order_discount, {"ORDER-P": 7562, "ORDER-Q": 2439})
    p_discount_1 = cumulative(order_discount["ORDER-P"], 31, 20)
    p_discount_2 = order_discount["ORDER-P"] - p_discount_1
    a1p = price_line(300000, p_discount_1, "0.08", "exclusive")
    a1q = price_line(150000, order_discount["ORDER-Q"], "0.10", "exclusive")
    a2p = price_line(165000, p_discount_2, "0.08", "exclusive")
    return_p = return_amounts(a1p, 20, [11])[0]
    b1q = price_line(99000, 0, "0.10", "inclusive")
    check("MD.A1.line_P", [a1p[f] for f in ["net", "vat", "gross"]], [295121, 23610, 318731])
    check("MD.A1.line_Q", [a1q[f] for f in ["net", "vat", "gross"]], [147561, 14756, 162317])
    check("MD.return_P_source_components", [return_p[f] for f in ["net", "vat", "gross"]], [162317, 12986, 175303])
    check("MD.A2.line_P", [a2p[f] for f in ["net", "vat", "gross"]], [162317, 12985, 175302])
    l.receive("MAIN", "P", 60, 600000, purchase=True)
    l.receive("MAIN", "Q", 30, 600000, purchase=True)
    l.record("M01", "2026-11-01", "Receive P: 5 cases x12; Q: 3 cases x10; values exclude recoverable purchase VAT by synthetic assumption")
    l.transfer("MAIN", "TRIP-T1", "P", 36)
    l.transfer("MAIN", "TRIP-T1", "Q", 10)
    l.record("M02", "2026-11-01", "Load T1: P3 cases; Q2 packs x5; transfer creates no sale")
    source_p_cost = l.issue("TRIP-T1", "P", 20, "sold")
    l.issue("TRIP-T1", "P", 2, "gift")
    source_q_cost = l.issue("TRIP-T1", "Q", 5, "sold")
    l.sale("C-A", [a1p, a1q])
    l.record("M03", "2026-11-01", "A1 deliver P20+gift2, Q5; terms T7-v1; due 2026-11-08", invoice_amounts=[a1p, a1q])
    l.receipt("C-A", 500000)
    l.record("M04", "2026-11-01", "Receipt RC1 cash 500000; overpayment becomes customer credit")
    l.record("M05", "2026-11-01", "Custody-only return P11+gift2 pending review; memorandum quantity13, not owned stock or customer credit", third_party_pending_return={"P": 13})
    l.accepted_return("P", 11, cumulative(source_p_cost, 20, 11), "sold")
    l.accepted_return("P", 2, 20000, "gift")
    l.credit_note("C-A", return_p)
    l.record("M06", "2026-11-01", "Accept return R1; P13 reclassified as owned quarantine; customer credit175303", return_amount=return_p)
    l.refund("C-A", 100000)
    l.record("M07", "2026-11-01", "Refund RF1 cash100000 from available credit194255; preserve original receipt")
    l.hand_in(350000)
    l.record("M08", "2026-11-01", "Cashier accepts350000; employee still holds50000; trip remains open")
    l.record("M09", "2026-11-02", "Carry to next calendar day: no new stock, debt, sale, or receipt")
    check("MD.day_rollover_unchanged", {k: l.events[-1][k] for k in ["stock", "customer_balances", "cash_custody"]},
          {k: l.events[-2][k] for k in ["stock", "customer_balances", "cash_custody"]})
    l.receive("MAIN", "P", 24, 288000, purchase=True)
    l.receive("MAIN", "Q", 10, 210000, purchase=True)
    l.record("M10", "2026-11-02", "Receive P2 cases @12000/base; Q1 case @21000/base; T1 valuation unchanged")
    check("MD.replenishment_does_not_reprice_vehicle", l.balance("TRIP-T1", "P"), {"quantity": 14, "value": 140000})
    l.issue("MAIN", "P", 1, "count_loss")
    l.record("M11", "2026-11-02", "Count MAIN scope fenced: P book48 actual47, Q30=30; approve loss11000; T1 open grants untouched",
             count={"scope": "MAIN", "P_book": 48, "P_counted": 47, "P_difference": -1, "loss_value": 11000, "trip_grant_released": False})
    l.issue("TRIP-T1", "P", 11, "sold")
    l.issue("TRIP-T1", "P", 2, "gift")
    l.sale("C-A", [a2p])
    l.record("M12", "2026-11-02", "A2 deliver remaining P11+gift2; net entitlement2; apply explicit customer credit94255; due 2026-11-09",
             invoice_amounts=[a2p], customer_credit_allocation={"id": "ALLOC-A2", "amount": 94255})
    l.issue("TRIP-T1", "Q", 3, "sold")
    l.sale("C-B", [b1q])
    l.receipt("C-B", 60000)
    l.record("M13", "2026-11-02", "B1 Q3 inclusive99000, cash60000 in compound; credit consumed39000; due 2026-11-02",
             invoice_amounts=[b1q], compound_credit_consumed=39000)
    l.transfer("TRIP-T1", "MAIN", "P", 1)
    l.transfer("TRIP-T1", "MAIN", "Q", 2)
    l.record("M14", "2026-11-02", "Return vehicle remainder P1 Q2 preserving values10000/40000; manifest acknowledged in scenario assumption")
    l.hand_in(110000)
    l.record("M15", "2026-11-02", "Cashier accepts final110000; trip T1 closes; quarantine stays blocked")
    check("MD.day2_final_inventory", l.events[-1]["inventory_value"], 1307000)
    check("MD.day2_final_money", [l.net, l.vat, l.events[-1]["receivable"], sum(l.money.values())], [532682, 47365, 120047, 460000])
    l.record("M16", "2026-11-30", "November locked at these values; no additional transactions in synthetic intervening period")
    locked_snapshot = json.loads(json.dumps(l.events[-1]))
    fee = largest_remainder(6001, {"MAIN-Q-original-held22": 22, "A1-Q-sold5": 5, "B1-Q-sold3": 3})
    check("MD.late_cost_allocation", fee, {"MAIN-Q-original-held22": 4401, "A1-Q-sold5": 1000, "B1-Q-sold3": 600})
    l.cost_in += 6001
    l.balance("MAIN", "Q")["value"] += fee["MAIN-Q-original-held22"]
    l.expense["sold"] += fee["A1-Q-sold5"] + fee["B1-Q-sold3"]
    adjusted_q_source = source_q_cost + fee["A1-Q-sold5"]
    l.record("M17", "2026-12-01", "Late cost LC1 for receipt M01 Q; post current open period; source A1-Q cost v2=101000; no November rewrite",
             late_cost_allocation=fee, source_cost_version={"source": "A1-Q", "version": 2, "quantity": 5, "total_cost": adjusted_q_source})
    check("MD.locked_snapshot_stable", locked_snapshot["inventory_value"], 1307000)
    return_q = return_amounts(a1q, 5, [2])[0]
    q_return_cost = cumulative(adjusted_q_source, 5, 2)
    check("MD.return_from_adjusted_closed_source_cost", q_return_cost, 40400)
    check("MD.return_from_closed_source_money", [return_q[f] for f in ["net", "vat", "gross"]], [59024, 5902, 64926])
    l.accepted_return("Q", 2, q_return_cost, "sold")
    l.credit_note("C-A", return_q)
    l.record("M18", "2026-12-02", "Accept R2 Q2 from closed T1/source A1 and locked November; post December; credit64926 explicitly allocated to A2",
             return_amount=return_q, return_cost=q_return_cost, customer_credit_allocation={"id": "ALLOC-R2-A2", "amount": 64926})
    check("MD.final_stock_and_expense", [l.events[-1]["inventory_value"], sum(l.expense.values()), l.cost_in], [1351801, 352200, 1704001])
    check("MD.final_money", [l.net, l.vat, l.events[-1]["receivable"], sum(l.money.values())], [473658, 41463, 55121, 460000])
    return {"sku_uom": {"P": {"base": "bottle", "pack": 6, "case": 12}, "Q": {"base": "packet", "pack": 5, "case": 10}},
            "order_A": {"P_quantity": 31, "Q_quantity": 5, "discount_total": 10001, "discount_allocation": order_discount,
                        "P_discount_delivery_parts": [p_discount_1, p_discount_2]},
            "events": l.events, "locked_november_snapshot": locked_snapshot,
            "provider_projection_candidate": {"invoice_eligible": False,
                "A1": {"net": a1p["net"] + a1q["net"], "vat": a1p["vat"] + a1q["vat"], "gross": a1p["gross"] + a1q["gross"]},
                "R1_credit_components": return_p, "A2": a2p, "B1": b1q, "R2_credit_components": return_q,
                "provider_round_trip_performed": False}}


def export_case():
    rows = [
        {"external_event_id": "TENANT-DEMO:INV-M03-P:1", "document_id": "A1", "line_id": "A1-P", "type": "sale", "net": 295121, "vat": 23610, "gross": 318731},
        {"external_event_id": "TENANT-DEMO:INV-M03-Q:1", "document_id": "A1", "line_id": "A1-Q", "type": "sale", "net": 147561, "vat": 14756, "gross": 162317},
        {"external_event_id": "TENANT-DEMO:RET-M06-P:1", "document_id": "R1", "line_id": "R1-P", "type": "credit", "source_line_id": "A1-P", "net": -162317, "vat": -12986, "gross": -175303},
    ]
    registry = {}
    receipts = []
    for row in rows + rows:
        serialized = json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        payload_hash = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
        key = row["external_event_id"]
        if key in registry:
            require(registry[key] == payload_hash, "same export ID with conflicting hash")
            receipts.append({"id": key, "status": "already_accepted"})
        else:
            registry[key] = payload_hash
            receipts.append({"id": key, "status": "accepted", "hash": payload_hash})
    changed = dict(rows[0], gross=318732)
    changed_hash = hashlib.sha256(json.dumps(changed, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    conflict = registry[changed["external_event_id"]] != changed_hash
    check("EXPORT.repeat_unique_rows", len(registry), 3)
    check("EXPORT.changed_payload_detected", conflict, True)
    return {"rows": rows, "import_receipts_in_memory_only": receipts, "unique_count": len(registry),
            "conflicting_row_result": "quarantine_no_update", "external_system_import_performed": False}


def build_result():
    result = {"fixture_version": "R008-B-v1", "evidence_status": "ARITHMETIC_MODEL_VERIFIED_ONLY",
              "owner_approved": False, "accountant_approved": False, "provider_approved": False,
              "product_tested": False, "pilot_performed": False,
              "tax_profile": {"id": "SYNTHETIC-UNAPPROVED-v1", "invoice_eligible": False, "currency": "VND",
                              "amount_quantum": "1", "rounding": "ROUND_HALF_UP", "tax_rounding_scope": "line",
                              "rates_are_test_inputs_only": ["0.08", "0.10"],
                              "gift_tax_assumption": "SYNTHETIC_ZERO_BASE_GIFT_UNAPPROVED; numeric rate0.08, taxable base0; not a conclusion about real promotion VAT",
                              "purchase_cost_assumption": "costs exclude recoverable input VAT only as synthetic input; no supplier/AP ledger"},
              "gift_cases": gift_cases(), "cost_cases": cost_cases(), "due_date_cases": due_cases(),
              "money_tax_cases": tax_cases(), "compound_cases": compound_cases(),
              "multi_day": multi_day_case(), "export_reference_case": export_case()}
    result["checks"] = CHECKS
    result["summary"] = {"checks_passed": len(CHECKS), "checks_failed": 0, "multi_day_events": len(result["multi_day"]["events"]),
                         "verification_scope": "Arithmetic and deterministic in-memory models only; no app, DB, concurrency, device, accountant, or provider validation."}
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, help="Write deterministic UTF-8 JSON result")
    args = parser.parse_args()
    result = build_result()
    payload = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(payload, encoding="utf-8")
    print(f"R008 arithmetic/model: {len(CHECKS)} checks PASS; 18 event snapshots; product/pilot/approvals NOT verified.")
    if args.output:
        print(f"JSON: {args.output}")
        print(f"SHA256: {hashlib.sha256(payload.encode('utf-8')).hexdigest()}")


if __name__ == "__main__":
    main()
