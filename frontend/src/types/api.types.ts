export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    pages: number;
    currentPage: number;
  };
}