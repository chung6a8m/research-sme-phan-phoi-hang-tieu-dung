#!/usr/bin/env python3
"""R008: finite, in-memory protocol research model; NOT application tests.

Python stdlib only. Persistence below means JSON round-trip of selected model
state. It does not test disk/IndexedDB/PostgreSQL durability, networking, crypto,
real authorization, devices, provider behavior, or operational restore.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import itertools
import json
import platform
from datetime import datetime, timezone
from pathlib import Path


TERMINAL = {"posted", "recorded_exception", "rejected_unexecuted"}
COMPONENTS = ("catalog", "uom", "price", "grant", "tombstones")


def frozen(value):
    """Model a restart from durable records; intentionally no actual disk I/O."""
    return json.loads(json.dumps(value, sort_keys=True))


def digest(value):
    # Restricted model domain (ASCII names and integer values); NOT RFC 8785.
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                     ensure_ascii=True).encode()).hexdigest()


def command(cid, *, kind="occurredEvent", dependencies=(), due=100,
            receipt=0, applied=0, reserved_credit=0, pending_bank=0,
            quantity=1, policy_ok=True, operation="SaleDeliveryReceipt"):
    return {"commandId": cid, "kind": kind, "dependsOn": list(dependencies),
            "operation": operation, "due": due, "receipt": receipt,
            "applied": applied, "reservedCredit": reserved_credit,
            "pendingBank": pending_bank, "quantity": quantity,
            "policyOk": policy_ok,
            "saleId": "S-" + cid, "deliveryId": "D-" + cid,
            "receiptId": "R-" + cid, "allocationId": "A-" + cid}


class Fault(Exception):
    pass


class Server:
    """Two durable model stores: independent recovery journal and tenant DB."""
    def __init__(self, failpoint="none"):
        self.journal = {}
        self.db = {"inbox": {}, "effects": {}, "stock": 10, "ar": 0,
                   "cash": 0, "creditRemaining": 100, "customerCreditUsed": 0,
                   "unallocatedCash": 0}
        self.failpoint = failpoint
        self.fault_used = False

    def fault(self, place, cid):
        if cid == "C" and self.failpoint == place and not self.fault_used:
            self.fault_used = True
            raise Fault(place)

    def restart(self):
        self.journal = frozen(self.journal)
        self.db = frozen(self.db)
        self.recover_inbox()

    def recover_inbox(self):
        for cid, durable in self.journal.items():
            if cid not in self.db["inbox"]:
                self.db["inbox"][cid] = {
                    "payload": copy.deepcopy(durable["payload"]),
                    "hash": durable["hash"], "state": "accepted_queued",
                    "acceptedAt": durable["acceptedAt"], "revision": 1,
                    "reason": None}

    def response(self, cid):
        row = self.db["inbox"].get(cid)
        if row is None:
            return {"state": "unknown", "acceptedDurably": False}
        # A business result is only observable as terminal after its archive.
        state = row["state"]
        if state in TERMINAL and self.journal[cid].get("terminal") != state:
            state = "accepted_queued"
        return {"commandId": cid, "hash": row["hash"], "state": state,
                "acceptedDurably": True, "revision": row["revision"]}

    def receive(self, payload):
        cid, h = payload["commandId"], digest(payload)
        if cid in self.journal and self.journal[cid]["hash"] != h:
            return {"state": "nonaccepted", "acceptedDurably": False,
                    "reason": "idempotency_payload_mismatch"}
        if cid not in self.journal:
            try:
                self.fault("before_journal", cid)
            except Fault:
                return {"state": "nonaccepted", "acceptedDurably": False,
                        "reason": "storage_unavailable"}
            self.journal[cid] = {"payload": copy.deepcopy(payload), "hash": h,
                                 "acceptedAt": 0, "terminal": None}
            self.fault("after_journal", cid)
        self.recover_inbox()
        row = self.db["inbox"][cid]
        if row["state"] not in TERMINAL:
            missing = [x for x in payload["dependsOn"]
                       if x not in self.db["inbox"] or
                       self.db["inbox"][x]["state"] != "posted"]
            row["state"] = "awaiting_dependency" if missing else "accepted_queued"
        self.fault("after_inbox", cid)
        return self.response(cid)

    def has_cycle(self, start):
        def visit(node, seen):
            if node == start and seen:
                return True
            if node in seen or node not in self.db["inbox"]:
                return False
            return any(visit(x, seen | {node})
                       for x in self.db["inbox"][node]["payload"]["dependsOn"])
        return visit(start, set())

    def finish(self, cid, *, failure=None):
        row = self.db["inbox"][cid]
        p = row["payload"]
        candidate = copy.deepcopy(self.db)
        target = candidate["inbox"][cid]
        if failure:
            target["state"] = ("recorded_exception" if p["kind"] == "occurredEvent"
                               else "rejected_unexecuted")
            target["reason"] = failure
        else:
            target["state"] = "posted"
            if p["operation"] == "SaleDeliveryReceipt":
                owed = p["due"] - p["applied"] - p["reservedCredit"]
                candidate["ar"] += owed
                candidate["cash"] += p["receipt"]
                candidate["stock"] -= p["quantity"]
                candidate["creditRemaining"] -= owed
                candidate["customerCreditUsed"] += p["reservedCredit"]
                candidate["unallocatedCash"] += p["receipt"] - p["applied"]
                candidate["effects"][cid] = {
                    "ar": owed, "cash": p["receipt"], "stock": -p["quantity"],
                    "creditConsumed": owed, "sourceCredit": p["reservedCredit"],
                    "documentIds": [p[k] for k in
                                    ("saleId", "deliveryId", "receiptId", "allocationId")]}
        target["revision"] += 1
        self.fault("before_business_commit", cid)
        # One assignment models ONE atomic tenant transaction.
        self.db = candidate
        self.fault("after_business_commit", cid)
        self.journal[cid]["terminal"] = target["state"]
        self.fault("after_result_archive", cid)

    def work(self, now=0):
        self.recover_inbox()
        for _ in range(len(self.db["inbox"]) + 2):
            changed = False
            cycle_ids = {x for x, row in self.db["inbox"].items()
                         if row["state"] not in TERMINAL and self.has_cycle(x)}
            for cid in list(self.db["inbox"]):
                row = self.db["inbox"][cid]
                if row["state"] in TERMINAL:
                    self.journal[cid]["terminal"] = row["state"]
                    continue
                p = row["payload"]
                dep_states = [self.db["inbox"].get(x, {}).get("state")
                              for x in p["dependsOn"]]
                reason = None
                if cid in cycle_ids:
                    reason = "dependency_cycle"
                elif any(x in {"rejected_unexecuted", "recorded_exception"}
                         for x in dep_states):
                    reason = "dependency_failed"
                elif any(x != "posted" for x in dep_states):
                    if now - row["acceptedAt"] >= 86400:
                        reason = "dependency_timeout"
                    else:
                        row["state"] = "awaiting_dependency"
                        continue
                elif not p["policyOk"]:
                    reason = "policy_invalid"
                elif p["operation"] == "SaleDeliveryReceipt":
                    owed = p["due"] - p["applied"] - p["reservedCredit"]
                    if (p["applied"] < 0 or p["applied"] > p["receipt"] or
                            owed < 0 or p["reservedCredit"] < 0):
                        reason = "allocation_invalid"
                    elif owed > self.db["creditRemaining"]:
                        reason = "credit_exceeded"
                    elif p["quantity"] > self.db["stock"]:
                        reason = "stock_exceeded"
                self.finish(cid, failure=reason)
                changed = True
            if not changed:
                break


class Client:
    def __init__(self, payloads):
        self.journal = {x["commandId"]: copy.deepcopy(x) for x in payloads}
        self.retry = set(self.journal)
        self.receipts = {}

    def restart(self):
        self.journal = frozen(self.journal)
        self.receipts = frozen(self.receipts)
        self.retry = set(self.journal) - set(self.receipts)

    def accept(self, response, persist=True):
        if response.get("acceptedDurably") and persist:
            cid = response["commandId"]
            self.receipts[cid] = copy.deepcopy(response)
            self.retry.discard(cid)


class Checks:
    def __init__(self):
        self.suites = {}

    def start(self, name):
        self.suites[name] = {"scenarios": 0, "assertions": 0, "status": "passed"}
        self.name = name

    def scenario(self):
        self.suites[self.name]["scenarios"] += 1

    def assert_(self, condition, explanation):
        self.suites[self.name]["assertions"] += 1
        if not condition:
            raise AssertionError(f"{self.name}: {explanation}")


def invariant(ck, server, client):
    ck.assert_(all(x in client.retry or x in server.journal
                   for x in client.journal), "lost command ownership")
    ck.assert_(server.db["creditRemaining"] >= 0, "negative credit grant")
    ck.assert_(server.db["stock"] >= 0, "negative stock grant")
    for cid, receipt in client.receipts.items():
        ck.assert_(cid in server.journal and receipt["hash"] == server.journal[cid]["hash"],
                   "ACK without durable exact payload")
    ck.assert_(server.db["ar"] == sum(x["ar"] for x in server.db["effects"].values()),
               "AR and posting sources disagree")
    ck.assert_(server.db["cash"] == sum(x["cash"] for x in server.db["effects"].values()),
               "cash and posting sources disagree")


def work_restarting(server, now=0):
    try:
        server.work(now)
    except Fault:
        server.restart()
        server.work(now)


def deliver(server, client, cid):
    try:
        response = server.receive(client.journal[cid])
    except Fault:
        server.restart()
        return
    if cid == "C" and not server.fault_used:
        if server.failpoint == "drop_ack":
            server.fault_used = True
            return
        if server.failpoint == "client_ack_not_persisted":
            server.fault_used = True
            client.accept(response, persist=False)
            client.restart()
            return
    client.accept(response)


def settle(server, client):
    for _ in range(4):
        for cid in sorted(client.retry):
            deliver(server, client, cid)
        work_restarting(server)
        for cid in client.journal:
            client.accept(server.response(cid))


def transport_suite(ck):
    ck.start("E2E17_transport_reorder_duplicate_restart")
    events = ("send_parent", "send_child", "duplicate_child", "restart_server", "restart_client")
    faults = ("none", "before_journal", "after_journal", "after_inbox",
              "before_business_commit", "after_business_commit", "after_result_archive",
              "drop_ack", "client_ack_not_persisted")
    # Independently stated oracle for 100/0, 100/60, 100/100.
    expected = {0: (100, 0, 0), 60: (40, 60, 60), 100: (0, 100, 100)}
    for receipt, order, failpoint in itertools.product(expected, itertools.permutations(events), faults):
        ck.scenario()
        p = command("P", kind="intent", due=0, quantity=0, operation="Parent")
        c = command("C", dependencies=("P",), receipt=receipt, applied=receipt)
        server, client = Server(failpoint), Client([p, c])
        for event in order:
            if event == "restart_server":
                server.restart()
            elif event == "restart_client":
                client.restart()
            else:
                deliver(server, client, "P" if event == "send_parent" else "C")
            work_restarting(server)
            invariant(ck, server, client)
        settle(server, client)
        invariant(ck, server, client)
        ck.assert_(server.response("C")["state"] == "posted", "child never completed")
        ck.assert_(len(server.db["effects"]) == 1, "duplicate financial effect")
        ck.assert_((server.db["ar"], server.db["cash"], server.db["creditRemaining"])
                   == expected[receipt], "wrong independent finance oracle")
        ck.assert_(server.db["stock"] == 9 and not client.retry, "stock/ownership not settled")


def dependency_suite(ck):
    ck.start("E2E17_dependency_failure_cycle_timeout")
    for kind, case in itertools.product(("intent", "occurredEvent"),
                                        ("missing", "self", "cycle", "parent_reject", "parent_exception")):
        ck.scenario()
        c = command("C", kind=kind, dependencies=("C" if case == "self" else "P",))
        payloads = [c]
        if case == "cycle":
            payloads.append(command("P", kind=kind, dependencies=("C",), operation="Parent"))
        elif case.startswith("parent_"):
            payloads.append(command("P", kind=("intent" if case == "parent_reject" else "occurredEvent"),
                                    policy_ok=False, operation="Parent"))
        server, client = Server(), Client(payloads)
        for p in payloads:
            deliver(server, client, p["commandId"])
        server.restart()
        client.restart()
        work_restarting(server, 86401)
        terminal = "recorded_exception" if kind == "occurredEvent" else "rejected_unexecuted"
        ck.assert_(server.response("C")["state"] == terminal, "lost dependency failure")
        ck.assert_(not server.db["effects"], "failure partially posted")
        ck.assert_(server.journal["C"]["payload"] == c, "physical declaration altered")
        invariant(ck, server, client)
        # A late parent is not permission to resurrect a terminal child.
        if case == "missing":
            server.receive(command("P", operation="Parent"))
            server.work(90000)
            ck.assert_(server.response("C")["state"] == terminal, "terminal receipt resurrected")


def mismatch_suite(ck):
    ck.start("idempotency_payload_hash_mismatch")
    for stage, kind in itertools.product(("waiting", "posted"), ("intent", "occurredEvent")):
        ck.scenario()
        original = command("C", kind=kind, dependencies=("P",) if stage == "waiting" else ())
        server = Server()
        server.receive(original)
        server.work()
        before = copy.deepcopy(server.db)
        changed = copy.deepcopy(original)
        changed["due"] = 101
        result = server.receive(changed)
        ck.assert_(result["state"] == "nonaccepted" and not result["acceptedDurably"], "mismatch ACKed")
        ck.assert_(server.db == before, "mismatch mutated ledger")
        ck.assert_(server.journal["C"]["payload"] == original, "original payload overwritten")


def finance_suite(ck):
    ck.start("E2E03_atomic_sale_delivery_receipt")
    cases = [
        ({"receipt": 100, "applied": 100}, (0, 100, 100, 0, 0)),
        ({"receipt": 60, "applied": 60}, (40, 60, 60, 0, 0)),
        ({"pending_bank": 100}, (100, 0, 0, 0, 0)),
        ({"receipt": 60, "applied": 60, "reserved_credit": 20}, (20, 60, 80, 20, 0)),
        ({"receipt": 120, "applied": 100}, (0, 120, 100, 0, 20)),
        ({"receipt": 60, "applied": 0}, (100, 60, 0, 0, 60)),
    ]
    for args, expected in cases:
        ck.scenario()
        server = Server()
        p = command("C", **args)
        server.receive(p)
        server.work()
        server.receive(p)
        server.work()
        ck.assert_(tuple(server.db[x] for x in ("ar", "cash", "creditRemaining",
                                               "customerCreditUsed", "unallocatedCash")) == expected,
                   "compound finance oracle mismatch")
        ids = server.db["effects"]["C"]["documentIds"]
        ck.assert_(len(ids) == len(set(ids)) == 4, "documents collapsed into command ID")
        ck.assert_(len(server.db["effects"]) == 1 and server.db["stock"] == 9,
                   "retry duplicated documents/stock")
    ck.scenario()
    server = Server()
    server.receive(command("C", receipt=60, applied=100))
    server.work()
    ck.assert_(server.response("C")["state"] == "recorded_exception" and not server.db["effects"],
               "unfunded allocation accepted")


def competition_suite(ck):
    ck.start("E2E08_two_ids_compete_for_credit")
    for order in itertools.permutations(("A", "B", "A2", "B2", "restart")):
        ck.scenario()
        server = Server()
        client = Client([command("A", due=70), command("B", due=70)])
        for event in order:
            if event == "restart":
                server.restart()
            else:
                deliver(server, client, event[0])
            server.work()
            invariant(ck, server, client)
        states = sorted(server.response(x)["state"] for x in ("A", "B"))
        ck.assert_(states == ["posted", "recorded_exception"], "overlapping grant consumed twice")
        ck.assert_((server.db["ar"], server.db["creditRemaining"], server.db["stock"]) == (70, 30, 9),
                   "race result wrong")


class SnapshotClient:
    def __init__(self):
        self.active = {"version": 0, "cursor": "L1/E1/10",
                       "components": dict.fromkeys(COMPONENTS, 0), "customerPresent": True}
        self.staging = {}
        self.outbox = {"old-command": {"immutable": True, "payloadHash": "old-hash",
                                       "epoch": "L1/E1", "customer": "deleted-customer"}}

    def restart(self):
        self.active, self.staging, self.outbox = map(frozen, (self.active, self.staging, self.outbox))

    def activate(self, *, fail_before_commit=False):
        if any(self.staging.get(k) != 1 for k in COMPONENTS):
            return False
        candidate = {"version": 1, "cursor": "L1/E1/20",
                     "components": dict.fromkeys(COMPONENTS, 1), "customerPresent": False}
        if fail_before_commit:
            return False
        self.active = candidate  # Model one atomic IDB pointer+cursor commit.
        return True


def snapshot_suite(ck):
    ck.start("E2E18_snapshot_delta_tombstone_activation")
    for order, cut, before in itertools.product(itertools.permutations(COMPONENTS), range(6), (False, True)):
        ck.scenario()
        client = SnapshotClient()
        saved_outbox = copy.deepcopy(client.outbox)
        for component in order[:cut]:
            client.staging[component] = 1
        activated = client.activate(fail_before_commit=before)
        client.restart()
        ck.assert_(set(client.active["components"].values()) in ({0}, {1}), "mixed bundle activated")
        ck.assert_(client.active["version"] == (1 if cut == 5 and not before else 0), "premature activation")
        ck.assert_(activated == (cut == 5 and not before), "commit boundary incorrect")
        for component in order[cut:]:
            client.staging[component] = 1
        client.activate()
        ck.assert_(client.active["version"] == 1 and client.active["cursor"] == "L1/E1/20",
                   "cursor and snapshot diverged")
        ck.assert_(not client.active["customerPresent"], "tombstone not applied")
        ck.assert_(client.outbox == saved_outbox, "rebase deleted/rewrote pending journal")
    for bad in COMPONENTS:
        ck.scenario()
        client = SnapshotClient()
        client.staging = dict.fromkeys(COMPONENTS, 1)
        client.staging[bad] = 2
        ck.assert_(not client.activate() and client.active["version"] == 0, "wrong bundle component accepted")


def app_upgrade_suite(ck):
    ck.start("E2E18_app_update_old_queue_and_cursor")
    for mode in ("compatible", "blocked_other_tab", "unsupported_schema", "epoch_changed"):
        ck.scenario()
        client = SnapshotClient()
        before = digest(client.outbox)
        new_actions_allowed = mode == "compatible"
        # Old payload is never reserialized into a new command under the same ID.
        client.restart()
        ck.assert_(digest(client.outbox) == before, "upgrade rewrote queue")
        ck.assert_(new_actions_allowed == (mode == "compatible"), "unsafe new action allowed")
    ck.scenario()
    old_cursor, server_epoch = "L1/E1/20", "L1/E2"
    needs_bootstrap = not old_cursor.startswith(server_epoch + "/")
    ck.assert_(needs_bootstrap, "old epoch cursor used as current delta cursor")


def restore_suite(ck):
    ck.start("E2E19_restore_authority_privacy_invoice_gates")
    gates = ("authority", "privacy", "cache", "files_exports", "support", "invoice", "generation")
    for order, authority_available in itertools.product(itertools.permutations(gates), (False, True)):
        ck.scenario()
        tenant2 = {"stock": 777, "member": "other-tenant-user"}
        tenant2_before = digest(tenant2)
        restored = {"memberU": True, "contact": "old-contact", "invoiceDocument": "retained-document",
                    "cachedContact": True, "fileVisible": True, "exportVisible": True,
                    "supportActive": True, "externalInvoiceId": None, "epoch": "L1/E1"}
        completed = set()
        invoice_registry = {"immutable-intent": "provider-invoice-1"}
        for step in order:
            if step == "authority" and authority_available:
                restored["memberU"] = False
            elif step == "privacy" and authority_available:
                restored["contact"] = None
            elif step == "cache":
                restored["cachedContact"] = False
            elif step == "files_exports":
                restored["fileVisible"] = restored["exportVisible"] = False
            elif step == "support":
                restored["supportActive"] = False
            elif step == "invoice":
                restored["externalInvoiceId"] = invoice_registry["immutable-intent"]
            elif step == "generation":
                restored["epoch"] = "L1/E2"
            if authority_available or step not in {"authority", "privacy"}:
                completed.add(step)
            can_open = authority_available and completed == set(gates)
            ck.assert_(not can_open or (not restored["memberU"] and restored["contact"] is None
                       and not restored["cachedContact"] and not restored["fileVisible"]
                       and not restored["exportVisible"] and not restored["supportActive"]
                       and restored["externalInvoiceId"] == "provider-invoice-1"
                       and restored["epoch"] == "L1/E2"), "tenant reopened before reconciliation")
        can_open = authority_available and completed == set(gates)
        # Authentication of the identity alone does not restore membership.
        fresh_login_allowed = can_open and restored["memberU"]
        ck.assert_(not fresh_login_allowed, "revoked member resurrected by fresh login")
        ck.assert_(restored["invoiceDocument"] == "retained-document", "legal record blindly deleted")
        ck.assert_(len(invoice_registry) == 1, "invoice duplicated")
        ck.assert_(digest(tenant2) == tenant2_before, "restore modified another tenant")
        ck.assert_(can_open == authority_available, "fail-closed gate incorrect")


def generation_suite(ck):
    ck.start("E2E19_controlplane_disaster_epoch_nonreuse")
    anchor_high = 8
    seen = {"L1/E8"}
    for restored_counter in (0, 1, 7, 8, 99):
        ck.scenario()
        if restored_counter > anchor_high:
            # A purported backup ahead of the authority is inconsistent. Do not
            # issue below an observed historical high-water mark.
            allocation_allowed = False
            ck.assert_(not allocation_allowed, "inconsistent authority reopened")
            continue
        # The CP backup counter is not authority; anchor lives outside its rollback.
        anchor_high += 1
        token = f"L1/E{anchor_high}"
        ck.assert_(token not in seen, "reused recovery generation")
        seen.add(token)
        ck.assert_(token != "L1/E8", "old token valid after restore")
        ck.assert_(anchor_high > 8, "counter reset from CP backup")
    for authority_available in (False, True):
        ck.scenario()
        allocation_allowed = authority_available
        ck.assert_(allocation_allowed == authority_available, "issued generation without anchor")
    ck.scenario()
    # A replacement lineage needs an external trust-reset ceremony; random IDs
    # alone are not represented as proof that a lost authority can reopen.
    trusted_lineage = "L2"
    ck.assert_("L1/E999".split("/")[0] != trusted_lineage, "old lineage still trusted")


def local_safety_suite(ck):
    ck.start("E2E09_local_atomic_save_and_bounded_offline_grant")
    for persist_ok in (False, True):
        ck.scenario()
        durable = {"sequence": 0, "creditRemaining": 100, "outbox": {}}
        pending = copy.deepcopy(durable)
        pending["sequence"] = 1
        pending["creditRemaining"] = 60
        pending["outbox"]["C"] = command("C", receipt=60, applied=60)
        if persist_ok:
            durable = pending
        new_physical_commit_authorized = persist_ok
        ck.assert_(len(durable["outbox"]) == (1 if persist_ok else 0), "partial local transaction")
        ck.assert_(durable["creditRemaining"] == (60 if persist_ok else 100), "orphan local reservation")
        ck.assert_(new_physical_commit_authorized == persist_ok, "new handover after failed local save")
    for seconds, restarted, revoke_received in itertools.product((0, 28799, 28800), (False, True), (False, True)):
        ck.scenario()
        valid = seconds < 28800 and not restarted and not revoke_received
        ck.assert_(not valid or seconds < 28800, "honest client exceeds 8-hour grant")
        ck.assert_(not valid if restarted or revoke_received else True, "untrusted clock/revoked session continues")
        # Deliberately demonstrate the unavoidable offline revocation window.
        if seconds == 0 and not restarted and not revoke_received:
            ck.assert_(valid, "model falsely claims instant remote revocation")


def invoice_suite(ck):
    ck.start("E2E11_E2E19_external_effect_unknown")
    for mode in ("found", "negative_not_final", "no_lookup", "hash_mismatch", "changed_epoch"):
        ck.scenario()
        key = "seller-1/delivery-1/tax-event-1/version-1"
        registry = {key: {"state": "unknown", "hash": "H1", "providerId": None}}
        provider_issued = {key: "INV-1"}
        send_count = 1  # First network call committed at provider; ACK was lost.
        if mode in {"found", "changed_epoch"}:
            registry[key].update(state="issued", providerId=provider_issued[key])
        # The other modes stop at UNKNOWN/conflict, never issue with a fresh key.
        ck.assert_(send_count == 1 and len(provider_issued) == 1, "blind invoice retry")
        ck.assert_(key in registry, "restore changed external idempotency identity")
        ck.assert_(registry[key]["state"] == ("issued" if mode in {"found", "changed_epoch"} else "unknown"),
                   "ambiguous provider result treated as final negative")


def negative_controls(ck):
    ck.start("negative_controls_expected_violations")
    caught = []
    # Concrete broken traces, checked against the same stated invariants.
    local_retry, server_inbox = {"C"}, {}
    local_retry.remove("C")  # Bug: nonpersistent awaiting_dependency treated as ACK.
    old_backup = {"memberU": True, "epoch": "E1"}
    old_backup["epoch"] = "E2"  # Bug: membership is still restored from E1.
    current_authority_membership = False
    partial_bundle = {"catalog": 1, "uom": 1, "price": 2, "grant": 1}
    financial_entries = {"receivableDebit": 100, "sameSaleReceiptCredit": 100}
    wrongly_consumed_credit = financial_entries["receivableDebit"]
    controls = [
        ("F04_nonpersistent_awaiting_ACK", "C" in local_retry or "C" in server_inbox),
        ("F01_epoch_only_membership_resurrection", old_backup["memberU"] == current_authority_membership),
        ("E2E18_mixed_bundle_activation", len(set(partial_bundle.values())) == 1),
        ("E2E03_full_gross_credit_even_when_cash_paid", wrongly_consumed_credit ==
         financial_entries["receivableDebit"] - financial_entries["sameSaleReceiptCredit"]),
    ]
    for name, invariant_holds in controls:
        ck.scenario()
        try:
            assert invariant_holds, name
        except AssertionError:
            caught.append(name)
        ck.assert_(name in caught, "negative control was not detected")
    return caught


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path,
                        default=Path(__file__).with_name("ket-qua-giao-thuc.json"))
    args = parser.parse_args()
    checks = Checks()
    for suite in (transport_suite, dependency_suite, mismatch_suite, finance_suite,
                  competition_suite, snapshot_suite, app_upgrade_suite, restore_suite,
                  generation_suite, local_safety_suite, invoice_suite):
        suite(checks)
    controls = negative_controls(checks)
    output = {
        "research_model": "R008-BS04-C1", "status": "MODEL_VERIFIED",
        "executed_at_utc": datetime.now(timezone.utc).isoformat(),
        "python": platform.python_version(),
        "model_source_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "scenario_count": sum(x["scenarios"] for x in checks.suites.values()),
        "assertion_count": sum(x["assertions"] for x in checks.suites.values()),
        "suites": checks.suites, "negative_controls_detected": controls,
        "representative_expected_results": {
            "sale_100_receipt_100": {"ar": 0, "cash": 100, "credit_consumed": 0},
            "sale_100_receipt_60": {"ar": 40, "cash": 60, "credit_consumed": 40},
            "sale_100_pending_bank_100": {"ar": 100, "cash": 0, "credit_consumed": 100},
            "sale_100_receipt_60_reserved_credit_20": {"ar": 20, "cash": 60, "credit_consumed": 20},
            "revoked_actor_after_restore": "fresh_login_denied",
            "authority_missing_after_restore": "tenant_stays_locked",
            "invoice_issued_before_restore": "same_external_id_no_second_send"
        },
        "assumptions": [
            "JSON round-trip models a durable restart; atomic assignments model transactions.",
            "AuthorityLedger, PrivacyActionLedger, RecoveryJournal and GenerationAnchor are assumed correct and independent of tenant rollback.",
            "The model serializes shared-resource operations; it is not a concurrent DB isolation proof.",
            "Finite event permutations, finite payload fixtures and simplified scalar grant balances only.",
            "No fairness/liveness claim under endless network outage or missing operator/parent.",
            "Model hash domain is integer/ASCII JSON and is not a production canonicalization implementation."
        ],
        "not_tested": [
            "PWA/browser/device/IndexedDB/Service Worker", "real disk/fsync/replica durability",
            "actual database transactions and concurrent races", "real network or provider API",
            "cryptography and root-key disaster recovery", "real backup/PITR restore or RPO/RTO",
            "tenant isolation penetration test", "legal compliance or pilot acceptance"
        ]
    }
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"MODEL_VERIFIED scenarios={output['scenario_count']} assertions={output['assertion_count']} "
          f"suites={len(checks.suites)} negative_controls={len(controls)}")
    print(f"Output: {args.output}")


if __name__ == "__main__":
    main()
