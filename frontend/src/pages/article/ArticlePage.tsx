import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useArticle, useRelatedArticles, estimateReadingTime } from '../../hooks/useArticle';
import ReadingProgress from '../../components/article/ReadingProgress';
import TableOfContents from '../../components/article/TableOfContents';
import ShareBar from '../../components/article/ShareBar';
import AuthorBox from '../../components/article/AuthorBox';
import { setArticleSEO, clearSEO } from '../../utils/seo';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useArticle(slug || '');
  const { data: relatedArticles } = useRelatedArticles(
    article?.category?.slug || '',
    article?.id || 0
  );

  useEffect(() => {
    if (article) {
      setArticleSEO({
        title: article.title,
        excerpt: article.summary || article.excerpt,
        cover_url: article.featured_image || article.cover_url,
        published_at: article.published_at,
        updated_at: article.updated_at,
        category: article.category,
        author: article.author,
        slug: article.slug,
      });
    }

    return () => clearSEO();
  }, [article]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Skeleton loader */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - 404
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Không tìm thấy bài viết
          </h2>
          <p className="text-gray-600 mb-6">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏠 Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const content = article.content || article.content_html || '';
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
  const readingTime = estimateReadingTime(content);

  return (
    <>
      <ReadingProgress />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
                🏠 Trang chủ
              </Link>
              <span>›</span>
              {article.category && (
                <>
                  <Link
                    to={`/c/${article.category.slug}`}
                    className="hover:text-blue-600"
                  >
                    {article.category.name}
                  </Link>
                  <span>›</span>
                </>
              )}
              <span className="text-gray-400 truncate">{article.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main content */}
              <div className="lg:col-span-8">
                <article className="bg-white rounded-lg shadow-sm p-8">
                  {/* Category chip */}
                  {article.category && (
                    <Link
                      to={`/c/${article.category.slug}`}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full mb-4 hover:bg-blue-200 transition-colors"
                    >
                      {article.category.name}
                    </Link>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    {article.author && (
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            article.author.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=random`
                          }
                          alt={article.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium text-gray-900">
                          {article.author.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{readingTime} phút đọc</span>
                    </div>
                    {article.view_count > 0 && (
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{article.view_count.toLocaleString()} lượt xem</span>
                      </div>
                    )}
                    <time dateTime={article.published_at}>
                      {new Date(article.published_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  {/* Featured image */}
                  {article.featured_image && (
                    <figure className="mb-8 -mx-8">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-auto"
                        loading="eager"
                        decoding="async"
                      />
                    </figure>
                  )}

                  {/* Summary/Excerpt */}
                  {article.summary && (
                    <div className="text-lg text-gray-700 font-medium mb-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                      {article.summary}
                    </div>
                  )}

                  {/* Article content */}
                  <div
                    id="article-content"
                    className="prose prose-lg max-w-none
                      prose-headings:font-bold prose-headings:text-gray-900
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-lg prose-img:shadow-md
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4
                      prose-ul:list-disc prose-ol:list-decimal
                      prose-li:text-gray-700
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-gray-900 prose-pre:text-gray-100
                      prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-td:border prose-td:border-gray-300
                      [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  />

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-500">🏷️</span>
                        {article.tags.map((tag) => (
                          <Link
                            key={tag.id}
                            to={`/tag/${tag.slug}`}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                          >
                            #{tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share bar */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <ShareBar title={article.title} />
                  </div>

                  {/* Author box */}
                  {article.author && (
                    <div className="mt-8">
                      <AuthorBox author={article.author} />
                    </div>
                  )}
                </article>

                {/* Related articles */}
                {relatedArticles && relatedArticles.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Bài viết liên quan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {relatedArticles.slice(0, 6).map((related) => (
                        <Link
                          key={related.id}
                          to={`/a/${related.slug}`}
                          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {related.featured_image && (
                            <img
                              src={related.featured_image}
                              alt={related.title}
                              className="w-full h-48 object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {related.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {related.summary}
                            </p>
                            <time className="text-xs text-gray-500 mt-2 block">
                              {new Date(related.published_at).toLocaleDateString('vi-VN')}
                            </time>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="hidden lg:block">
                  <TableOfContents />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
