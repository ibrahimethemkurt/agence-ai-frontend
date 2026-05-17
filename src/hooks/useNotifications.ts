import { createContext } from 'react';

type Notification = {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  is_read: boolean;
};

interface NotificationsContextType {
  notifications: Notification[];
  isConnected: boolean;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  isConnected: false,
});
