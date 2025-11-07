import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { getUserDisplayName } from '@/lib/session';
import { LogIn, User, Settings } from 'lucide-react';

export default function AuthButton() {
  const { isAuthenticated, user } = useAuth();
  const displayName = getUserDisplayName(user);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 rounded-full font-semibold transition-colors text-sm whitespace-nowrap"
      >
        <LogIn className="w-5 h-5" />
        <span>Đăng nhập</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white hidden md:inline">
        Xin chào, <span className="font-semibold">{displayName}</span>
      </span>
      <Link
        to="/admin"
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 rounded-full font-semibold transition-colors text-sm whitespace-nowrap"
      >
        <Settings className="w-5 h-5" />
        <span>Quản trị</span>
      </Link>
    </div>
  );
}
