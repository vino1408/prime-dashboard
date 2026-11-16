// Shared API module. Paths respect Vite's `base` so subpath hosting still works.
const base = import.meta.env.BASE_URL;

async function getJson(path, signal) {
  const response = await fetch(`${base}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`Request for ${path} failed (HTTP ${response.status})`);
  }
  return response.json();
}

export function fetchSummary(signal) {
  return getJson("mock/summary.json", signal);
}

export async function fetchTransactions(signal) {
  const data = await getJson("mock/transactions.json", signal);
  if (!data || !Array.isArray(data.transactions)) {
    throw new Error("Transactions response is missing the transactions array");
  }
  return data.transactions;
}
