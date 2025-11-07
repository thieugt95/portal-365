# Hướng Dẫn Kiểm Tra Và Sửa Lỗi Admin Pages

## Vấn Đề
- Trang `/admin/docs` và `/admin/media` không hiển thị dữ liệu
- Không thể upload được

## Đã Kiểm Tra
✅ Backend API hoạt động tốt:
- `/api/v1/admin/documents` → 6 documents
- `/api/v1/admin/media?media_type=image` → 6 images  
- `/api/v1/admin/media?media_type=video` → 4 videos

✅ Authentication working:
- Login trả về valid token
- Token được accept bởi backend

✅ Frontend hooks đã có sẵn và đúng:
- `useAdminDocuments()`
- `useMediaItems()`
- `useUploadDocument()`
- `useUploadMedia()`

## Debug Steps

### Bước 1: Login và kiểm tra token
1. Mở http://localhost:5173/login
2. Login với:
   - Email: `admin@portal365.com`
   - Password: `admin123`
3. Mở Browser Console (F12)
4. Chạy:
```javascript
console.log('Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));
```

### Bước 2: Kiểm tra admin pages
1. Vào http://localhost:5173/admin/docs
2. Mở Console - sẽ thấy debug logs:
```
Admin Documents Debug: {
  isLoading: false,
  error: null,
  dataReceived: true,
  documentsCount: 6,
  ...
}
```

3. Vào http://localhost:5173/admin/media
4. Check console logs tương tự

### Bước 3: Test API trực tiếp từ browser
Trong Console, chạy:
```javascript
const token = localStorage.getItem('accessToken');

// Test documents
fetch('http://localhost:8080/api/v1/admin/documents', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Documents:', data));

// Test media
fetch('http://localhost:8080/api/v1/admin/media?media_type=image', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Media:', data));
```

### Bước 4: Test Upload
Mở file `test-admin-upload.html` trong browser:
```
file:///c:/Users/Admin/portal-365/test-admin-upload.html
```

1. Click "Test Login"
2. Click "Get Documents" → Should show 6 items
3. Click "Get Images" → Should show 6 items
4. Select a PDF file → Click "Upload" in Documents section
5. Select an image → Click "Upload" in Media section

## Các Lỗi Thường Gặp

### 1. Không có token
**Triệu chứng**: `localStorage.getItem('accessToken')` returns null
**Giải pháp**: Login lại tại /login

### 2. Token hết hạn
**Triệu chứng**: API returns 401 Unauthorized
**Giải pháp**: Login lại (token có thời hạn 15 phút)

### 3. CORS Error
**Triệu chứng**: Console shows CORS error
**Giải pháp**: Kiểm tra backend CORS_ALLOWED_ORIGINS có http://localhost:5173

### 4. Network Error
**Triệu chứng**: "Failed to fetch"
**Giải pháp**: 
- Kiểm tra backend đang chạy: `netstat -ano | findstr :8080`
- Kiểm tra frontend đang chạy: `netstat -ano | findstr :5173`

### 5. Data không hiển thị dù API trả về đúng
**Triệu chứng**: Console log shows data but UI empty
**Giải pháp**: 
- Check React Query devtools
- Xem loading state có stuck không
- Hard refresh: Ctrl+Shift+R

## Files Đã Thêm Debug

### `frontend/src/pages/admin/docs/List.tsx`
```typescript
// Debug logging (line ~40)
console.log('Admin Documents Debug:', {
  isLoading,
  error,
  dataReceived: !!data,
  documentsCount: documents.length,
  pagination,
  rawData: data
});
```

### `frontend/src/pages/admin/media/List.tsx`
```typescript
// Debug logging (line ~45)
console.log('Admin Media Debug:', {
  activeTab,
  isLoading,
  error,
  dataReceived: !!data,
  mediaItemsCount: mediaItems.length,
  pagination,
  rawData: data
});
```

## Expected Console Output

### Documents Page
```
Admin Documents Debug: {
  isLoading: false,
  error: undefined,
  dataReceived: true,
  documentsCount: 6,
  pagination: { page: 1, page_size: 20, total: 6, total_pages: 1 },
  rawData: { data: [...], pagination: {...} }
}
```

### Media Page
```
Admin Media Debug: {
  activeTab: "images",
  isLoading: false,
  error: undefined,
  dataReceived: true,
  mediaItemsCount: 6,
  pagination: { page: 1, page_size: 24, total: 6, total_pages: 1 },
  rawData: { data: [...], pagination: {...} }
}
```

## Nếu Vẫn Không Hoạt Động

1. Clear browser cache và localStorage:
```javascript
localStorage.clear();
location.reload();
```

2. Login lại

3. Check Network tab trong DevTools:
   - Xem request được gửi đi không
   - Xem status code (200 = OK, 401 = auth error, 500 = server error)
   - Xem response body

4. Kiểm tra React Query cache:
   - Install React Query DevTools nếu chưa có
   - Xem query status và data

## Contact
Nếu cần hỗ trợ thêm, cung cấp:
1. Screenshot console logs
2. Screenshot Network tab
3. Token value (first 20 chars)
4. Error messages đầy đủ
