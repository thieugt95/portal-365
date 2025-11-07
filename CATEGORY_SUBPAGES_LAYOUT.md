# Category Subpages Layout Documentation

## Tổng quan

Hệ thống trang chuyên mục (Category Subpages) với layout 2 cột:
- **Cột trái (Main)**: Danh sách bài viết chính của chuyên mục với pagination
- **Cột phải (Rails)**: 6 rails dọc hiển thị các chuyên mục khác

## Cấu trúc Categories

### 7 Chuyên mục Cố định

#### Nhóm "Hoạt động" (Activities)
1. **Hoạt động của Sư đoàn**
   - Slug: `hoat-dong-cua-su-doan`
   - URL: `/c/hoat-dong-cua-su-doan`

2. **Hoạt động của các đơn vị**
   - Slug: `hoat-dong-cua-cac-don-vi`
   - URL: `/c/hoat-dong-cua-cac-don-vi`

3. **Hoạt động của Thủ trưởng Sư đoàn**
   - Slug: `hoat-dong-cua-thu-truong`
   - URL: `/c/hoat-dong-cua-thu-truong`

#### Nhóm "Tin tức" (News)
4. **Tin trong nước**
   - Slug: `tin-trong-nuoc`
   - URL: `/c/tin-trong-nuoc`

5. **Tin quốc tế**
   - Slug: `tin-quoc-te`
   - URL: `/c/tin-quoc-te`

6. **Tin quân sự**
   - Slug: `tin-quan-su`
   - URL: `/c/tin-quan-su`

7. **Tin hoạt động của Sư đoàn**
   - Slug: `tin-hoat-dong-cua-su-doan`
   - URL: `/c/tin-hoat-dong-cua-su-doan`

## Luồng Dữ liệu

### 1. Request Flow

```
User → /c/:slug
  ↓
CategoryPage component
  ↓
├─ useCategory(slug) → GET /api/v1/categories/:slug
├─ useCategoryArticles(slug, options) → GET /api/v1/articles?category_slug=:slug&page=&page_size=12
└─ useCategoryRails(sideRailSlugs, 5) → 6x GET /api/v1/articles?category_slug=:slug&page_size=5
```

### 2. Query Keys Structure

```typescript
// Main list
['articles', 'list', { slug, page, page_size, sort, q }]

// Single rail
['articles', 'list', { slug, page: 1, page_size: 5, rail: true }]

// Category detail
['category', 'detail', slug]

// All rails
['category', 'rails', { slugs: 'slug1,slug2,...', limit: 5 }]
```

### 3. Cache Strategy

| Data Type | Stale Time | Strategy |
|-----------|-----------|----------|
| Main list | 30s | Frequent updates |
| Rails | 60s | Less frequent |
| Category info | 5min | Rarely changes |

## Components Architecture

```
pages/category/CategoryPage.tsx
  ├─ components/category/CategoryMainList.tsx
  │    ├─ components/common/ArticleCardMain.tsx (grid 2 cols)
  │    └─ components/common/Pagination.tsx
  │
  └─ components/category/CategoryRail.tsx (6x)
       └─ components/common/ArticleCardRail.tsx (5x each)
```

### Component Props

#### CategoryPage
- Params: `slug` từ URL
- State: None (managed by hooks)
- Features:
  - Breadcrumb navigation
  - SEO meta tags
  - 404 handling
  - Responsive layout

#### CategoryMainList
```typescript
{
  slug: string;
  categoryName: string;
  description?: string;
}
```
- Features:
  - Search input
  - Sort dropdown (Mới nhất / Xem nhiều / A-Z)
  - Pagination
  - Empty state
  - Error handling với Retry

#### CategoryRail
```typescript
{
  slug: string;
  title: string;
  limit?: number; // default 5
}
```
- Features:
  - "Xem tất cả →" link
  - Independent error handling
  - Skeleton loader
  - Auto-hide if empty

## API Requirements

### Endpoints

