# Portal 365 - Testing Guide

## ✅ Các vấn đề đã được sửa:

### 1. Frontend API Hooks (frontend/src/hooks/useApi.ts)
- **Trước**: Gọi `api.adminMediaUploadCreate()`, `api.mediaList()` - methods không tồn tại
- **Sau**: Viết lại hooks dùng `fetch()` trực tiếp với Bearer authentication
- **Thay đổi**:
  - `useMediaItems()`: Fetch từ `/admin/media?media_type=<type>`
  - `useUploadMedia()`: POST multipart FormData to `/admin/media/upload`
  - `useDeleteMedia()`: DELETE `/admin/media/:id`
  - Parameter: `type` → `media_type`

### 2. Backend Route Conflict (backend/cmd/server/main.go)
- **Lỗi**: Duplicate `/static/uploads` route causing server panic
- **Sửa**: Xóa route duplicate, chỉ giữ `/static` trong routes.Setup()

### 3. JWT Token Generation (backend/generate_token.go)
- **Tạo**: Script để generate test tokens
- **Secret**: `"change-me-in-production"` (match backend default)
- **Claims**: sub, email, name, roles, iat, exp

## 🚀 Cách test:

### A. Backend đang chạy trên http://localhost:8080
### B. Frontend đang chạy trên http://localhost:5173

### Test 1: Login và lấy token

```powershell
# Chạy script test
powershell -ExecutionPolicy Bypass -File c:\Users\Admin\portal-365\test_login.ps1
```

Token sẽ được in ra. Copy token này.

### Test 2: Test trong Browser

1. Mở http://localhost:5173
2. Mở DevTools Console (F12)
3. Paste token vào localStorage:
```javascript
localStorage.setItem('accessToken', 'TOKEN_VỪA_COPY_TỪ_TEST_LOGIN');
```

### Test 3: Kiểm tra các chức năng

**A. Documents Management:**
1. Vào http://localhost:5173/admin/docs
2. Kiểm tra:
   - ✅ Danh sách documents hiển thị (3 documents)
   - ✅ Upload document hoạt động
   - ✅ Delete document hoạt động

**B. Media Management:**
1. Vào http://localhost:5173/admin/media
2. Chọn tab "Ảnh" hoặc "Video"
3. Kiểm tra:
   - ✅ Danh sách hiển thị (không còn "Không thể tải dữ liệu")
   - ✅ Upload file hoạt động (không còn lỗi "api.adminMediaUploadCreate is not a function")
   - ✅ Delete file hoạt động

## 📝 Token mẫu (hết hạn sau 15 phút):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc2MjUxNzcyNiwiaWF0IjoxNzYyNTE2ODI2fQ.8WUPdbJj2YQ7wbl8ACWS3Og32uFOv6lvcB9AEp-wzwA
```

**Để tạo token mới:**
```powershell
cd c:\Users\Admin\portal-365\backend
go run generate_token.go
```

## 🔧 Seed Media Data (nếu muốn test với data mẫu)

```powershell
cd c:\Users\Admin\portal-365\backend
go run cmd/seed/main.go
```

## 🎯 Kết quả mong đợi:

✅ **Issue #1 Fixed**: Upload không còn lỗi "api.adminMediaUploadCreate is not a function"
✅ **Issue #2 Fixed**: Danh sách documents/media hiển thị đúng, không còn "Không thể tải dữ liệu"
✅ **Authentication**: JWT tokens hoạt động với backend
✅ **API Endpoints**: Tất cả admin endpoints đều authenticated properly

## ⚠️ Lưu ý:

- Token hết hạn sau 15 phút (ACCESS_TOKEN_TTL), cần login lại để lấy token mới
- Hoặc chạy `generate_token.go` để tạo token test với expiry 24h
- Media chưa có seed data mặc định, cần upload manual hoặc chạy seed script
