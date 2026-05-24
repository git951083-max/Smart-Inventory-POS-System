import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react";

import { getAllProducts, type Product } from "../service/product.service";
import { getAllCategories } from "../service/cateory.service";

// ─── helpers ────────────────────────────────────────────────────────────────

const getStatusStyle = (stockQty: number, lowStockLimit: number) => {
  if (stockQty === 0)
    return { label: "OUT OF STOCK", className: "text-red-600 bg-red-50 border border-red-200" };
  if (stockQty <= lowStockLimit)
    return { label: "LOW STOCK", className: "text-orange-600 bg-orange-50 border border-orange-200" };
  return { label: "ACTIVE", className: "text-green-600 bg-green-50 border border-green-200" };
};

const getCategoryBadgeColor = (categoryName: string) => {
  const palette: Record<string, string> = {
    Electronics: "text-blue-600 bg-blue-50",
    Apparel: "text-purple-600 bg-purple-50",
    Kitchen: "text-yellow-600 bg-yellow-50",
    Stationery: "text-pink-600 bg-pink-50",
    Accessories: "text-cyan-600 bg-cyan-50",
  };
  return palette[categoryName] ?? "text-gray-600 bg-gray-100";
};

// ─── component ──────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  // Derived stats from product list
  const lowStockCount = products.filter(
    (p) => p.stockQty > 0 && p.stockQty <= p.lowStockLimit
  ).length;

  const outOfStockCount = products.filter((p) => p.stockQty === 0).length;

  const inventoryValue = products.reduce(
    (sum, p) => sum + Number(p.sellingPrice) * p.stockQty,
    0
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          getAllProducts({ page: 1, limit: 5 }),
          getAllCategories(),
        ]);

        setProducts(productsRes.data);
        setTotalProducts(productsRes.pagination.totalItems);
        setTotalCategories(categoriesRes.data.length);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ─── stat cards config ──────────────────────────────────────────────────

  const statCards = [
    {
      label: "Total Products",
      value: loading ? "—" : totalProducts.toLocaleString(),
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      linkLabel: "View all products",
      linkColor: "text-blue-600",
      onClick: () => navigate("/dashboard/products"),
    },
    {
      label: "Total Categories",
      value: loading ? "—" : totalCategories.toLocaleString(),
      icon: ShoppingCart,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      linkLabel: "View all categories",
      linkColor: "text-green-600",
      onClick: () => navigate("/dashboard/categories"),
    },
    {
      label: "Low Stock Items",
      value: loading ? "—" : (lowStockCount + outOfStockCount).toString(),
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      linkLabel: "View low stock",
      linkColor: "text-yellow-600",
      onClick: () => navigate("/dashboard/products"),
    },
    {
      label: "Inventory Value",
      value: loading
        ? "—"
        : `$${inventoryValue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      icon: DollarSign,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      linkLabel: "View report",
      linkColor: "text-purple-600",
      onClick: () => navigate("/dashboard/reports"),
    },
  ];

  // ─── render ─────────────────────────────────────────────────────────────

  return (
    <main className="space-y-6 p-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-gray-500">Welcome back, Admin!</p>
      </div>

      {/* Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon size={22} className={card.iconColor} />
                </div>

                <div>
                  <p className={`text-sm font-medium ${card.iconColor}`}>
                    {card.label}
                  </p>
                  <h2 className="mt-0.5 text-3xl font-bold text-gray-900">
                    {card.value}
                  </h2>
                </div>
              </div>

              <button
                onClick={card.onClick}
                className={`mt-4 flex items-center gap-1 text-sm font-medium ${card.linkColor} hover:underline`}
              >
                {card.linkLabel}
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </section>

      {/* Recent Products Table */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Products
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/products")}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              View All
            </button>

            <button
              onClick={() => navigate("/dashboard/products/add")}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={15} />
              Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              No products found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Stock Qty</th>
                  <th className="px-6 py-3">Selling Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const status = getStatusStyle(
                    product.stockQty,
                    product.lowStockLimit
                  );
                  const categoryColor = getCategoryBadgeColor(
                    product.category?.name ?? ""
                  );

                  const qtyColor =
                    product.stockQty === 0
                      ? "text-red-500 font-semibold"
                      : product.stockQty <= product.lowStockLimit
                      ? "text-orange-500 font-semibold"
                      : "text-green-600 font-semibold";

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Product name + optional image placeholder */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-9 w-9 rounded-lg object-cover"
                              />
                            ) : (
                              <Package size={16} />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {product.sku ?? "—"}
                      </td>

                      <td className="px-6 py-4">
                        {product.category ? (
                          <span
                            className={`rounded-md px-2.5 py-1 text-xs font-medium ${categoryColor}`}
                          >
                            {product.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className={`px-6 py-4 ${qtyColor}`}>
                        {product.stockQty}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        ${Number(product.sellingPrice).toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/products/edit/${product.id}`)
                            }
                            className="rounded-lg p-1.5 text-blue-500 transition hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;