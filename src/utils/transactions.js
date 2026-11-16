export const FILTERS = ["all", "paid", "pending", "failed"];
export const FILTER_LABELS = { all: "All", paid: "Paid", pending: "Pending", failed: "Failed" };

export function filterTransactions(rows, filter) {
  return filter === "all" ? rows : rows.filter((row) => row.status === filter);
}

// Sorts on raw values (integer paise, epoch ms), never on formatted text.
// Ties always fall back to id so the order is stable and repeatable.
export function sortTransactions(rows, { key, direction }) {
  const factor = direction === "asc" ? 1 : -1;
  const value = (row) => (key === "amount" ? row.amountMinor : Date.parse(row.createdAt));
  return [...rows].sort((a, b) => {
    const diff = value(a) - value(b);
    if (diff !== 0) return diff * factor;
    return a.id < b.id ? -factor : a.id > b.id ? factor : 0;
  });
}
