export interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  deadline: string;
  notificationMinutes: number[]; // minutes before deadline: 20160 (14d), 10080 (7d), 7200 (5d), 4320 (3d), 1440 (1d), 720 (12h), 360 (6h), 180 (3h), 60 (1h), 30 (30min), 0 (at deadline)
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationOption {
  label: string;
  value: number; // minutes before deadline
}

export const NOTIFICATION_OPTIONS: NotificationOption[] = [
  { label: '14 дней', value: 20160 },
  { label: '7 дней', value: 10080 },
  { label: '5 дней', value: 7200 },
  { label: '3 дня', value: 4320 },
  { label: '1 день', value: 1440 },
  { label: '12 часов', value: 720 },
  { label: '6 часов', value: 360 },
  { label: '3 часа', value: 180 },
  { label: '1 час', value: 60 },
  { label: '30 минут', value: 30 },
  { label: 'В момент дедлайна', value: 0 },
];
