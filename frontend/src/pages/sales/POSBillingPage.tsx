import { useState, useEffect, useRef } from "react";
import { createSale } from "../../service/sales.service";
import { useAuth } from "../../context/AuthContext";
import type { CreateSaleData } from "../../service/sales.service";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  stock: number;
  category?: string;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
  tax: number;
}

// ─── Mock Products (replace with real API call) ───────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Red Apple", sku: "APP001", sellingPrice: 120, stock: 50, category: "Fruits" },
  { id: "p2", name: "Banana", sku: "BAN002", sellingPrice: 60, stock: 80, category: "Fruits" },
  { id: "p3", name: "Milk 1L", sku: "MLK001", sellingPrice: 70, stock: 30, category: "Dairy" },
  { id: "p4", name: "Bread", sku: "BRE001", sellingPrice: 40, stock: 40, category: "Bakery" },
  { id: "p5", name: "Oreo Biscuit", sku: "ORE001", sellingPrice: 30, stock: 100, category: "Snacks" },
  { id: "p6", name: "Cold Drink", sku: "COL001", sellingPrice: 50, stock: 40, category: "Beverages" },
  { id: "p7", name: "Orange", sku: "ORN001", sellingPrice: 90, stock: 60, category: "Fruits" },
  { id: "p8", name: "Butter 100g", sku: "BTR001", sellingPrice: 55, stock: 25, category: "Dairy" },
];

const CATEGORIES = ["All Categories", "Fruits", "Dairy", "Bakery", "Snacks", "Beverages"];

const PAYMENT_METHODS = ["CASH", "CARD", "UPI", "NET_BANKING"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateInvoiceNo(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${y}-${m}${d}-${seq}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function POSBillingPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState("Walk-in Customer");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [invoiceNo] = useState(generateInvoiceNo);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "All Categories" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, discount: 0, tax: 0 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === id
          ? { ...i, quantity: Math.min(qty, i.product.stock) }
          : i
      )
    );
  };

  const updateDiscount = (id: string, discount: number) => {
    setCart((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, discount } : i))
    );
  };

  const updateTax = (id: string, tax: number) => {
    setCart((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, tax } : i))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (sum, i) => sum + i.product.sellingPrice * i.quantity,
    0
  );
  const discountTotal = cart.reduce((sum, i) => sum + (i.discount || 0), 0);
  const taxTotal = cart.reduce((sum, i) => sum + (i.tax || 0), 0);
  const grandTotal = subtotal - discountTotal + taxTotal;

  const handleHoldSale = () => {
    alert("Sale held! (implement hold logic here)");
  };

  const handlePayNow = async () => {
    if (cart.length === 0) {
      setErrorMsg("Cart is empty.");
      return;
    }
    if (!user) {
      setErrorMsg("User not authenticated.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload: CreateSaleData = {
        invoiceNo,
        cashierId: user.id,
        customerId: undefined,
        paymentMethod,
        paymentStatus: "PAID",
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          discount: i.discount,
          tax: i.tax,
        })),
      };
      await createSale(payload);
      setSuccessMsg(`Sale ${invoiceNo} created successfully!`);
      clearCart();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(error?.response?.data?.message || error?.message || "Sale failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f4f6fb] font-sans flex flex-col"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          🧾 POS Billing
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium text-xs">
            {invoiceNo}
          </span>
          <span className="text-gray-400">|</span>
          <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
      </div>

      {successMsg && (
        <div className="mx-6 mt-3 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          ✅ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mx-6 mt-3 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          ❌ {errorMsg}
        </div>
      )}

      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* ── LEFT: Product Browser ── */}
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          {/* Search + Filter */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search product by name, SKU or barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            All Products
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pr-1 flex-1">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="group bg-white border border-gray-100 rounded-2xl p-3 text-left shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-2 group-hover:bg-indigo-100 transition-colors">
                  {product.category === "Fruits" ? "🍎" : product.category === "Dairy" ? "🥛" : product.category === "Bakery" ? "🍞" : product.category === "Snacks" ? "🍪" : "🥤"}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-indigo-600">₹{product.sellingPrice}</span>
                  <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-4 text-center py-12 text-gray-400 text-sm">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Current Sale Cart ── */}
        <div className="w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-lg">
          {/* Cart Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-800 mb-3">Current Sale</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Invoice No</label>
                <input
                  readOnly
                  value={invoiceNo}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Customer</label>
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <span className="text-5xl mb-3">🛒</span>
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs mt-1">Click a product to add</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                  <span>Product</span>
                  <span className="text-right">Price</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Disc</span>
                  <span className="text-right">Total</span>
                  <span></span>
                </div>

                <div className="space-y-2">
                  {cart.map((item) => {
                    const lineTotal =
                      item.product.sellingPrice * item.quantity -
                      item.discount +
                      item.tax;
                    return (
                      <div
                        key={item.product.id}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-1 items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100"
                      >
                        <div>
                          <p className="text-xs font-semibold text-gray-800 leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-gray-400">{item.product.sku}</p>
                        </div>
                        <span className="text-xs text-right text-gray-600">
                          ₹{item.product.sellingPrice}
                        </span>
                        {/* Qty Controls */}
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-gray-200 text-gray-600 hover:bg-indigo-100 text-xs font-bold flex items-center justify-center"
                          >–</button>
                          <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-gray-200 text-gray-600 hover:bg-indigo-100 text-xs font-bold flex items-center justify-center"
                          >+</button>
                        </div>
                        {/* Discount */}
                        <input
                          type="number"
                          min={0}
                          value={item.discount}
                          onChange={(e) => updateDiscount(item.product.id, Number(e.target.value))}
                          className="w-full text-xs text-right px-1 py-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
                        />
                        <span className="text-xs text-right font-semibold text-gray-800">
                          ₹{lineTotal.toFixed(0)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors ml-1 text-base"
                        >×</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          <div className="px-5 py-2 border-t border-gray-100">
            <input
              placeholder="Notes (Optional)"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-gray-50"
            />
          </div>

          {/* Totals */}
          <div className="px-5 py-3 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Discount</span>
              <span className="text-red-400">–₹{discountTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>₹{taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span className="text-indigo-600">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="px-5 pb-3">
            <label className="text-xs text-gray-500 font-medium mb-2 block">Payment Method</label>
            <div className="flex gap-2 flex-wrap">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    paymentMethod === pm
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-5 pb-5 grid grid-cols-3 gap-2">
            <button
              onClick={clearCart}
              className="py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Clear Cart
            </button>
            <button
              onClick={handleHoldSale}
              className="py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-all"
            >
              Hold Sale
            </button>
            <button
              onClick={handlePayNow}
              disabled={loading || cart.length === 0}
              className="py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
            >
              {loading ? "Processing…" : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}