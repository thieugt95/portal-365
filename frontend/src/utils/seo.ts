interface ArticleSEOData {
  title: string;
  excerpt?: string;
  cover_url?: string;
  published_at?: string;
  updated_at?: string;
  category?: {
    name: string;
  };
  author?: {
    name: string;
  };
  slug: string;
}

/**
 * Set SEO meta tags cho article
 */
export function setArticleSEO(article: ArticleSEOData) {
  const title = article.title;
  const description = article.excerpt?.slice(0, 155) || article.title;
  const imageUrl = article.cover_url || article.cover_url;
  const url = window.location.href;

  // Set document title
  document.title = `${title} - Portal 365`;

  // Helper function để set meta tag
  const setMeta = (name: string, content: string, property?: boolean) => {
    if (!content) return;
    
    const attr = property ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  };

  // Basic meta tags
  setMeta('description', description);
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  // Open Graph tags
  setMeta('og:type', 'article', true);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', url, true);
  if (imageUrl) {
    setMeta('og:image', imageUrl, true);
  }

  // Twitter Card tags
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  if (imageUrl) {
    setMeta('twitter:image', imageUrl);
  }

  // JSON-LD Schema
  setArticleSchema({
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: article.author?.name || 'Portal 365',
    articleSection: article.category?.name,
    url: url,
  });
}

/**
 * Set JSON-LD Article schema
 */
function setArticleSchema(data: {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author: string;
  articleSection?: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Portal 365',
      logo: {
        '@type': 'ImageObject',
        url: window.location.origin + '/logo.png',
      },
    },
    articleSection: data.articleSection,
    url: data.url,
  };

  // Remove existing schema
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Clear SEO meta tags (để cleanup khi component unmount)
 */
export function clearSEO() {
  document.title = 'Portal 365';
  
  const metas = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]');
  metas.forEach(meta => meta.remove());
  
  const schema = document.querySelector('script[type="application/ld+json"]');
  if (schema) schema.remove();
  
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.remove();
}
