import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";
import MetricCard from "./components/MetricCard.jsx";
import TransactionTable from "./components/TransactionTable.jsx";
import { fetchSummary, fetchTransactions } from "./api.js";
import { formatDate, formatMoney } from "./utils/format.js";
import { FILTERS, FILTER_LABELS, filterTransactions, sortTransactions } from "./utils/transactions.js";

export default function App() {
  const [state, setState] = useState({ status: "loading", summary: null, transactions: [], error: "" });
  // Filter and sort are owned here so cards, select and table share them.
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  const load = useCallback((signal) => {
    setState((prev) => ({ ...prev, status: "loading", error: "" }));
    Promise.all([fetchSummary(signal), fetchTransactions(signal)])
      .then(([summary, transactions]) => setState({ status: "ready", summary, transactions, error: "" }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "error", summary: null, transactions: [], error: err.message });
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const visibleRows = useMemo(
    () => sortTransactions(filterTransactions(state.transactions, filter), sort),
    [state.transactions, filter, sort]
  );

  const toggleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );

  const { summary } = state;
  const cards = summary
    ? [
        { filter: "all", label: "All Transactions", value: summary.totalTransactions.toLocaleString("en-IN") },
        { filter: "paid", label: "Paid Sales", value: formatMoney(summary.paidSalesMinor, summary.currency) },
        { filter: "pending", label: "Pending", value: summary.pendingCount.toLocaleString("en-IN") },
        { filter: "failed", label: "Failed", value: summary.failedCount.toLocaleString("en-IN") },
      ]
    : [];

  return (
    <main className={styles.frame}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sales dashboard</h1>
        {summary && (
          <p className={styles.period}>
            {formatDate(summary.periodStart)} to {formatDate(summary.periodEnd)} (UTC)
          </p>
        )}
      </header>

      {state.status === "loading" && (
        <p className={styles.notice} role="status">Loading sales data…</p>
      )}

      {state.status === "error" && (
        <div className={styles.error} role="alert">
          <p>We couldn’t load the sales data. {state.error}</p>
          <button type="button" className={styles.retry} onClick={() => load()}>
            Retry
          </button>
        </div>
      )}

      {state.status === "ready" && (
        <div className={styles.grid}>
          {cards.map((card) => (
            <div key={card.filter} className={styles.cardCell}>
              <MetricCard
                label={card.label}
                value={card.value}
                active={filter === card.filter}
                onSelect={() => setFilter(card.filter)}
              />
            </div>
          ))}

          <section className={styles.tableRegion} aria-labelledby="log-heading">
            <div className={styles.toolbar}>
              <h2 id="log-heading" className={styles.heading}>Transaction log</h2>
              <div className={styles.controls}>
                <label htmlFor="status-filter" className={styles.selectLabel}>Status</label>
                <select
                  id="status-filter"
                  className={styles.select}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {FILTERS.map((f) => (
                    <option key={f} value={f}>{FILTER_LABELS[f]}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className={styles.count} role="status">
              Showing {visibleRows.length} of {state.transactions.length} transactions
            </p>
            <TransactionTable rows={visibleRows} filter={filter} sort={sort} onSort={toggleSort} />
          </section>
        </div>
      )}
    </main>
  );
}
