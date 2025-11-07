import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './context/AuthProvider';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ArticlePage from './pages/article/ArticlePage';
import CategoryPage from './pages/category/CategoryPage';
import CategoryDetailPage from './pages/CategoryDetail';
import SearchPage from './pages/Search';
import IntroPage from './pages/Intro';
import UsersList from './pages/admin/users/List';
import UserForm from './pages/admin/users/Form';
import ArticlesList from './pages/admin/articles/List';
import ArticleForm from './pages/admin/articles/Form';
import AdminDashboard from './pages/admin/Dashboard';
import NewsAdminList from './pages/admin/news/List';
import DocsAdminList from './pages/admin/docs/List';
import MediaAdminList from './pages/admin/media/List';
import BannersAdminList from './pages/admin/banners/List';
import BannerForm from './pages/admin/banners/Form';
import PagesList from './pages/admin/pages/List';
import PageForm from './pages/admin/pages/Form';
import IntroductionList from './pages/admin/Introduction';
import IntroductionEdit from './pages/admin/IntroductionEdit';
import NotFound from './pages/NotFound';

// New section pages
import ActivitiesIndex from './pages/activities/Index';
import NewsIndex from './pages/news/Index';
import DocsIndex from './pages/docs/Index';
import MediaVideos from './pages/media/Videos';
import MediaPhotos from './pages/media/Photos';
import { CategoryListPage } from './pages/CategoryListPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Lưu đường dẫn hiện tại để redirect sau khi login
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }
  
  return <>{children}</>;
}

// Redirect old article URLs to new format
function RedirectToArticle() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/a/${slug}`} replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/a/:slug" element={<ArticlePage />} />
            {/* Redirect old article URLs */}
            <Route path="/articles/:slug" element={<RedirectToArticle />} />
            {/* New category pages */}
            <Route path="/c/:slug" element={<CategoryPage />} />
            {/* Legacy category routes */}
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/documents/:slug" element={<CategoryDetailPage />} />
            <Route path="/media/:slug" element={<CategoryDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/intro/:slug" element={<IntroPage />} />
            <Route path="/gioi-thieu/:slug" element={<IntroPage />} />
            
            {/* Section Pages */}
            <Route path="/activities" element={<ActivitiesIndex />} />
            <Route path="/news" element={<NewsIndex />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/media/videos" element={<MediaVideos />} />
            <Route path="/media/photos" element={<MediaPhotos />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Redirect old /admin/activities to /admin */}
            <Route
              path="/admin/activities"
              element={
                <ProtectedRoute>
                  <Navigate to="/admin" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/articles"
              element={
                <ProtectedRoute>
                  <ArticlesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/articles/create"
              element={
                <ProtectedRoute>
                  <ArticleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/articles/:id/edit"
              element={
                <ProtectedRoute>
                  <ArticleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id/edit"
              element={
                <ProtectedRoute>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pages"
              element={
                <ProtectedRoute>
                  <PagesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pages/new"
              element={
                <ProtectedRoute>
                  <PageForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pages/:id/edit"
              element={
                <ProtectedRoute>
                  <PageForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/introduction"
              element={
                <ProtectedRoute>
                  <IntroductionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/introduction/:key"
              element={
                <ProtectedRoute>
                  <IntroductionEdit />
                </ProtectedRoute>
              }
            />

            {/* Admin News */}
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute>
                  <NewsAdminList />
                </ProtectedRoute>
              }
            />

            {/* Admin Documents */}
            <Route
              path="/admin/docs"
              element={
                <ProtectedRoute>
                  <DocsAdminList />
                </ProtectedRoute>
              }
            />

            {/* Admin Media */}
            <Route
              path="/admin/media"
              element={
                <ProtectedRoute>
                  <MediaAdminList />
                </ProtectedRoute>
              }
            />

            {/* Admin Banners */}
            <Route
              path="/admin/banners"
              element={
                <ProtectedRoute>
                  <BannersAdminList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/banners/new"
              element={
                <ProtectedRoute>
                  <BannerForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/banners/:id/edit"
              element={
                <ProtectedRoute>
                  <BannerForm />
                </ProtectedRoute>
              }
            />

            {/* Catch all - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
