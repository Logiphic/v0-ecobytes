import { Bell } from 'lucide-react';
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
    alert: 'border-l-4 border-l-[#D9534F]',
    info: 'border-l-4 border-l-[#5B9BD5]',
    warning: 'border-l-4 border-l-[#EFB85C]',
    success: 'border-l-4 border-l-[#74B76A]',
  };

  const typeTextStyles = {
    alert: 'text-[#D9534F]',
    info: 'text-[#5B9BD5]',
    warning: 'text-[#EFB85C]',
    success: 'text-[#74B76A]',
  };

  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
      <CardHeader className="bg-white py-3 border-b border-gray-200">
        <CardTitle className="flex items-center justify-center gap-2 text-base font-bold text-black">
          Notifications
          <Bell className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`rounded-md bg-white p-2.5 ${typeStyles[notification.type]}`}
          >
            <h4 className={`text-sm font-bold ${typeTextStyles[notification.type]}`}>
              {notification.title}
            </h4>
            <p className="text-xs text-[#2F3A2F]">{notification.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
