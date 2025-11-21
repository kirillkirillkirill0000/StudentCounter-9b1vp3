import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTasks } from '../../hooks/useTasks';
import { useSubjects } from '../../hooks/useSubjects';
import { TaskCard } from '../../components/TaskCard';
import { colors } from '../../constants/theme';
import { Task } from '../../constants/types';

export default function TasksScreen() {
  const { tasks, deleteTask, toggleTaskComplete, clearAllTasks } = useTasks();
  const { subjects } = useSubjects();
  const router = useRouter();

  const handleEdit = (task: Task) => {
    router.push({
      pathname: '/edit-task',
      params: { id: task.id },
    });
  };

  const showAlert = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      Alert.alert(title, message, [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', onPress: onConfirm, style: 'destructive' },
      ]);
    }
  };

  const handleDeleteTask = (id: string, title: string) => {
    showAlert(
      'Удалить задачу?',
      `Вы уверены, что хотите удалить задачу "${title}"?`,
      () => {
        deleteTask(id);
      }
    );
  };

  const handleClearAll = () => {
    if (tasks.length === 0) {
      if (Platform.OS === 'web') {
        alert('Список задач уже пуст');
      } else {
        Alert.alert('Список пуст', 'Нет задач для удаления');
      }
      return;
    }

    showAlert(
      'Очистить все задачи?',
      `Вы уверены, что хотите удалить все ${tasks.length} задач(и)?`,
      () => {
        clearAllTasks();
      }
    );
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои задачи</Text>
        {tasks.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete-sweep" size={24} color={colors.error} />
            <Text style={styles.clearButtonText}>Очистить все</Text>
          </TouchableOpacity>
        )}
      </View>

      {sortedTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="assignment" size={80} color={colors.text.light} />
          <Text style={styles.emptyText}>Нет задач</Text>
          <Text style={styles.emptySubtext}>
            Нажмите + чтобы добавить новую задачу
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const subject = subjects.find((s) => s.id === item.subjectId);
            return (
              <TaskCard
                task={item}
                subject={subject}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onToggleComplete={toggleTaskComplete}
              />
            );
          }}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-task')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.light,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.text.light,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
