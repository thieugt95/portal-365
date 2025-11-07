import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Images, Search, Eye } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { getBreadcrumbs } from '../../config/navigation';
import { usePublicMediaItems } from '../../hooks/useApi';

const ITEMS_PER_PAGE = 24;

export default function MediaPhotos() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Fetch images from API
  const { data, isLoading, error } = usePublicMediaItems({ 
    page: currentPage, 
    page_size: ITEMS_PER_PAGE,
    media_type: 'image'
  });

  const images = data?.data || [];
  const pagination = data?.pagination || { page: 1, page_size: ITEMS_PER_PAGE, total: 0, total_pages: 1 };

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Filter images by search
  const filteredImages = images.filter((img: any) => 
    !searchQuery || 
    img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />
      <Breadcrumbs items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Thư viện ảnh
          </h1>
          <p className="text-gray-600">
            Album ảnh các hoạt động, sự kiện ({pagination.total} ảnh)
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm ảnh..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Đang tải ảnh...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Images className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-600">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : filteredImages.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {filteredImages.map((img: any) => (
                <div 
                  key={img.id} 
                  className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.thumbnail_url || img.url || 'https://via.placeholder.com/400'}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {img.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'Không tìm thấy ảnh phù hợp' : 'Chưa có ảnh nào'}
            </p>
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {selectedImage && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedImage(null)}
          title={selectedImage.title}
        >
          <div className="w-full">
            <img
              src={selectedImage.url || selectedImage.thumbnail_url}
              alt={selectedImage.title}
              className="w-full h-auto"
            />
            {selectedImage.description && (
              <p className="mt-4 text-gray-600">{selectedImage.description}</p>
            )}
          </div>
        </Modal>
      )}

      <SiteFooter />
    </div>
  );
}
