import styles from "./MetricCard.module.css";

export default function MetricCard({ label, value, active, onSelect }) {
  const className = active ? `${styles.card} ${styles.active}` : styles.card;
  return (
    <button type="button" className={className} aria-pressed={active} onClick={onSelect}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </button>
  );
}
