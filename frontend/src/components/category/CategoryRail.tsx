import { Link } from 'react-router-dom';
import { useCategoryRail } from '../../hooks/useCategoryArticles';
import ArticleCardRail from '../common/ArticleCardRail';

interface CategoryRailProps {
  slug: string;
  title: string;
  limit?: number;
}

export default function CategoryRail({ slug, title, limit = 5 }: CategoryRailProps) {
  const { data: articles, isLoading, error, refetch } = useCategoryRail(slug, limit);

  if (isLoading) {
    return (
      <div className="pb-6 border-b border-gray-200 last:border-0">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-6 border-b border-gray-200 last:border-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 mb-2">Không thể tải danh sách</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null; // Hide rail if no articles
  }

  return (
    <div className="pb-6 border-b border-gray-200 last:border-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Link
          to={`/c/${slug}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {articles.map((article) => (
          <ArticleCardRail key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
