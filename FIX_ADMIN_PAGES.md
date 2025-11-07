# Fix Admin Pages - Authentication & API Integration

## Changes Made

### 1. Created HTTP Client with Auto-Refresh (`frontend/src/api/http.ts`)
- Axios instance with interceptors
- Auto-refresh on 401 (expired token)
- Retry failed requests after refresh
- Queue requests during refresh
- Auto-redirect to login if refresh fails

### 2. Created Admin-Specific Hooks

#### `frontend/src/hooks/admin/useAdminMedia.ts`
- `useAdminMediaList()` - GET /admin/media with auth
- `useUploadMedia()` - POST /admin/media/upload with multipart
- `useDeleteMedia()` - DELETE /admin/media/:id
- `useUpdateMedia()` - PUT /admin/media/:id
- Proper TypeScript types
- Query invalidation on mutations

#### `frontend/src/hooks/admin/useAdminDocuments.ts`
- `useAdminDocsList()` - GET /admin/documents with auth
- `useUploadDocument()` - POST /admin/documents/upload with multipart
- `useDeleteDocument()` - DELETE /admin/documents/:id
- `useUpdateDocument()` - PUT /admin/documents/:id
- Proper TypeScript types
- Query invalidation on mutations

### 3. Updated Admin Pages

#### `frontend/src/pages/admin/media/List.tsx`
- Changed from `useMediaItems` to `useAdminMediaList`
- Uses new http client (axios with interceptors)
- Proper error handling with UI feedback:
  - 401: "Phiên đăng nhập đã hết hạn"
  - 403: "Bạn không có quyền truy cập"
  - Other: Generic error message
- "Thử lại" and "Đăng nhập lại" buttons
- Upload with proper parameters (file, title, category_id, media_type)
- Better error messages from backend

#### `frontend/src/pages/admin/docs/List.tsx`
- Changed from `useAdminDocuments` to `useAdminDocsList`
- Uses new http client (axios with interceptors)
- Same error handling UI as media page
- Upload with proper parameters (file, title, category_id)
- Better error messages from backend

### 4. Fixed Backend CORS (`backend/cmd/server/main.go`)
- Added methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Added headers: X-Requested-With
- Added ExposeHeaders: Content-Length, Content-Type
- Changed AllowCredentials to false (correct for Bearer token auth)

## How It Works

### Authentication Flow
1. User logs in → gets access_token (15min) and refresh_token (7 days)
2. Tokens saved in localStorage
3. All admin API requests include: `Authorization: Bearer <access_token>`

### Auto-Refresh Flow
1. Admin API returns 401 (token expired)
2. http interceptor catches 401
3. Calls POST /api/v1/auth/refresh with refresh_token
4. Gets new access_token
5. Retries original request with new token
6. If refresh fails → redirect to /login

### Upload Flow
1. User selects file
2. Validates file type and size
3. Creates FormData with: file, title, category_id, media_type (for media)
4. POSTs to /admin/media/upload or /admin/documents/upload
5. Axios automatically adds Authorization header
6. On success: invalidates query cache → list auto-refreshes
7. On error: shows specific error message

## Testing

### Prerequisites
- Backend running on http://localhost:8080
- Frontend running on http://localhost:5173

### Test Steps
1. Login at http://localhost:5173/login
2. Go to /admin/media → should see images/videos
3. Go to /admin/docs → should see documents
4. Try upload → should succeed
5. Wait 15 minutes (or manually expire token)
6. Refresh page or navigate → should auto-refresh token
7. Try API call → should work without re-login

### Debug in Browser Console
```javascript
// Check tokens
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')

// Decode token to check exp
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));

// Watch console for "Admin Documents Debug:" or "Admin Media Debug:"
```

## Files Changed
- `frontend/src/api/http.ts` (NEW)
- `frontend/src/hooks/admin/useAdminMedia.ts` (NEW)
- `frontend/src/hooks/admin/useAdminDocuments.ts` (NEW)
- `frontend/src/pages/admin/media/List.tsx` (MODIFIED)
- `frontend/src/pages/admin/docs/List.tsx` (MODIFIED)
- `backend/cmd/server/main.go` (MODIFIED - CORS)

## Next Steps
1. Restart backend to apply CORS changes
2. Restart frontend to load new code
3. Clear browser localStorage (or login again)
4. Test admin pages and upload functionality
