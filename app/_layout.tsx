import { Stack } from 'expo-router';
import { SubjectsProvider } from '../contexts/SubjectsContext';
import { TasksProvider } from '../contexts/TasksContext';

export default function RootLayout() {
  return (
    <SubjectsProvider>
      <TasksProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-subject"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Новый предмет',
            }}
          />
          <Stack.Screen
            name="add-task"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Новая задача',
            }}
          />
          <Stack.Screen
            name="edit-task"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Редактировать задачу',
            }}
          />
        </Stack>
      </TasksProvider>
    </SubjectsProvider>
  );
}
