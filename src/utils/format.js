const dateTime = new Intl.DateTimeFormat("en-IN", {
  timeZone: "UTC",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateOnly = new Intl.DateTimeFormat("en-IN", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatMoney(minor, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(minor / 100);
}
export const formatDateTime = (iso) => dateTime.format(new Date(iso));
// periodStart/periodEnd are plain dates; parse as UTC so no local shift occurs.
export const formatDate = (day) => dateOnly.format(new Date(`${day}T00:00:00Z`));
