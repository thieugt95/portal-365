import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { dummyArticles } from '@/data/dummyData';
import { NEWS_SLUGS, CATEGORY_NAMES } from '../config/categorySlugs';

// Home page category sections configuration (re-export from central config)
export const HOME_CATEGORY_SLUGS = NEWS_SLUGS;

export const HOME_CATEGORY_NAMES: Record<string, string> = {
  [NEWS_SLUGS[0]]: CATEGORY_NAMES[NEWS_SLUGS[0]],
  [NEWS_SLUGS[1]]: CATEGORY_NAMES[NEWS_SLUGS[1]],
  [NEWS_SLUGS[2]]: CATEGORY_NAMES[NEWS_SLUGS[2]],
  [NEWS_SLUGS[3]]: CATEGORY_NAMES[NEWS_SLUGS[3]],
};

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  thumbnail_url?: string;
  cover_url?: string;
  category?: {
    id?: number;
    name: string;
    slug?: string;
  };
  tags?: Array<{ id: number; name: string; slug: string }>;
  author?: {
    id: number;
    full_name: string;
  };
  published_at: string;
  view_count: number;
}

export interface HomeData {
  hero: Article | null;
  breaking: Article[];
  featured: Article[];
  by_category: Array<{
    category: { id: number; name: string; slug: string };
    articles: Article[];
  }>;
  most_read: Article[];
}

function getDummyHomeData(): HomeData {
  const articles = dummyArticles as any[];
  
  // Create sections based on HOME_CATEGORY_SLUGS
  const by_category = HOME_CATEGORY_SLUGS.map((slug, index) => {
    const categoryName = HOME_CATEGORY_NAMES[slug] || slug;
    
    // Filter articles by category name
    const categoryArticles = articles.filter(a => {
      const catName = a.category?.name;
      if (!catName) return false;
      
      // Map category names to expected display names
      return catName === categoryName;
    });

    return {
      category: {
        id: index + 1,
        name: categoryName,
        slug,
      },
      articles: categoryArticles.slice(0, 6),
    };
  }).filter(cat => cat.articles.length > 0); // Only include categories with articles

  return {
    hero: articles.find(a => a.thumbnail_url) || articles[0] || null,
    breaking: articles.slice(0, 10),
    featured: articles.slice(0, 6),
    by_category,
    most_read: [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 10),
  };
}

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      try {
        // Try aggregate endpoint first
        const response = await apiClient.get<{ data: HomeData }>('/home');
        const data = response.data.data;
        
        // If API returns empty data, use dummy data
        if (!data.hero && (!data.by_category || data.by_category.length === 0)) {
          console.log('API returned empty data, using dummy data');
          return getDummyHomeData();
        }
        
        return data;
      } catch (error) {
        console.log('API not available, using dummy data');
        // Fallback to dummy data
        return getDummyHomeData();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
