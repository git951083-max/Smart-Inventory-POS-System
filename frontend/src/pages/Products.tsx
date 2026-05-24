
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type CreateProductData,
  type ProductStatus,
} from "../service/product.service";

import {
  getAllCategories,
  type Category,
} from "../service/cateory.service";

// ─── types ────────────────────────────────────────────────────────────────────

type StockFilter = "All Stock" | "In Stock" | "Low Stock" | "Out of Stock";

interface FormState {
  name: string;
  sku: string;
  barcode: string;
  brand: string;
  unit: string;
  description: string;
  image: string;
  categoryId: string;
  purchasePrice: string;
  sellingPrice: string;
  stockQty: string;
  lowStockLimit: string;
  taxRate: string;
  status: ProductStatus;
}

const EMPTY_FORM: FormState = {
  name: "",
  sku: "",
  barcode: "",
  brand: "",
  unit: "",
  description: "",
  image: "",
  categoryId: "",
  purchasePrice: "",
  sellingPrice: "",
  stockQty: "0",
  lowStockLimit: "5",
  taxRate: "0",
  status: "ACTIVE",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

const getStockBadge = (stockQty: number, lowStockLimit: number) => {
  if (stockQty === 0)
    return {
      label: "Out of Stock",
      className: "bg-red-50 text-red-600 border border-red-200",
    };
  if (stockQty <= lowStockLimit)
    return {
      label: "Low Stock",
      className: "bg-orange-50 text-orange-600 border border-orange-200",
    };
  return {
    label: "In Stock",
    className: "bg-green-50 text-green-600 border border-green-200",
  };
};

// ─── product modal ────────────────────────────────────────────────────────────

interface ProductModalProps {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

const ProductModal = ({
  mode,
  product,
  categories,
  onClose,
  onSuccess,
}: ProductModalProps) => {
  const [form, setForm] = useState<FormState>(() => {
    if (mode === "edit" && product) {
      return {
        name: product.name,
        sku: product.sku ?? "",
        barcode: product.barcode ?? "",
        brand: product.brand ?? "",
        unit: product.unit ?? "",
        description: product.description ?? "",
        image: product.image ?? "",
        categoryId: product.categoryId,
        purchasePrice: String(product.purchasePrice),
        sellingPrice: String(product.sellingPrice),
        stockQty: String(product.stockQty),
        lowStockLimit: String(product.lowStockLimit),
        taxRate: String(product.taxRate),
        status: product.status,
      };
    }
    return EMPTY_FORM;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.categoryId || !form.sellingPrice || !form.purchasePrice) {
      setError("Name, category, purchase price and selling price are required.");
      return;
    }

    setLoading(true);
    setError("");

    const payload: CreateProductData = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      purchasePrice: parseFloat(form.purchasePrice),
      sellingPrice: parseFloat(form.sellingPrice),
      stockQty: parseInt(form.stockQty) || 0,
      lowStockLimit: parseInt(form.lowStockLimit) || 5,
      taxRate: parseFloat(form.taxRate) || 0,
      status: form.status,
      ...(form.sku && { sku: form.sku }),
      ...(form.barcode && { barcode: form.barcode }),
      ...(form.brand && { brand: form.brand }),
      ...(form.unit && { unit: form.unit }),
      ...(form.description && { description: form.description }),
      ...(form.image && { image: form.image }),
    };

    try {
      if (mode === "create") {
        await createProduct(payload);
      } else if (product) {
        await updateProduct(product.id, payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";
  const labelCls = "mb-1 block text-xs font-medium text-gray-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "Add New Product" : "Edit Product"}
            </h2>
            <p className="text-xs text-gray-500">
              {mode === "create"
                ? "Fill in the details to add a new product."
                : "Update the product information below."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Product Name *</label>
              <input
                className={inputCls}
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>SKU</label>
              <input
                className={inputCls}
                placeholder="e.g. WH-1001"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Barcode</label>
              <input
                className={inputCls}
                placeholder="e.g. 8901234567890"
                value={form.barcode}
                onChange={(e) => set("barcode", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Brand</label>
              <input
                className={inputCls}
                placeholder="e.g. Sony"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Unit</label>
              <input
                className={inputCls}
                placeholder="e.g. pcs, kg, box"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>Category *</label>
              <select
                className={inputCls}
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value as ProductStatus)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>

            {/* Prices */}
            <div>
              <label className={labelCls}>Purchase Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  className={`${inputCls} pl-7`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.purchasePrice}
                  onChange={(e) => set("purchasePrice", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Selling Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  className={`${inputCls} pl-7`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.sellingPrice}
                  onChange={(e) => set("sellingPrice", e.target.value)}
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className={labelCls}>Stock Quantity</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                placeholder="0"
                value={form.stockQty}
                onChange={(e) => set("stockQty", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Low Stock Limit</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                placeholder="5"
                value={form.lowStockLimit}
                onChange={(e) => set("lowStockLimit", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Tax Rate (%)</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={form.taxRate}
                onChange={(e) => set("taxRate", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Image URL</label>
              <input
                className={inputCls}
                placeholder="https://..."
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                placeholder="Optional product description..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {mode === "create" ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── view modal ───────────────────────────────────────────────────────────────

const ViewModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  const badge = getStockBadge(product.stockQty, product.lowStockLimit);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Image / placeholder */}
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <Package size={28} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category?.name ?? "—"}</p>
              <span className={`mt-1 inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                {badge.label}
              </span>
            </div>
          </div>

          {row("SKU", product.sku ?? "—")}
          {row("Barcode", product.barcode ?? "—")}
          {row("Brand", product.brand ?? "—")}
          {row("Unit", product.unit ?? "—")}
          {row("Purchase Price", `$${Number(product.purchasePrice).toFixed(2)}`)}
          {row("Selling Price", `$${Number(product.sellingPrice).toFixed(2)}`)}
          {row("Stock Qty", product.stockQty)}
          {row("Low Stock Limit", product.lowStockLimit)}
          {row("Tax Rate", `${product.taxRate}%`)}
          {row("Status", product.status)}
          {product.description && row("Description", product.description)}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── delete confirm modal ─────────────────────────────────────────────────────

const DeleteModal = ({
  product,
  onClose,
  onSuccess,
}: {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(product.id);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="px-6 py-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Delete Product</h2>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">"{product.name}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── main products page ───────────────────────────────────────────────────────

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All Stock");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  // modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // ── fetch ────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProducts({
        page: currentPage,
        limit: LIMIT,
        ...(search && { search }),
        ...(categoryFilter && { categoryId: categoryFilter }),
        ...(statusFilter && { status: statusFilter as ProductStatus }),
      });
      setProducts(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.totalItems);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getAllCategories().then((res) => setCategories(res.data));
  }, []);

  // reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, stockFilter]);

  // ── client-side stock filter ──────────────────────────────────────────────

  const visibleProducts = products.filter((p) => {
    if (stockFilter === "In Stock") return p.stockQty > p.lowStockLimit;
    if (stockFilter === "Low Stock") return p.stockQty > 0 && p.stockQty <= p.lowStockLimit;
    if (stockFilter === "Out of Stock") return p.stockQty === 0;
    return true;
  });

  // ── export CSV ────────────────────────────────────────────────────────────

  const handleExport = () => {
    const headers = ["Name", "SKU", "Category", "Stock", "Price", "Status"];
    const rows = visibleProducts.map((p) => [
      p.name,
      p.sku ?? "",
      p.category?.name ?? "",
      p.stockQty,
      p.sellingPrice,
      p.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────────────────

  const selectCls =
    "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-0.5 text-sm text-gray-400">Home / Products</p>
      </div>

      {/* Main card */}
      <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ── filters bar ── */}
        <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 px-5 py-4">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Category</span>
            <select
              className={selectCls}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <select
              className={selectCls}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "")}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>

          {/* Stock filter */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Stock</span>
            <select
              className={selectCls}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
            >
              <option>All Stock</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <Download size={15} />
              Export
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={15} />
              Add Product
            </button>
          </div>
        </div>

        {/* ── table ── */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-400">
              <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              Loading products...
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
              <Package size={40} className="opacity-40" />
              <p className="text-sm">No products found.</p>
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={14} /> Add your first product
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3">Image</th>
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {visibleProducts.map((product) => {
                  const badge = getStockBadge(product.stockQty, product.lowStockLimit);
                  return (
                    <tr key={product.id} className="transition hover:bg-gray-50">
                      {/* Image */}
                      <td className="px-5 py-3.5">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={18} className="text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {product.name}
                        {product.brand && (
                          <span className="ml-1.5 text-xs text-gray-400">{product.brand}</span>
                        )}
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                        {product.sku ?? "—"}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 text-gray-600">
                        {product.category?.name ?? "—"}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        ${Number(product.sellingPrice).toFixed(2)}
                      </td>

                      {/* Stock qty */}
                      <td className="px-5 py-3.5 font-semibold">
                        <span
                          className={
                            product.stockQty === 0
                              ? "text-red-500"
                              : product.stockQty <= product.lowStockLimit
                              ? "text-orange-500"
                              : "text-green-600"
                          }
                        >
                          {product.stockQty}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewProduct(product)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditProduct(product)}
                            className="rounded-lg p-1.5 text-blue-400 transition hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
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

        {/* ── pagination ── */}
        {!loading && totalItems > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {(currentPage - 1) * LIMIT + 1}–
                {Math.min(currentPage * LIMIT, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">{totalItems}</span>{" "}
              products
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] rounded-lg border px-2 py-1 text-sm font-medium transition ${
                      page === currentPage
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── modals ── */}
      {createOpen && (
        <ProductModal
          mode="create"
          categories={categories}
          onClose={() => setCreateOpen(false)}
          onSuccess={fetchProducts}
        />
      )}

      {editProduct && (
        <ProductModal
          mode="edit"
          product={editProduct}
          categories={categories}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />
      )}

      {viewProduct && (
        <ViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;





