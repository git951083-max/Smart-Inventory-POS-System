import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById } from "../../service/sales.service";
import type { SaleItemResponse,Sale } from "../../service/sales.service";

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    UNPAID: "bg-red-50 text-red-600 border-red-200",
    PARTIAL: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
        map[status] ?? "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {status === "PAID" && "✓ "}{status}
    </span>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getSaleById(id);
        setSale(res.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        setError(error?.response?.data?.message || "Failed to load sale");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handlePrint = () => window.print();

  // ── Loading ──
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#f4f6fb] p-6"
        style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !sale) {
    return (
      <div
        className="min-h-screen bg-[#f4f6fb] p-6 flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      >
        <div className="text-center">
          <span className="text-5xl">⚠️</span>
          <p className="text-gray-600 mt-3 text-sm">{error || "Sale not found"}</p>
          <button
            onClick={() => navigate("/dashboard/sales")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all"
          >
            ← Back to Sales
          </button>
        </div>
      </div>
    );
  }

  const items: SaleItemResponse[] = sale.items ?? [];
  const subtotal = Number(sale.subtotal);
  const discountTotal = Number(sale.discountTotal);
  const taxTotal = Number(sale.taxTotal);
  const grandTotal = Number(sale.grandTotal);

  return (
    <div
      className="min-h-screen bg-[#f4f6fb] p-6"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-5 text-sm">
          <button
            onClick={() => navigate("/dashboard/sales")}
            className="text-gray-500 hover:text-indigo-600 transition-colors font-medium"
          >
            Sales
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold">Invoice Detail</span>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                🧾
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Invoice Detail</h1>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{sale.invoiceNo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={sale.paymentStatus} />
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 print:hidden"
              >
                🖨️ Print
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* ── Invoice Info Grid ── */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Sale Info
                </p>
                <div className="space-y-0.5">
                  <InfoRow label="Invoice No" value={sale.invoiceNo} />
                  <InfoRow
                    label="Customer"
                    value={sale.customerId || "Walk-in Customer"}
                  />
                  <InfoRow
                    label="Payment"
                    value={sale.paymentMethod}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Details
                </p>
                <div className="space-y-0.5">
                  <InfoRow
                    label="Cashier"
                    value={sale.cashierId || "—"}
                  />
                  <InfoRow
                    label="Date"
                    value={new Date(sale.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  <InfoRow label="Status" value={sale.paymentStatus} />
                </div>
              </div>
            </div>

            {/* ── Items Table ── */}
            <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Product", "Price", "Qty", "Discount", "Tax", "Total"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                        No items in this sale
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-50 last:border-0 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">{item.productNameSnapshot}</p>
                          <p className="text-xs text-gray-400 mt-0.5">ID: {item.productId}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          ₹{Number(item.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-sm">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-red-400">
                          {Number(item.discount) > 0 ? `–₹${Number(item.discount).toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {Number(item.tax) > 0 ? `₹${Number(item.tax).toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-800">
                          ₹{Number(item.lineTotal).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Totals ── */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Discount Total</span>
                  <span className="text-red-400">
                    {discountTotal > 0 ? `–₹${discountTotal.toFixed(2)}` : "₹0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax Total</span>
                  <span>₹{taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2.5 border-t-2 border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-indigo-600 text-lg">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between print:hidden">
            <button
              onClick={() => navigate("/dashboard/sales")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/dashboard/sales/pos")}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                + New Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}