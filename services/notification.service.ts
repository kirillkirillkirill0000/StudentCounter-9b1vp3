import * as Notifications from 'expo-notifications';
import { Task, Subject } from '../constants/types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  async scheduleTaskNotifications(
    task: Task,
    subject: Subject
  ): Promise<string[]> {
    try {
      const notificationIds: string[] = [];
      const deadline = new Date(task.deadline);
      const now = new Date();

      console.log('=== Планирование уведомлений ===');
      console.log('Задача:', task.title);
      console.log('Дедлайн:', deadline.toLocaleString('ru-RU'));
      console.log('Текущее время:', now.toLocaleString('ru-RU'));
      console.log('Выбранные интервалы (минуты):', task.notificationMinutes);

      for (const minutes of task.notificationMinutes) {
        // Вычисляем точное время уведомления: дедлайн минус указанные минуты
        const notificationTime = new Date(deadline.getTime() - minutes * 60 * 1000);

        console.log(`\n--- Обработка уведомления за ${minutes} минут ---`);
        console.log('  Время уведомления:', notificationTime.toLocaleString('ru-RU'));
        console.log('  Это в будущем?', notificationTime > now);
        console.log('  Разница от текущего времени (мс):', notificationTime.getTime() - now.getTime());

        // Планируем только если время уведомления в будущем
        if (notificationTime > now) {
          try {
            // ВАЖНО: используем абсолютное время в формате { date: Date }
            const trigger = { date: notificationTime };

            console.log('  Trigger:', notificationTime.toLocaleString('ru-RU'));

            const id = await Notifications.scheduleNotificationAsync({
              content: {
                title: `Напоминание: ${subject.name}`,
                body:
                  minutes === 0
                    ? `Дедлайн сейчас: ${task.title}`
                    : minutes < 60
                    ? `${task.title} - через ${minutes} минут`
                    : minutes < 1440
                    ? `${task.title} - через ${Math.floor(minutes / 60)} часов`
                    : `${task.title} - через ${Math.floor(minutes / 1440)} дней`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                  taskId: task.id,
                  subjectId: subject.id,
                },
              },
              trigger,
            });

            notificationIds.push(id);
            console.log('  ✓ Уведомление запланировано, ID:', id);
          } catch (error) {
            console.error('  ✗ Ошибка планирования уведомления:', error);
          }
        } else {
          console.log('  ⊘ Пропущено (время в прошлом)');
        }
      }

      console.log(`\n=== Итого запланировано: ${notificationIds.length} уведомлений ===\n`);

      // Проверяем что действительно запланировано
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Всего запланированных уведомлений в системе:', scheduled.length);
      scheduled.forEach((notif) => {
        console.log('  -', notif.content.title, '|', notif.trigger);
      });

      return notificationIds;
    } catch (error) {
      console.error('Ошибка при планировании уведомлений:', error);
      return [];
    }
  },

  async cancelTaskNotifications(taskId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const taskNotifications = scheduledNotifications.filter(
        (notif) => notif.content.data?.taskId === taskId
      );

      console.log(`Отмена ${taskNotifications.length} уведомлений для задачи ${taskId}`);

      for (const notification of taskNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Ошибка отмены уведомлений:', error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Все уведомления отменены');
    } catch (error) {
      console.error('Ошибка отмены всех уведомлений:', error);
    }
  },
};
