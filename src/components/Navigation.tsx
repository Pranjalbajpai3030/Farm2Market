import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, MessageSquare, User } from 'lucide-react';
import { clsx } from 'clsx';

const links = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/new-listing', icon: PlusSquare, label: 'Add Listing' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="container mx-auto flex items-center justify-around px-4 py-3">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex flex-col items-center space-y-1',
              'transition-colors duration-300',
              location.pathname === to
                ? 'text-orange-500'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}