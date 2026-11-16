import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterTransactions, sortTransactions } from "../src/utils/transactions.js";

const { transactions } = JSON.parse(readFileSync("public/mock/transactions.json", "utf8"));
const summary = JSON.parse(readFileSync("public/mock/summary.json", "utf8"));

test("summary matches transactions", () => {
  const paid = transactions.filter((t) => t.status === "paid");
  assert.equal(summary.totalTransactions, transactions.length);
  assert.equal(summary.paidSalesMinor, paid.reduce((s, t) => s + t.amountMinor, 0));
  assert.equal(new Set(transactions.map((t) => t.id)).size, transactions.length);
});

test("filters by status", () => {
  for (const s of ["paid", "pending", "failed"]) {
    assert.ok(filterTransactions(transactions, s).every((t) => t.status === s));
  }
  assert.equal(filterTransactions(transactions, "all").length, 24);
});

test("default sort is newest first with id tie-break", () => {
  const rows = sortTransactions(transactions, { key: "date", direction: "desc" });
  for (let i = 1; i < rows.length; i++) {
    const a = Date.parse(rows[i - 1].createdAt), b = Date.parse(rows[i].createdAt);
    assert.ok(a >= b);
    if (a === b) assert.ok(rows[i - 1].id > rows[i].id);
  }
});

test("amount sort compares raw paise both directions", () => {
  const asc = sortTransactions(transactions, { key: "amount", direction: "asc" });
  const desc = sortTransactions(transactions, { key: "amount", direction: "desc" });
  for (let i = 1; i < asc.length; i++) assert.ok(asc[i - 1].amountMinor <= asc[i].amountMinor);
  assert.deepEqual(desc.map((t) => t.id), [...asc].reverse().map((t) => t.id));
});
