import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Sprout } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80)',
      }}
    >
      <div className="flex min-h-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <Sprout className="mx-auto h-12 w-12 text-orange-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
          </div>

          <form className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                required
              />
            )}

            <Button className="w-full">{isLogin ? 'Login' : 'Sign up'}</Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-orange-500 hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}