# Hướng dẫn kiểm tra token

## 1. Mở Developer Console (F12)

## 2. Chạy lệnh kiểm tra token:
```javascript
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
console.log('User:', localStorage.getItem('user'));
```

## 3. Nếu không có token:
- Đăng nhập lại tại http://localhost:5173/login
- Thử với tài khoản admin mặc định (nếu đã seed):
  - Username: admin
  - Password: admin123

## 4. Kiểm tra backend có chạy không:
- Mở http://localhost:8080/api/v1/healthz
- Nếu thấy response thì backend đang chạy

## 5. Nếu vẫn lỗi, logout và login lại:
```javascript
localStorage.clear();
// Sau đó vào /login để đăng nhập lại
```
