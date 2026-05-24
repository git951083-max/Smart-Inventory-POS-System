import axiosInstance from "../api/axiosInstance";

// ========================
// TYPES / INTERFACES
// ========================

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
  id: string;
  name: string;
  description?: string;
  status: CategoryStatus;
  createdAt?: string;
  updatedAt?: string;
  products?: {
    id: string;
    name: string;
  }[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  status?: CategoryStatus;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export interface GetAllCategoriesParams {
  status?: CategoryStatus;
}

export interface GetAllCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  data: Category;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data?: Category;
}

// ========================
// CATEGORY SERVICE
// ========================

// CREATE CATEGORY — ADMIN / SUPER_ADMIN only
export const createCategory = async (
  data: CreateCategoryData
): Promise<MessageResponse> => {
  const res = await axiosInstance.post("/category", data);
  return res.data;
};

// GET ALL CATEGORIES — optionally filter by status
export const getAllCategories = async (
  params: GetAllCategoriesParams = {}
): Promise<GetAllCategoriesResponse> => {
  const res = await axiosInstance.get("/category", { params });
  return res.data;
};

// GET SINGLE CATEGORY by ID (includes associated products)
export const getCategoryById = async (
  id: string
): Promise<SingleCategoryResponse> => {
  const res = await axiosInstance.get(`/category/${id}`);
  return res.data;
};

// UPDATE CATEGORY — ADMIN / SUPER_ADMIN only
export const updateCategory = async (
  id: string,
  data: UpdateCategoryData
): Promise<MessageResponse> => {
  const res = await axiosInstance.put(`/category/${id}`, data);
  return res.data;
};

// DELETE CATEGORY — ADMIN / SUPER_ADMIN only (soft delete)
export const deleteCategory = async (id: string): Promise<MessageResponse> => {
  const res = await axiosInstance.delete(`/category/${id}`);
  return res.data;
};