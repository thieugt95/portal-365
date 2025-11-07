import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { http } from '@/api/http';
import { AxiosError } from 'axios';

// Types
export interface Document {
  id: number;
  title: string;
  slug: string;
  description?: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  download_url?: string;
  preview_url?: string;
  status: 'draft' | 'published' | 'hidden';
  category_id?: number;
  uploaded_by: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentListResponse {
  data: Document[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface DocumentListParams {
  page?: number;
  page_size?: number;
  status?: string;
  category_id?: number;
  q?: string;
  type?: string;
}

// Query keys
export const adminDocsKeys = {
  all: ['admin', 'documents'] as const,
  lists: () => [...adminDocsKeys.all, 'list'] as const,
  list: (params: DocumentListParams) => [...adminDocsKeys.lists(), params] as const,
  detail: (id: number) => [...adminDocsKeys.all, 'detail', id] as const,
};

// Get admin documents list
export function useAdminDocsList(
  params: DocumentListParams = {},
  options?: Omit<UseQueryOptions<DocumentListResponse, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<DocumentListResponse, AxiosError>({
    queryKey: adminDocsKeys.list(params),
    queryFn: async () => {
      const response = await http.get<DocumentListResponse>('/admin/documents', { params });
      return response.data;
    },
    staleTime: 30000,
    ...options,
  });
}

// Get document detail
export function useAdminDocDetail(id: number) {
  return useQuery<{ data: Document }, AxiosError>({
    queryKey: adminDocsKeys.detail(id),
    queryFn: async () => {
      const response = await http.get(`/admin/documents/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Upload document
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation<
    { data: Document },
    AxiosError,
    { file: File; title: string; category_id: number; description?: string }
  >({
    mutationFn: async ({ file, title, category_id, description }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('category_id', category_id.toString());
      if (description) {
        formData.append('description', description);
      }

      const response = await http.post('/admin/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch document lists
      queryClient.invalidateQueries({ queryKey: adminDocsKeys.lists() });
    },
  });
}

// Delete document
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await http.delete(`/admin/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDocsKeys.lists() });
    },
  });
}

// Update document
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation<
    { data: Document },
    AxiosError,
    { id: number; data: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at'>> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await http.put(`/admin/documents/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminDocsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminDocsKeys.detail(variables.id) });
    },
  });
}
