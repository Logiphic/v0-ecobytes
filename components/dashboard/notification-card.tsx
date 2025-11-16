import { AlertCircle, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
}

interface NotificationCardProps {
  notifications: Notification[];
}

export function NotificationCard({ notifications }: NotificationCardProps) {
  const typeStyles = {
    alert: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
    warning: 'border-l-4 border-l-amber-500',
    success: 'border-l-4 border-l-green-500',
  };

  const typeTextStyles = {
    alert: 'text-red-700',
    info: 'text-blue-700',
    warning: 'text-amber-700',
    success: 'text-green-700',
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="bg-primary pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-black">
          Notifications
          <Bell className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`rounded-lg bg-white p-3 shadow-sm ${typeStyles[notification.type]}`}
          >
            <h4 className={`text-sm font-semibold ${typeTextStyles[notification.type]}`}>
              {notification.title}
            </h4>
            <p className="text-xs text-gray-700">{notification.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
