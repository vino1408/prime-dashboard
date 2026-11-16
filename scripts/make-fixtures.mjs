// Generates stand-in fixtures that match the documented mock API contract.
// Replace public/mock/*.json with the supplied files if you have them.
import { writeFileSync } from "node:fs";

const statuses = ["paid","paid","pending","paid","failed","paid","paid","pending","paid","paid","failed","paid",
                  "paid","pending","paid","paid","failed","paid","pending","paid","paid","failed","paid","pending"];
const amounts = [129900,45000,89950,249900,19900,75000,45000,159900,32500,599900,64900,89950,
                 12500,199900,45000,349900,27900,75000,98900,15900,429900,54900,89950,24900];
const days = [1,1,1,2,2,2,3,3,3,4,4,5,5,5,6,6,6,7,7,7,8,8,8,8];
const times = ["04:12:09","09:45:31","17:20:44","06:05:12","11:30:00","20:15:48","08:00:27","13:42:10","22:09:55",
               "10:10:10","15:55:02","07:25:36","12:00:00","12:00:00","18:48:19","05:33:41","21:07:23",
               "09:09:09","14:14:14","19:59:59","03:21:17","10:44:50","16:38:05","23:12:31"];

const transactions = statuses.map((status, i) => ({
  id: `TXN-${String(i + 1).padStart(4, "0")}`,
  orderId: `ORD-${50210 + i * 7}`,
  customerRef: `CUST-${1001 + ((i * 5) % 17)}`,
  amountMinor: amounts[i],
  currency: "INR",
  status,
  createdAt: `2026-11-0${days[i]}T${times[i]}Z`,
}));

const paid = transactions.filter(t => t.status === "paid");
const summary = {
  currency: "INR",
  totalTransactions: transactions.length,
  paidSalesMinor: paid.reduce((s, t) => s + t.amountMinor, 0),
  paidCount: paid.length,
  pendingCount: transactions.filter(t => t.status === "pending").length,
  failedCount: transactions.filter(t => t.status === "failed").length,
  periodStart: "2026-11-01",
  periodEnd: "2026-11-08",
};
writeFileSync("public/mock/summary.json", JSON.stringify(summary, null, 2) + "\n");
writeFileSync("public/mock/transactions.json", JSON.stringify({ transactions }, null, 2) + "\n");
console.log(summary);
