import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Article } from './usePublicArticles';

export interface ArticleDetail extends Article {
  content_html?: string;
  excerpt?: string;
  cover_url?: string;
  author?: {
    id: number;
    name: string;
    username?: string;
    avatar_url?: string;
  };
}

/**
 * Hook để lấy chi tiết bài viết theo slug
 */
export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', 'detail', slug],
    queryFn: async () => {
      const response = await apiClient.get<{ data: ArticleDetail }>(`/articles/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

/**
 * Hook để lấy bài viết liên quan
 */
export function useRelatedArticles(categorySlug: string, excludeId: number, limit = 6) {
  return useQuery({
    queryKey: ['articles', 'related', categorySlug, excludeId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Article[] }>('/articles', {
        params: {
          category_slug: categorySlug,
          page_size: limit,
          sort: '-published_at',
        },
      });
      // Loại bỏ bài viết hiện tại
      return response.data.data.filter((a) => a.id !== excludeId);
    },
    enabled: !!categorySlug && !!excludeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Ước tính thời gian đọc bài viết (words per minute)
 */
export function estimateReadingTime(html: string, wpm = 220): number {
  // Loại bỏ HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  // Đếm số từ (chia theo khoảng trắng)
  const words = text.trim().split(/\s+/).length;
  // Tính phút (làm tròn lên)
  return Math.ceil(words / wpm);
}

/**
 * Hook để tăng view count (optional)
 */
export function useIncrementView(articleId: number) {
  return async () => {
    try {
      await apiClient.post(`/articles/${articleId}/view`);
    } catch (error) {
      // Bỏ qua lỗi nếu endpoint chưa có
      console.warn('View increment failed:', error);
    }
  };
}
