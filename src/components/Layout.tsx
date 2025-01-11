import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pb-20 pt-6">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}