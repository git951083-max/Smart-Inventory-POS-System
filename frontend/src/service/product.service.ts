import axiosInstance from "../api/axiosInstance";

// ========================
// TYPES / INTERFACES
// ========================

export type ProductStatus = "ACTIVE" | "INACTIVE" | "DISCONTINUED";

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;
  image?: string;
  brand?: string;
  unit?: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQty: number;
  lowStockLimit: number;
  taxRate: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
    status?: string;
  };
}

export interface CreateProductData {
  name: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  sku?: string;
  barcode?: string;
  description?: string;
  image?: string;
  brand?: string;
  unit?: string;
  stockQty?: number;
  lowStockLimit?: number;
  taxRate?: number;
  status?: ProductStatus;
}

export type UpdateProductData = Partial<CreateProductData>;

export interface GetAllProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GetAllProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data?: Product;
}

// ========================
// PRODUCT SERVICE
// ========================

// CREATE PRODUCT — ADMIN / SUPER_ADMIN only
export const createProduct = async (
  data: CreateProductData
): Promise<MessageResponse> => {
  const res = await axiosInstance.post("/product", data);
  return res.data;
};

// GET ALL PRODUCTS — supports pagination, search, and filters
export const getAllProducts = async (
  params: GetAllProductsParams = {}
): Promise<GetAllProductsResponse> => {
  const res = await axiosInstance.get("/product", { params });
  return res.data;
};

// GET SINGLE PRODUCT by ID
export const getProductById = async (
  id: string
): Promise<SingleProductResponse> => {
  const res = await axiosInstance.get(`/product/${id}`);
  return res.data;
};

// UPDATE PRODUCT — ADMIN / SUPER_ADMIN only
export const updateProduct = async (
  id: string,
  data: UpdateProductData
): Promise<MessageResponse> => {
  const res = await axiosInstance.put(`/product/${id}`, data);
  return res.data;
};

// DELETE PRODUCT — ADMIN / SUPER_ADMIN only
export const deleteProduct = async (id: string): Promise<MessageResponse> => {
  const res = await axiosInstance.delete(`/product/${id}`);
  return res.data;
};