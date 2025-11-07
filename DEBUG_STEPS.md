# 🧪 Hướng dẫn Test và Debug Admin Pages

## Tình trạng hiện tại

✅ **Backend**: Đang chạy thành công trên http://localhost:8080
✅ **Frontend**: Đang chạy thành công trên http://localhost:5173  
✅ **API Backend**: Đã test và hoạt động tốt (6 documents, 6 images, 4 videos)
❓ **Admin Pages Frontend**: Cần kiểm tra xem có hiển thị dữ liệu không

## Bước 1: Mở trang test

Mở file này trong browser:
```
c:\Users\Admin\portal-365\test-frontend-admin.html
```

Cách mở:
1. **Windows Explorer**: Double-click vào file `test-frontend-admin.html`
2. **Hoặc**: Kéo thả file vào browser
3. **Hoặc**: Copy đường dẫn này vào browser: `file:///c:/Users/Admin/portal-365/test-frontend-admin.html`

## Bước 2: Test Backend và Login

Trên trang test:

1. **Check Backend Status**: Nhấn nút này để đảm bảo backend đang chạy
   - ✅ Mong đợi: "Backend đang chạy"
   - ❌ Nếu lỗi: Backend chưa chạy, cần start lại

2. **Test Login API**: Nhấn nút này để đăng nhập
   - Email: `admin@portal365.com`
   - Password: `admin123`
   - ✅ Mong đợi: "Đăng nhập thành công!" và token được lưu
   - Token sẽ được lưu vào localStorage

3. **Check LocalStorage**: Nhấn nút này để kiểm tra token
   - ✅ Mong đợi: Thấy Access Token và User data
   - Kiểm tra token còn hiệu lực (15 phút)

## Bước 3: Test Admin APIs

Sau khi đã đăng nhập:

1. **Test GET /admin/documents**:
   - Nhấn nút "Test GET /admin/documents"
   - ✅ Mong đợi: "Thành công! Nhận được 6 documents"
   - Xem danh sách documents trong output

2. **Test GET /admin/media (Images)**:
   - Nhấn nút "Test GET /admin/media (Images)"
   - ✅ Mong đợi: "Thành công! Nhận được 6 images"
   - Xem danh sách images trong output

3. **Test GET /admin/media (Videos)**:
   - Nhấn nút "Test GET /admin/media (Videos)"
   - ✅ Mong đợi: "Thành công! Nhận được 4 videos"
   - Xem danh sách videos trong output

## Bước 4: Kiểm tra Admin Pages thật

### 4.1. Đăng nhập vào Frontend

1. Nhấn nút **"Open /login"** (sẽ mở tab mới)
2. Đăng nhập với:
   - Email: `admin@portal365.com`
   - Password: `admin123`
3. Sau khi đăng nhập, bạn sẽ được chuyển đến Dashboard

### 4.2. Kiểm tra Admin Documents Page

1. Nhấn nút **"Open /admin/docs"** (hoặc navigate từ admin menu)
2. **MỞ CONSOLE** (nhấn F12, chọn tab Console)
3. Tìm dòng log: `Admin Documents Debug:`
4. Kiểm tra thông tin trong log:

```javascript
Admin Documents Debug: {
  isLoading: false,        // ← Phải là false khi load xong
  error: null,             // ← Phải là null (không có lỗi)
  dataReceived: true,      // ← Phải là true (đã nhận data)
  documentsCount: 6,       // ← Phải là 6 (số documents)
  pagination: {...},       // ← Object chứa thông tin phân trang
  rawData: {...}          // ← Data từ API
}
```

### 4.3. Kiểm tra Admin Media Page

1. Nhấn nút **"Open /admin/media"** (hoặc navigate từ admin menu)
2. **MỞ CONSOLE** (nhấn F12, chọn tab Console)
3. Tìm dòng log: `Admin Media Debug:`
4. Kiểm tra thông tin trong log:

```javascript
Admin Media Debug: {
  activeTab: 'images',     // ← Tab đang active (images/videos)
  isLoading: false,        // ← Phải là false khi load xong
  error: null,             // ← Phải là null (không có lỗi)
  dataReceived: true,      // ← Phải là true (đã nhận data)
  mediaItemsCount: 6,      // ← Số lượng items (6 cho images, 4 cho videos)
  pagination: {...},       // ← Object chứa thông tin phân trang
  rawData: {...}          // ← Data từ API
}
```

## Bước 5: Phân tích kết quả

### ✅ Case 1: Console log hiển thị data nhưng UI không hiển thị

**Triệu chứng:**
```javascript
Admin Documents Debug: {
  documentsCount: 6,  // ← Có data
  dataReceived: true
}
```
Nhưng màn hình vẫn hiển thị "No documents" hoặc trống

**Nguyên nhân**: Lỗi trong phần render component

**Giải pháp**: Kiểm tra logic hiển thị trong component

### ❌ Case 2: Console log không có data

**Triệu chứng:**
```javascript
Admin Documents Debug: {
  documentsCount: 0,     // ← Không có data
  dataReceived: false,
  error: null
}
```

**Nguyên nhân**: API call không thành công hoặc chưa được gọi

