import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import {
  financeStats,
  listQuotations,
  listInvoices,
  listPayments,
} from "@/services/admin";
import { NotAuthorised } from "@/components/crm/NotAuthorised";

export const metadata: Metadata = { title: "Finance" };
export const dynamic = "force-dynamic";

const QUO_BADGE: Record<string, string> = {
  DRAFT: "neutral",
  SENT: "info",
  APPROVED: "success",
  REJECTED: "error",
  EXPIRED: "warning",
};

const INV_BADGE: Record<string, string> = {
  DRAFT: "neutral",
  ISSUED: "info",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERDUE: "error",
  CANCELLED: "neutral",
  VOID: "neutral",
};

const PAY_BADGE: Record<string, string> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "error",
  REFUNDED: "info",
};

const gbp = (n: number | undefined) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    n ?? 0
  );

export default async function FinancePage() {
  const user = await requireAuth();
  const canQuotations = hasPermission(user.role, "quotations:read");
  const canInvoices = hasPermission(user.role, "invoices:read");
  const canPayments = hasPermission(user.role, "payments:read");

  let stats: Awaited<ReturnType<typeof financeStats>>;
  let quotations: Awaited<ReturnType<typeof listQuotations>>;
  let invoices: Awaited<ReturnType<typeof listInvoices>>;
  let payments: Awaited<ReturnType<typeof listPayments>>;
  try {
    [stats, quotations, invoices, payments] = await Promise.all([
      financeStats(),
      canQuotations ? listQuotations() : Promise.resolve([]),
      canInvoices ? listInvoices() : Promise.resolve([]),
      canPayments ? listPayments() : Promise.resolve([]),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Finance" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="mt-1 text-base-content/70">
          Quotations, invoices and payments across the platform.
        </p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Quotations</div>
          <div className="stat-value">{stats.quotations}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Invoices</div>
          <div className="stat-value">{stats.invoices}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Payments</div>
          <div className="stat-value">{stats.payments}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Invoiced value</div>
          <div className="stat-value text-primary">{gbp(stats.invoicedTotal)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Received</div>
          <div className="stat-value text-success">{gbp(stats.paidTotal)}</div>
        </div>
      </div>

      {canQuotations && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Quotations</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Quotation ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr key={String(q._id)}>
                    <td className="font-mono text-xs">{String(q.quotationId ?? "")}</td>
                    <td className="font-semibold">{gbp(q.amount as number | undefined)}</td>
                    <td>
                      <span className={`badge badge-soft badge-${QUO_BADGE[String(q.status)] ?? "neutral"}`}>
                        {String(q.status ?? "")}
                      </span>
                    </td>
                    <td>{q.issuedAt ? new Date(q.issuedAt as Date).toLocaleDateString() : "—"}</td>
                    <td>{q.approvedAt ? new Date(q.approvedAt as Date).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
                {quotations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-base-content/60">
                      No quotations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {canInvoices && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Invoices</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={String(inv._id)}>
                    <td className="font-mono text-xs">{String(inv.invoiceId ?? "")}</td>
                    <td className="font-semibold">{gbp(inv.amount as number | undefined)}</td>
                    <td>{gbp(inv.paidAmount as number | undefined)}</td>
                    <td>{gbp(inv.balance as number | undefined)}</td>
                    <td>
                      <span className={`badge badge-soft badge-${INV_BADGE[String(inv.status)] ?? "neutral"}`}>
                        {String(inv.status ?? "")}
                      </span>
                    </td>
                    <td>{inv.dueDate ? new Date(inv.dueDate as Date).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-base-content/60">
                      No invoices yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {canPayments && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Payments</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={String(p._id)}>
                    <td className="font-mono text-xs">{String(p.paymentId ?? "")}</td>
                    <td className="font-semibold">{gbp(p.amount as number | undefined)}</td>
                    <td>{String(p.method ?? "—")}</td>
                    <td className="font-mono text-xs">{String(p.reference ?? "—")}</td>
                    <td>
                      <span className={`badge badge-soft badge-${PAY_BADGE[String(p.status)] ?? "neutral"}`}>
                        {String(p.status ?? "")}
                      </span>
                    </td>
                    <td>{p.paidAt ? new Date(p.paidAt as Date).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-base-content/60">
                      No payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
