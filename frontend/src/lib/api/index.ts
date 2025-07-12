import axios from "axios";
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Issue,
  Tag,
  IssueFilters,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      console.error("Unauthorized - redirecting to login");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signUp: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post("/api/auth/sign-up/email", data);
    return response.data;
  },

  signIn: async (data: { email: string; password: string }) => {
    const response = await api.post("/api/auth/sign-in/email", data);
    return response.data;
  },

  signOut: async () => {
    const response = await api.post("/api/auth/sign-out", {});
    return response.data;
  },

  getSession: async () => {
    const response = await api.get("/api/auth/get-session");
    return response.data;
  },
};

// Users API
export const usersApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get("/api/users");
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
};

// Tags API
export const tagsApi = {
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    const response = await api.get("/api/tags");
    return response.data;
  },

  createTag: async (data: {
    name: string;
    color: string;
  }): Promise<ApiResponse<Tag>> => {
    const response = await api.post("/api/tags", data);
    return response.data;
  },

  deleteTag: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/tags/${id}`);
    return response.data;
  },
};

// Issues API
export const issuesApi = {
  getIssues: async (
    filters?: IssueFilters
  ): Promise<PaginatedResponse<Issue>> => {
    const response = await api.get("/api/issues", { params: filters });
    return response.data;
  },

  getIssue: async (id: number): Promise<ApiResponse<Issue>> => {
    const response = await api.get(`/api/issues/${id}`);
    return response.data;
  },

  createIssue: async (data: {
    title: string;
    description: string;
    priority: string;
    assigned_user_id?: string;
    tag_ids?: number[];
  }): Promise<ApiResponse<Issue>> => {
    const response = await api.post("/api/issues", data);
    return response.data;
  },

  updateIssue: async (
    id: number,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      assigned_user_id?: string;
      tag_ids?: number[];
    }>
  ): Promise<ApiResponse<Issue>> => {
    const response = await api.put(`/api/issues/${id}`, data);
    return response.data;
  },

  deleteIssue: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/issues/${id}`);
    return response.data;
  },
};
