# ⚡ TEST VỚI SWAGGER - NHANH NHẤT

Swagger UI: **http://localhost:8080/swagger/index.html** (đã mở trong VS Code)

## 🚀 3 BƯỚC NHANH

### 1. LOGIN (30s)
- `POST /api/v1/auth/login` → Try it out → Execute
- Email: admin@portal365.com
- Password: admin123
- **COPY** `access_token`

### 2. AUTHORIZE (10s)
- Click 🔒 **Authorize**
- Điền: `Bearer <token_vừa_copy>`
- Authorize → Close

### 3. TEST (1 phút)
✅ `GET /admin/documents` → 6 items  
✅ `GET /admin/media?media_type=image` → 6 items  
✅ `GET /admin/media?media_type=video` → 4 items  
✅ `POST /admin/documents/upload` → Upload file  
✅ `POST /admin/media/upload` → Upload image

## SAU ĐÓ
Check frontend console logs và báo lại cho tôi!

Chi tiết: `USE_SWAGGER.md`
