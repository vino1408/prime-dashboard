import styles from "./TransactionTable.module.css";
import { formatDateTime, formatMoney } from "../utils/format.js";
import { FILTER_LABELS } from "../utils/transactions.js";

const STATUS_CLASS = { paid: styles.paid, pending: styles.pending, failed: styles.failed };

function SortHeader({ label, sortKey, sort, onSort, align }) {
  const sorted = sort.key === sortKey;
  const ariaSort = sorted ? (sort.direction === "asc" ? "ascending" : "descending") : undefined;
  const arrow = sorted ? (sort.direction === "asc" ? "▲" : "▼") : "↕";
  const next = sorted && sort.direction === "desc" ? "ascending" : "descending";
  return (
    <th scope="col" aria-sort={ariaSort} className={align === "end" ? styles.end : undefined}>
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => onSort(sortKey)}
        title={`Sort by ${label}, ${sorted ? next : "descending"}`}
      >
        {label}
        <span aria-hidden="true" className={styles.arrow}>{arrow}</span>
      </button>
    </th>
  );
}

export default function TransactionTable({ rows, filter, sort, onSort }) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>Transaction log</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Order</th>
            <th scope="col">Customer</th>
            <SortHeader label="Date/time (UTC)" sortKey="date" sort={sort} onSort={onSort} />
            <SortHeader label="Amount" sortKey="amount" sort={sort} onSort={onSort} align="end" />
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.orderId}</td>
              <td>{row.customerRef}</td>
              <td>
                <time dateTime={row.createdAt}>{formatDateTime(row.createdAt)}</time>
              </td>
              <td className={styles.end}>{formatMoney(row.amountMinor, row.currency)}</td>
              <td>
                <span className={`${styles.badge} ${STATUS_CLASS[row.status] ?? ""}`}>
                  {FILTER_LABELS[row.status] ?? row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className={styles.empty}>
          {filter === "all"
            ? "There are no transactions in this period."
            : `No ${FILTER_LABELS[filter].toLowerCase()} transactions found. Choose another status or select All to see every transaction.`}
        </p>
      )}
    </div>
  );
}
