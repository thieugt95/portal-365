import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Category } from './usePublicArticles';

/**
 * Hook để lấy thông tin category theo slug
 */
export function useCategory(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['category', 'detail', slug],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Category }>(`/categories/${slug}`);
      return response.data.data;
    },
    enabled: options?.enabled !== false && !!slug,
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
  });
}

/**
 * Hook để lấy tất cả categories (cho navigation/mapping)
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Category[] }>('/categories', {
        params: { page_size: 100 },
      });
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 phút
    retry: 1,
  });
}

/**
 * Prefetch category articles khi hover
 */
export function usePrefetchCategory(queryClient: ReturnType<typeof useQueryClient>) {
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['articles', 'list', { slug, page: 1, page_size: 12 }],
      queryFn: async () => {
        const response = await apiClient.get('/articles', {
          params: {
            category_slug: slug,
            page: 1,
            page_size: 12,
            sort: '-published_at',
          },
        });
        return response.data;
      },
      staleTime: 30 * 1000, // 30 giây
    });
  };
}
