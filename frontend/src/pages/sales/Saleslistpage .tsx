import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSales} from "../../service/sales.service";
import type {  Sale  } from "../../service/sales.service";

// ─── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    UNPAID: "bg-red-50 text-red-600 border-red-200",
    PARTIAL: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        map[status] ?? "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

// ─── Payment method badge ─────────────────────────────────────────────────────
function PaymentBadge({ method }: { method: string }) {
  const icons: Record<string, string> = {
    CASH: "💵",
    CARD: "💳",
    UPI: "📲",
    NET_BANKING: "🏦",
  };
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
      <span>{icons[method] ?? "💰"}</span>
      {method}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SalesListPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(invoiceSearch);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [invoiceSearch]);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllSales({
        page,
        limit,
        invoiceNo: debouncedSearch || undefined,
      });
      setSales(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.totalItems);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div
      className="min-h-screen bg-[#f4f6fb] p-6"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sales</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalItems > 0 ? `Showing ${startItem}–${endItem} of ${totalItems} entries` : "No sales found"}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/sales/pos")}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <span className="text-base">+</span> New Sale
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by invoice no..."
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
          />
        </div>
        <button
          onClick={() => { setInvoiceSearch(""); setDebouncedSearch(""); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all"
        >
          Filter
        </button>
        {invoiceSearch && (
          <button
            onClick={() => { setInvoiceSearch(""); }}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Invoice No", "Customer", "Cashier", "Grand Total", "Payment", "Status", "Date", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <p className="text-sm font-medium">No sales found</p>
                      {debouncedSearch && (
                        <p className="text-xs">Try a different invoice number</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sales.map((sale, idx) => (
                  <tr
                    key={sale.id}
                    className={`border-b border-gray-50 hover:bg-indigo-50/30 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {sale.invoiceNo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">
                      {sale.customerId || "Walk-in Customer"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {sale.cashierId || "—"}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">
                      ₹{Number(sale.grandTotal).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentBadge method={sale.paymentMethod} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={sale.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(sale.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => navigate(`/dashboard/sales/${sale.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {startItem}–{endItem} of {totalItems} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ‹
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                      pageNum === page
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="px-1 text-gray-400 text-sm">…</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-8 h-8 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}