**Giải pháp**: 
1. Kiểm tra Network tab xem có API call nào không
2. Kiểm tra response của API call (200 OK?)
3. Kiểm tra token có được gửi trong Authorization header không

### ❌ Case 3: Console log có error

**Triệu chứng:**
```javascript
Admin Documents Debug: {
  error: { message: "..." }  // ← Có lỗi
}
```

**Nguyên nhân**: Token hết hạn, không có quyền, hoặc lỗi khác

**Giải pháp**:
1. Kiểm tra message của error
2. Nếu là 401 Unauthorized: Token hết hạn → Login lại
3. Nếu là 403 Forbidden: Không có quyền → Kiểm tra role
4. Nếu là Network Error: Backend không chạy hoặc CORS issue

### ❌ Case 4: Token không tồn tại trong localStorage

**Triệu chứng**: Khi chạy lệnh này trong Console:
```javascript
localStorage.getItem('accessToken')
// Returns: null
```

**Nguyên nhân**: Chưa đăng nhập hoặc token đã bị xóa

**Giải pháp**: Đăng nhập lại tại http://localhost:5173/login

## Bước 6: Test upload (nếu data hiển thị OK)

### Upload Document

1. Trên trang `/admin/docs`
2. Click nút "Upload Document"
3. Chọn file PDF/DOC/DOCX (tối đa 10MB)
4. Nhập title
5. Click Upload
6. **MỞ NETWORK TAB** (F12 → Network)
7. Xem request đến `/admin/documents/upload`
8. Kiểm tra:
   - Status: 200 OK (thành công)
   - Status: 401 (token hết hạn → login lại)
   - Status: 400 (file không hợp lệ → check file type/size)
   - Status: 500 (lỗi server → check backend console)

### Upload Media

1. Trên trang `/admin/media`
2. Chọn tab Images hoặc Videos
3. Click nút "Upload"
4. Chọn file:
   - Images: JPG, PNG, GIF (tối đa 5MB)
   - Videos: MP4, AVI, MOV (tối đa 100MB)
5. Nhập title
6. Click Upload
7. **MỞ NETWORK TAB** để check response

## Bước 7: Commands để test trực tiếp trong Console

Mở Console (F12) trên trang admin và chạy:

```javascript
// 1. Kiểm tra token
const token = localStorage.getItem('accessToken');
console.log('Token exists:', !!token);

// 2. Decode token để xem expiry
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token expires:', new Date(payload.exp * 1000));
  console.log('Token expired:', new Date(payload.exp * 1000) < new Date());
}

// 3. Test API documents trực tiếp
fetch('http://localhost:8080/api/v1/admin/documents', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => {
  console.log('API Response:', d);
  console.log('Documents count:', d.data?.length);
});

// 4. Test API media images
fetch('http://localhost:8080/api/v1/admin/media?media_type=image', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => {
  console.log('Images Response:', d);
  console.log('Images count:', d.data?.length);
});

// 5. Test API media videos
fetch('http://localhost:8080/api/v1/admin/media?media_type=video', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => {
  console.log('Videos Response:', d);
  console.log('Videos count:', d.data?.length);
});

// 6. Xem tất cả localStorage
console.log('All localStorage:', {
  token: localStorage.getItem('accessToken')?.substring(0, 50) + '...',
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  refreshToken: !!localStorage.getItem('refreshToken')
});
```

## Checklist tổng hợp

- [ ] Backend đang chạy (port 8080)
- [ ] Frontend đang chạy (port 5173)
- [ ] Test page đã mở và check backend OK
- [ ] Login thành công và token được lưu
- [ ] Test API documents → 6 items
- [ ] Test API images → 6 items
- [ ] Test API videos → 4 items
- [ ] Đăng nhập vào frontend (/login)
- [ ] Mở /admin/docs và check Console
- [ ] Console log "Admin Documents Debug" hiển thị đúng data
- [ ] UI hiển thị documents (hoặc ghi nhận lý do không hiển thị)
- [ ] Mở /admin/media và check Console
- [ ] Console log "Admin Media Debug" hiển thị đúng data
- [ ] UI hiển thị media items (hoặc ghi nhận lý do không hiển thị)
- [ ] (Optional) Test upload document
- [ ] (Optional) Test upload media

## Kết quả mong đợi

Sau khi làm theo các bước trên, bạn sẽ biết chính xác:

1. **Backend có hoạt động không?** → ✅ Đã confirm hoạt động
2. **API có trả về data không?** → ✅ Đã confirm trả về đúng
3. **Frontend có nhận được data không?** → Cần check Console log
4. **Data có được hiển thị trên UI không?** → Cần check trang admin
5. **Upload có hoạt động không?** → Cần test sau khi data hiển thị OK

## Nếu vẫn có vấn đề

Hãy báo lại kết quả từ Console log:

1. Copy toàn bộ output của "Admin Documents Debug:"
2. Copy toàn bộ output của "Admin Media Debug:"
3. Screenshot màn hình admin pages
4. Screenshot Network tab nếu có lỗi API

Tôi sẽ phân tích và đưa ra giải pháp cụ thể!
