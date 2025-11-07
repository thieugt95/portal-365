import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { getUserDisplayName } from '@/lib/session';

interface AdminTopBarProps {
  title?: string;
}

export default function AdminTopBar({
  title = 'Portal 365 CMS',
}: AdminTopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = getUserDisplayName(user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* Right: Home Button + User Info + Logout */}
      <div className="flex items-center gap-4">
        {/* Home Button */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang chủ</span>
        </Link>

        {/* User Welcome */}
        <span className="text-sm text-gray-600 hidden md:inline">
          Welcome, <span className="font-semibold text-gray-800">{displayName}</span>
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
