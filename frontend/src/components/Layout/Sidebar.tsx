import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  User, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: DollarSign,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 min-h-screen lg:min-h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800 flex-shrink-0">
        <h1 className="text-lg sm:text-xl font-bold text-white truncate">Simple Dashboard</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center px-4 py-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-gray-300 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors touch-manipulation ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="group flex w-full items-center px-3 py-3 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors touch-manipulation"
        >
          <LogOut
            className="mr-3 h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="truncate">Sign out</span>
        </button>
      </div>
    </div>
  );
} 