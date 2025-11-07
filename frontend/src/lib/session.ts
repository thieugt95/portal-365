export type StoredUser = {
  id?: number | string;
  username?: string;
  name?: string;
  full_name?: string;
  display_name?: string;
  email?: string;
  roles?: string[];
};

/**
 * Kiểm tra xem có phiên đăng nhập không
 */
export function hasSession(): boolean {
  return !!localStorage.getItem('access_token');
}

/**
 * Lấy thông tin user từ localStorage
 */
export function getStoredUser(): StoredUser | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as StoredUser;
  } catch {
    return null;
  }
}

/**
 * Lấy tên hiển thị của user theo thứ tự ưu tiên
 */
export function getUserDisplayName(user?: StoredUser | null): string {
  if (!user) {
    user = getStoredUser();
  }
  if (!user) return 'Guest';
  
  return (
    user.display_name ||
    user.full_name ||
    user.name ||
    user.username ||
    'User'
  );
}

/**
 * Lưu thông tin user vào localStorage
 */
export function storeUser(user: StoredUser): void {
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Lưu access token
 */
export function storeAccessToken(token: string): void {
  localStorage.setItem('access_token', token);
}

/**
 * Lưu refresh token
 */
export function storeRefreshToken(token: string): void {
  localStorage.setItem('refresh_token', token);
}

/**
 * Lấy access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Lấy refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

/**
 * Xóa toàn bộ phiên đăng nhập
 */
export function clearSession(): void {
  console.log('[Session] Clearing session - Stack trace:');
  console.trace();
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}
