import { Bell, MessageSquare, DollarSign, Info } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'message',
    title: 'New message from Sarah Johnson',
    description: 'Are the tomatoes still available?',
    timestamp: '2024-03-10T14:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'offer',
    title: 'New offer received',
    description: 'John Smith made an offer of $2.50/lb for your tomatoes',
    timestamp: '2024-03-10T13:15:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to FarmConnect!',
    description: 'Complete your profile to start selling your products.',
    timestamp: '2024-03-09T10:00:00Z',
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="h-5 w-5" />;
    case 'offer':
      return <DollarSign className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const getIconBackground = (type: string) => {
  switch (type) {
    case 'message':
      return 'bg-blue-100 text-blue-600';
    case 'offer':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export function Notifications() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with your marketplace activity</p>
        </div>
        <button className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <div className="rounded-lg bg-white shadow-md">
        <div className="divide-y">
          {NOTIFICATIONS.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-4 p-4 transition-colors hover:bg-gray-50 ${
                !notification.read ? 'bg-orange-50' : ''
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getIconBackground(
                  notification.type
                )}`}
              >
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {notification.description}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {!notification.read && (
                  <div className="mt-2">
                    <button className="text-sm font-medium text-orange-500 hover:underline">
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}