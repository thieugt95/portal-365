# Article Detail Page Implementation

## ✅ Hoàn thành

### 1. Cài đặt Dependencies
- ✅ @tailwindcss/typography
- ✅ dompurify
- ✅ @types/dompurify
- ✅ react-icons

### 2. Cấu hình
- ✅ Thêm Tailwind Typography plugin vào `tailwind.config.js`
- ✅ Thêm print stylesheet vào `main.tsx`

### 3. Hooks
**`hooks/useArticle.ts`**:
- `useArticle(slug)` - Lấy chi tiết bài viết
- `useRelatedArticles(categorySlug, excludeId)` - Lấy bài viết liên quan
- `estimateReadingTime(html)` - Tính thời gian đọc (220 wpm)
- `useIncrementView(articleId)` - Tăng view count (optional)

### 4. Components

**`components/article/ReadingProgress.tsx`**:
- Thanh tiến trình đọc ở top
- Tính % scroll qua article content
- Smooth animation

**`components/article/TableOfContents.tsx`**:
- Parse H2/H3 tự động
- Sticky sidebar
- Highlight mục đang đọc (Intersection Observer)
- Smooth scroll navigation

**`components/article/ShareBar.tsx`**:
- Share: Facebook, Twitter, Zalo
- Copy link với feedback "✓ Đã copy"
- Icons sử dụng emoji

**`components/article/AuthorBox.tsx`**:
- Hiển thị avatar, tên, username
- Fallback avatar từ ui-avatars.com

### 5. Main Page

**`pages/article/ArticlePage.tsx`**:
- **Layout**: 
  - Desktop: 2 cột (content + TOC sidebar)
  - Mobile: 1 cột responsive
- **Hero section**:
  - Breadcrumb (Home › Category › Title)
  - Category chip
  - Tiêu đề lớn (text-4xl)
  - Meta info: avatar, tác giả, thời gian đọc, views, ngày xuất bản
- **Content**:
  - Featured image full-width
  - Summary/excerpt highlighted (bg-blue-50)
  - Tailwind Typography prose classes
  - DOMPurify sanitize HTML
  - Support iframe responsive
- **Footer**:
  - Tags với link `/tag/:slug`
  - ShareBar
  - AuthorBox
  - Related articles (grid 2 cột, max 6 bài)
- **States**:
  - Loading: Skeleton loader
  - Error/404: Centered message với "🏠 Về trang chủ" button
  - Success: Full article display

### 6. SEO

**`utils/seo.ts`**:
- `setArticleSEO(article)`:
  - document.title
  - meta description (truncate 155 chars)
  - canonical link
  - Open Graph tags (og:type=article, og:title, og:description, og:url, og:image)
  - Twitter Card tags
  - JSON-LD Article schema (headline, author, datePublished, dateModified, publisher, articleSection)
- `clearSEO()`: Cleanup khi unmount

### 7. Routing

**`App.tsx`**:
- ✅ Route `/a/:slug` → ArticlePage
- ✅ Redirect `/articles/:slug` → `/a/:slug` (RedirectToArticle component)
- ✅ Import ArticlePage từ `pages/article/ArticlePage`

### 8. Links

Đã kiểm tra và confirm:
- ✅ Home page: `/a/:slug`
- ✅ Tất cả components: `/a/:slug`
- ✅ Không còn link `/articles/:slug` cũ

### 9. Print Stylesheet

**`styles/print.css`**:
- Ẩn: header, nav, footer, aside, buttons, share-bar, TOC, related
- Typography chuẩn print (12pt body, 24pt h1)
- Images: page-break-inside avoid
- Links: show href sau text
- Tables: border collapse

### 10. Features Highlights

✅ **Responsive**: Desktop sidebar, mobile stack
✅ **Performance**: React Query cache 5 phút, lazy load images
✅ **A11y**: Semantic HTML, focus styles, keyboard navigation
✅ **SEO**: Complete meta tags + JSON-LD
✅ **UX**: Reading progress, TOC, smooth scroll, share buttons
✅ **Safety**: DOMPurify sanitize content_html
✅ **Typography**: Tailwind Typography prose classes
✅ **Error handling**: 404 page, error boundary trong useQuery
✅ **Loading**: Skeleton loader

## 🧪 Testing Checklist

1. ✅ Click bài trên Home → ArticlePage load
2. ✅ Route `/a/:slug` hoạt động
3. ✅ Redirect `/articles/:slug` → `/a/:slug`
4. ✅ Không còn trang trắng
5. ✅ 404 cho slug sai
6. ⏳ Related articles load (cần data thật)
7. ⏳ Share copy link (test trên HTTPS)
8. ⏳ SEO tags trong `<head>` (F12 → Elements)
9. ⏳ TOC highlight active section
10. ⏳ Reading progress bar
11. ⏳ Print layout (Ctrl+P)
12. ⏳ Lighthouse score ≥ 85

## 📝 Notes

- **Icons**: Sử dụng emoji thay vì react-icons để tránh dependency issues
- **API**: Endpoint `/api/v1/articles/:slug` phải public (không yêu cầu JWT)
- **View count**: POST endpoint optional, có thể bỏ qua nếu BE chưa support
- **Images**: Featured image từ `featured_image` hoặc `cover_url`
- **Content**: Dùng `content` hoặc `content_html` field
- **Author**: Optional, có fallback UI nếu không có

## 🚀 Deployment

Tất cả files đã được tạo và cấu hình. Để test:

```bash
cd frontend
npm run dev
```

Truy cập: http://localhost:5173
Click vào bất kỳ bài viết nào từ Home → Xem ArticlePage

## 🐛 Known Issues / Todo

- [ ] View increment endpoint chưa có → bỏ qua
- [ ] Prev/Next navigation chưa implement (cần BE support)
- [ ] Comments section chưa có
- [ ] Print test thực tế
- [ ] Lighthouse audit thực tế
