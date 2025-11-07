# Test Admin Pages

## 1. Login first
1. Go to http://localhost:5173/login
2. Login with:
   - Email: admin@portal365.com
   - Password: admin123

## 2. Check localStorage
Open browser console (F12) and run:
```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));
```

## 3. Test Documents Page
Go to: http://localhost:5173/admin/docs
- Should show 6 documents
- Check console for debug logs
- Try upload a PDF file

## 4. Test Media Page  
Go to: http://localhost:5173/admin/media
- Should show 6 images (default tab)
- Switch to Videos tab - should show 4 videos
- Check console for debug logs
- Try upload an image

## 5. Manual API Test
Run in browser console:
```javascript
// Get token
const token = localStorage.getItem('accessToken');

// Test documents
fetch('http://localhost:8080/api/v1/admin/documents', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// Test media
fetch('http://localhost:8080/api/v1/admin/media?media_type=image', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

## Expected Results
- Documents: 6 items
- Images: 6 items
- Videos: 4 items

## If no data shows:
1. Check console.log output
2. Check Network tab for API calls
3. Verify token exists in localStorage
4. Check API response in Network tab
