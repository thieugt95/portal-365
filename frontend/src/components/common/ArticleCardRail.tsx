import { Link } from 'react-router-dom';
import type { Article } from '../../hooks/usePublicArticles';

interface ArticleCardRailProps {
  article: Article;
}

export default function ArticleCardRail({ article }: ArticleCardRailProps) {
  const imageUrl = article.featured_image || article.thumbnail_url || '/placeholder-news.jpg';

  return (
    <Link
      to={`/a/${article.slug}`}
      className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
          {article.title}
        </h4>
        <time className="text-xs text-gray-500" dateTime={article.published_at}>
          {new Date(article.published_at).toLocaleDateString('vi-VN')}
        </time>
      </div>
    </Link>
  );
}