#### 1. GET /api/v1/articles
```
Query params:
- category_slug: string
- page: number (≥1)
- page_size: number (≤50)
- sort: string (-published_at, -view_count, title)
- q: string (search query)

Response:
{
  "data": Article[],
  "pagination": {
    "page": number,
    "page_size": number,
    "total": number,
    "total_pages": number
  }
}
```

#### 2. GET /api/v1/categories/:slug
```
Response:
{
  "data": {
    "id": number,
    "name": string,
    "slug": string,
    "description": string,
    "is_active": boolean,
    "sort_order": number
  }
}
```

### Optional Optimization: /api/v1/category-rails

```
Query params:
- slugs: string (comma-separated)
- limit: number (default 5)

Response:
{
  "data": [
    {
      "category": { id, name, slug },
      "articles": Article[]
    },
    ...
  ]
}
```

Benefits:
- 1 request thay vì 6
- Reduced latency
- Consistent cache invalidation

## Responsive Layout

### Desktop (≥1024px)
```
┌─────────────────────────────────────────┐
│ Breadcrumb                               │
├──────────────────────┬──────────────────┤
│                      │                  │
│  Main List (66%)     │  Rails (33%)     │
│  - Search/Sort       │  - Rail 1        │
│  - Article Cards     │  - Rail 2        │
│  - Pagination        │  - Rail 3        │
│                      │  - Rail 4        │
│                      │  - Rail 5        │
│                      │  - Rail 6        │
│                      │  (sticky)        │
└──────────────────────┴──────────────────┘
```

### Tablet (768px-1023px)
```
┌─────────────────────────────────────────┐
│ Breadcrumb                               │
├─────────────────────────────────────────┤
│ Main List (full width)                  │
│ - Search/Sort                            │
│ - Article Cards (2 cols)                │
│ - Pagination                             │
├─────────────────────────────────────────┤
│ Rails (2 cols grid)                     │
│ ┌───────────┬───────────┐               │
│ │ Rail 1    │ Rail 2    │               │
│ ├───────────┼───────────┤               │
│ │ Rail 3    │ Rail 4    │               │
│ ├───────────┼───────────┤               │
│ │ Rail 5    │ Rail 6    │               │
│ └───────────┴───────────┘               │
└─────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌───────────────────┐
│ Breadcrumb        │
├───────────────────┤
│ Main List         │
│ - Search/Sort     │
│ - Article Cards   │
│   (1 col)         │
│ - Pagination      │
├───────────────────┤
│ Rails (stacked)   │
│ - Rail 1          │
│ - Rail 2          │
│ - Rail 3          │
│ - Rail 4          │
│ - Rail 5          │
│ - Rail 6          │
└───────────────────┘
```

## Publish Workflow & Cache Invalidation

### Khi Publish Bài Mới

1. **Backend**: Bài chuyển `status = published`
   ```
   SET published_at = NOW()
   ```

2. **Cache Invalidation** (frontend):
   ```typescript
   // Invalidate main list của category đó
   queryClient.invalidateQueries(['articles', 'list', { slug: article.category_slug }]);
   
   // Invalidate rails (tất cả category khác sẽ refresh)
   queryClient.invalidateQueries(['category', 'rails']);
   
   // Optional: Home page
   queryClient.invalidateQueries(['home', 'rails']);
   ```

3. **Auto Refresh**: Với staleTime 30-60s, cache sẽ tự refresh trong vòng 1 phút

### Implementation trong Admin

```typescript
// pages/admin/articles/Form.tsx
const publishMutation = useMutation({
  mutationFn: (articleId) => api.publishArticle(articleId),
  onSuccess: (data) => {
    // Invalidate category list
    queryClient.invalidateQueries([
      'articles',
      'list',
      { slug: data.category_slug }
    ]);
    
    // Invalidate all rails
    queryClient.invalidateQueries({ queryKey: ['category', 'rails'] });
  },
});
```

## SEO Implementation

