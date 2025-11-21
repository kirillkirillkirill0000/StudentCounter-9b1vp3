
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
import { useSubjects } from '../../hooks/useSubjects';
import { useTasks } from '../../hooks/useTasks';
import { SubjectCard } from '../../components/SubjectCard';
import { colors } from '../../constants/theme';

export default function SubjectsScreen() {
  const { subjects, deleteSubject } = useSubjects();
  const { tasks, deleteTasksBySubjectId } = useTasks();
  const router = useRouter();

  const getTaskCount = (subjectId: string) => {
    return tasks.filter(
      (task) => task.subjectId === subjectId && !task.completed
    ).length;
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

  const handleDeleteSubject = (id: string, name: string) => {
    const taskCount = getTaskCount(id);
    const message =
      taskCount > 0
        ? `Вы уверены, что хотите удалить предмет "${name}"? Будут удалены ${taskCount} связанных задач(и).`
        : `Вы уверены, что хотите удалить предмет "${name}"?`;

    showAlert('Удалить предмет?', message, async () => {
      // First delete all related tasks (updates TasksContext state)
      await deleteTasksBySubjectId(id);
      // Then delete the subject
      await deleteSubject(id);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои предметы</Text>
      </View>

      {subjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="book" size={80} color={colors.text.light} />
          <Text style={styles.emptyText}>Нет предметов</Text>
          <Text style={styles.emptySubtext}>
            Нажмите + чтобы добавить новый предмет
          </Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubjectCard
              subject={item}
              taskCount={getTaskCount(item.id)}
              onDelete={handleDeleteSubject}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-subject')}
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
