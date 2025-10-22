import { ApiResponse, PaginationParams, PaginatedResponse } from '@/types';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function createApiResponse<T>(
  data?: T,
  message?: string,
  success: boolean = true
): ApiResponse<T> {
  return {
    success,
    data,
    message,
  };
}

export function createErrorResponse(error: string, statusCode: number = 500): ApiResponse<null> {
  return {
    success: false,
    error,
  };
}

export function validatePaginationParams(params: any): PaginationParams {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 10));
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
  
  return { page, limit, sortBy, sortOrder };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / pagination.limit);
  
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}

export function handleApiError(error: unknown): ApiResponse<null> {
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode);
  }
  
  if (error instanceof Error) {
    return createErrorResponse(error.message);
  }
  
  return createErrorResponse('An unexpected error occurred');
}
