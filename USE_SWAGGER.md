# 🚀 CÁCH DỄ NHẤT - Test Admin APIs qua Swagger UI

## ✅ Swagger UI đang hoạt động!

URL: **http://localhost:8080/swagger/index.html**

## 📋 Hướng dẫn test qua Swagger (CÁCH DỄ NHẤT)

### Bước 1: Mở Swagger UI
1. Mở browser
2. Vào: http://localhost:8080/swagger/index.html
3. Bạn sẽ thấy tất cả API endpoints được list

### Bước 2: Login để lấy Token

1. Tìm section **"Auth"** hoặc tìm endpoint: `POST /api/v1/auth/login`
2. Click vào endpoint đó
3. Click nút **"Try it out"**
4. Điền Request Body:
   ```json
   {
     "email": "admin@portal365.com",
     "password": "admin123"
   }
   ```
5. Click nút **"Execute"**
6. Trong Response, bạn sẽ thấy:
   ```json
   {
     "data": {
       "access_token": "eyJhbGci...",
       "user": {...}
     }
   }
   ```
7. **COPY** chuỗi `access_token` (toàn bộ chuỗi dài)

### Bước 3: Authorize trong Swagger

1. Ở đầu trang Swagger, tìm nút **"Authorize"** (hoặc icon ổ khóa 🔒)
2. Click vào đó
3. Trong ô **"Value"**, điền:
   ```
   Bearer <paste_token_vừa_copy>
   ```
   Ví dụ:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **CHÚ Ý**: Phải có chữ "Bearer" và một dấu cách trước token!
4. Click **"Authorize"**
5. Click **"Close"**

### Bước 4: Test Admin Documents API

1. Tìm endpoint: `GET /api/v1/admin/documents`
2. Click vào endpoint
3. Click **"Try it out"**
4. Điền parameters (optional):
   - page: `1`
   - page_size: `20`
5. Click **"Execute"**
6. Xem Response:
   ```json
   {
     "data": [
       {
         "id": 1,
         "title": "...",
         "file_path": "...",
         "status": "published"
       },
       ...
     ],
     "pagination": {
       "page": 1,
       "page_size": 20,
       "total": 6,
       "total_pages": 1
     }
   }
   ```

**✅ Mong đợi**: Response Code **200**, data có **6 documents**

### Bước 5: Test Admin Media API (Images)

1. Tìm endpoint: `GET /api/v1/admin/media`
2. Click vào endpoint
3. Click **"Try it out"**
4. Điền parameters:
   - **media_type**: `image` (QUAN TRỌNG!)
   - page: `1`
   - page_size: `24`
5. Click **"Execute"**
6. Xem Response

**✅ Mong đợi**: Response Code **200**, data có **6 images**

### Bước 6: Test Admin Media API (Videos)

1. Cùng endpoint: `GET /api/v1/admin/media`
2. Click **"Try it out"**
3. Điền parameters:
   - **media_type**: `video` (QUAN TRỌNG!)
   - page: `1`
   - page_size: `24`
4. Click **"Execute"**
5. Xem Response

**✅ Mong đợi**: Response Code **200**, data có **4 videos**

### Bước 7: Test Upload Document

1. Tìm endpoint: `POST /api/v1/admin/documents/upload`
2. Click vào endpoint
3. Click **"Try it out"**
4. Điền form data:
   - **file**: Click "Choose File" và chọn file PDF/DOC (< 10MB)
   - **title**: Nhập tên document, ví dụ: "Test Document Upload"
   - **category_id**: `11` (Kho Văn bản)
5. Click **"Execute"**
6. Xem Response

**✅ Mong đợi**: Response Code **200** hoặc **201**, document được tạo

### Bước 8: Test Upload Media

1. Tìm endpoint: `POST /api/v1/admin/media/upload`
2. Click vào endpoint
3. Click **"Try it out"**
4. Điền form data:
   - **file**: Click "Choose File" và chọn:
     - Image: JPG/PNG (< 5MB)
     - Video: MP4 (< 100MB)
   - **title**: Nhập tên, ví dụ: "Test Image Upload"
   - **category_id**: 
     - `18` cho images (Thư viện ảnh)
     - `19` cho videos (Thư viện video)
   - **media_type**: `image` hoặc `video`
5. Click **"Execute"**
6. Xem Response

**✅ Mong đợi**: Response Code **200** hoặc **201**, media được tạo

## 🎯 LỢI ÍCH của Swagger UI

✅ **Trực quan**: Thấy tất cả endpoints và schema  
✅ **Dễ dàng**: Click và điền form, không cần viết code  
✅ **Authorize một lần**: Token tự động gửi với mọi request  
✅ **Xem Response**: Thấy ngay kết quả và status code  
✅ **Test Upload**: Upload file dễ dàng qua form  
✅ **Documentation**: Thấy description và schema của từng API  

## 🔍 Debug nếu có lỗi

### Lỗi 401 Unauthorized
**Nguyên nhân**: Token không đúng hoặc hết hạn  
**Giải pháp**: 
1. Login lại qua `POST /api/v1/auth/login`
2. Copy token mới
3. Click "Authorize" và paste token mới

### Lỗi 403 Forbidden
**Nguyên nhân**: User không có quyền (role)  
**Giải pháp**: Đảm bảo login bằng admin account

### Lỗi 400 Bad Request
**Nguyên nhân**: Thiếu parameters hoặc sai format  
**Giải pháp**: Xem Response body để biết field nào bị lỗi

### Lỗi 500 Internal Server Error
**Nguyên nhân**: Lỗi server  
**Giải pháp**: Check backend console để xem error log

## 📊 So sánh với test page HTML

| Phương pháp | Swagger UI | test-frontend-admin.html |
|-------------|------------|--------------------------|
| Dễ sử dụng | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Test Upload | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Xem Schema | ⭐⭐⭐⭐⭐ | ⭐ |
| Trực quan | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Test nhanh | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Kết luận**: Dùng **Swagger UI** để test và upload, dùng **test-frontend-admin.html** để check nhanh!

## ✨ DEMO WORKFLOW ĐẦY ĐỦ

1. **Mở Swagger**: http://localhost:8080/swagger/index.html
2. **Login**: `POST /auth/login` → Copy token
3. **Authorize**: Click 🔒 → Paste "Bearer {token}"
4. **Test GET Documents**: `GET /admin/documents` → Thấy 6 items ✅
5. **Test GET Images**: `GET /admin/media?media_type=image` → Thấy 6 items ✅
6. **Test GET Videos**: `GET /admin/media?media_type=video` → Thấy 4 items ✅
7. **Upload Document**: `POST /admin/documents/upload` → Upload file PDF ✅
8. **Upload Image**: `POST /admin/media/upload` → Upload JPG ✅
9. **Verify**: GET lại để thấy items mới tăng lên ✅

## 🎯 BƯỚC TIẾP THEO

Sau khi test qua Swagger và confirm:
- ✅ Backend APIs hoạt động
- ✅ Upload thành công
- ✅ Data tăng lên

Thì bạn mở frontend admin pages:
1. http://localhost:5173/login → Login
2. http://localhost:5173/admin/docs → Check Console (F12)
3. http://localhost:5173/admin/media → Check Console (F12)

Và báo cho tôi nội dung của Console logs để tôi fix nếu frontend không hiển thị!

---

**TÓM TẮT**: Swagger UI là cách TỐT NHẤT để test và upload ngay bây giờ! 🚀
