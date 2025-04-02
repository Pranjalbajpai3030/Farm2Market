import React from 'react';

interface CustomerAvatarProps {
  name: string;
  className?: string;
}

export default function CustomerAvatar({ name, className = '' }: CustomerAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium ${className}`}>
      {initials}
    </div>
  );
}