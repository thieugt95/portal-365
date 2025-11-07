import { Link } from 'react-router-dom';
import type { Article } from '../../hooks/usePublicArticles';

interface ArticleCardMainProps {
  article: Article;
}

export default function ArticleCardMain({ article }: ArticleCardMainProps) {
  const imageUrl = article.featured_image || article.thumbnail_url || '/placeholder-news.jpg';

  return (
    <Link
      to={`/a/${article.slug}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-video bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category chip */}
        {article.category && (
          <span className="inline-block text-xs uppercase tracking-wide bg-blue-50 text-blue-700 px-2 py-1 rounded-full mb-2 font-medium">
            {article.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.summary && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.summary}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <time dateTime={article.published_at}>
            {new Date(article.published_at).toLocaleDateString('vi-VN')}
          </time>
          {article.view_count > 0 && (
            <>
              <span>•</span>
              <span>{article.view_count.toLocaleString()} lượt xem</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