### Meta Tags
```typescript
// Document title
document.title = `${categoryName} - Portal 365`;

// Description
<meta name="description" content="Tin tức và bài viết về {categoryName}" />

// Canonical
<link rel="canonical" href="https://portal365.vn/c/{slug}" />

// Open Graph
<meta property="og:type" content="website" />
<meta property="og:title" content="{categoryName} - Portal 365" />
<meta property="og:url" content="https://portal365.vn/c/{slug}" />
```

### Breadcrumb Schema (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Trang chủ",
      "item": "https://portal365.vn"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Hoạt động",
      "item": "https://portal365.vn/activities"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Hoạt động của Sư đoàn",
      "item": "https://portal365.vn/c/hoat-dong-cua-su-doan"
    }
  ]
}
```

## Thêm Category Mới

### Bước 1: Update Constants (Frontend)
```typescript
// pages/category/CategoryPage.tsx
const CATEGORY_SLUGS = [
  // ... existing
  'slug-moi',
] as const;

const CATEGORY_NAMES: Record<string, string> = {
  // ... existing
  'slug-moi': 'Tên Chuyên Mục Mới',
};

const CATEGORY_GROUPS: Record<string, 'activities' | 'news'> = {
  // ... existing
  'slug-moi': 'activities', // hoặc 'news'
};
```

### Bước 2: Seed Backend (nếu cần)
```sql
INSERT INTO categories (name, slug, description, is_active, sort_order, group)
VALUES ('Tên Chuyên Mục Mới', 'slug-moi', 'Mô tả...', true, 8, 'activities');
```

### Bước 3: Không cần rebuild
- Frontend tự động nhận category mới qua constants
- Rails tự động thêm vào sidebar
- Routing tự động hoạt động với pattern `/c/:slug`

## Performance Checklist

- [x] Images lazy load với `loading="lazy"`
- [x] Aspect ratio classes để tránh CLS
- [x] React Query staleTime strategy
- [x] Pagination server-side
- [x] Rails load độc lập (không block main list)
- [x] Error boundary cho từng rail
- [x] Skeleton loaders
- [x] Prefetch on hover (optional)

## Accessibility

- [x] Semantic HTML (`<nav>`, `<aside>`, `<article>`)
- [x] ARIA labels (`aria-label="Các chuyên mục khác"`)
- [x] Breadcrumb navigation
- [x] Keyboard focus styles
- [x] Alt text cho images
- [x] Heading hierarchy (H1 → H2 → H3)

## Testing Scenarios

1. **Navigation**: Click từ Home → Category → Rails
2. **Pagination**: Chuyển trang, search, sort
3. **Empty State**: Category không có bài
4. **Error Handling**: Network fail main vs rails
5. **Responsive**: Test mobile, tablet, desktop
6. **Publish**: Admin publish → Refresh category page
7. **404**: Slug không tồn tại
8. **Performance**: Lighthouse score ≥ 85

## Troubleshooting

### Issue: Rails không load
- Check API endpoint `/articles?category_slug=`
- Verify slug matches backend
- Check network tab for 404/500

### Issue: Pagination không hoạt động
- Verify query param `?page=` trong URL
- Check `useState` page sync
- Ensure backend returns `pagination` object

### Issue: Cache không invalidate sau publish
- Check `queryClient.invalidateQueries` call
- Verify queryKey match chính xác
- Set staleTime thấp hơn để test

## File Structure
```
src/
├── hooks/
│   ├── useCategory.ts
│   └── useCategoryArticles.ts
├── components/
│   ├── category/
│   │   ├── CategoryMainList.tsx
│   │   └── CategoryRail.tsx
│   └── common/
│       ├── ArticleCardMain.tsx
│       ├── ArticleCardRail.tsx
│       └── Pagination.tsx
└── pages/
    └── category/
        └── CategoryPage.tsx
```

---

**Version**: 1.0  
**Last Updated**: 2025-11-07  
**Maintainer**: Frontend Team
