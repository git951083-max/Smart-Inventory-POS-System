import axiosInstance from "../api/axiosInstance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaleItem {
  productId: string;
  quantity: number;
  discount?: number;
  tax?: number;
}

export interface CreateSaleData {
  invoiceNo: string;
  cashierId: string;
  customerId?: string;
  paymentMethod: string;
  paymentStatus: string;
  items: SaleItem[];
}

export interface SaleItemResponse {
  id: string;
  saleId: string;
  productId: string;
  productNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  lineTotal: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId?: string;
  cashierId?: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  items?: SaleItemResponse[];
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetAllSalesParams {
  page?: number;
  limit?: number;
  invoiceNo?: string;
}

export interface SaleListResponse {
  success: boolean;
  data: Sale[];
  pagination: PaginationMeta;
}

export interface SingleSaleResponse {
  success: boolean;
  data: Sale;
}

export interface CreateSaleResponse {
  success: boolean;
  message: string;
  data: Sale;
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Create a new sale (Billing / POS)
 * Access: ADMIN, MANAGER, CASHIER, EMPLOYEE
 */
export const createSale = async (
  data: CreateSaleData
): Promise<CreateSaleResponse> => {
  const res = await axiosInstance.post("/sells", data);
  return res.data;
};

/**
 * Get all sales with optional pagination and search
 * Access: ADMIN, MANAGER
 */
export const getAllSales = async (
  params: GetAllSalesParams = {}
): Promise<SaleListResponse> => {
  const { page = 1, limit = 10, invoiceNo } = params;

  const res = await axiosInstance.get("/sells", {
    params: {
      page,
      limit,
      ...(invoiceNo && { invoiceNo }),
    },
  });

  return res.data;
};

/**
 * Get a single sale by ID (Invoice Detail)
 * Access: ADMIN, MANAGER, CASHIER
 */
export const getSaleById = async (id: string): Promise<SingleSaleResponse> => {
  const res = await axiosInstance.get(`/sells/${id}`);
  return res.data;
};