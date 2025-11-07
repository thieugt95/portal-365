import { useCategoryArticles } from '../../hooks/useCategoryArticles';
import ArticleCardMain from '../common/ArticleCardMain';
import Pagination from '../common/Pagination';
import { useState } from 'react';

interface CategoryMainListProps {
  slug: string;
  categoryName: string;
  description?: string;
}

export default function CategoryMainList({ slug, categoryName, description }: CategoryMainListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-published_at');

  const { data, isLoading, error, refetch } = useCategoryArticles(slug, {
    page,
    page_size: 12,
    sort,
    q: search || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton loader */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 mb-4">Không thể tải danh sách bài viết</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const articles = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="-published_at">Mới nhất</option>
          <option value="-view_count">Xem nhiều nhất</option>
          <option value="title">Tiêu đề A-Z</option>
        </select>
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Chưa có bài viết nào trong chuyên mục này</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCardMain key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
