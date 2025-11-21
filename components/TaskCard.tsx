import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Task, Subject } from '../constants/types';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface TaskCardProps {
  task: Task;
  subject?: Subject;
  onPress?: () => void;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({
  task,
  subject,
  onPress,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const deadline = new Date(task.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0 && !task.completed;
  const isUrgent = daysLeft <= 1 && daysLeft >= 0 && !task.completed;

  const getDeadlineText = () => {
    if (task.completed) return 'Выполнено';
    if (isOverdue) return `Просрочено на ${Math.abs(daysLeft)} дн.`;
    if (daysLeft === 0) return 'Сегодня';
    if (daysLeft === 1) return 'Завтра';
    return `Через ${daysLeft} дн.`;
  };

  const getDeadlineColor = () => {
    if (task.completed) return colors.success;
    if (isOverdue) return colors.danger;
    if (isUrgent) return colors.warning;
    return colors.text.secondary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        task.completed && styles.completedCard,
        { borderLeftColor: subject?.color || colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggleComplete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons
          name={task.completed ? 'check-circle' : 'radio-button-unchecked'}
          size={24}
          color={task.completed ? colors.success : colors.text.light}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          {subject && (
            <View style={[styles.subjectTag, { backgroundColor: subject.color + '20' }]}>
              <Text style={[styles.subjectName, { color: subject.color }]}>
                {subject.name}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.title, task.completed && styles.completedText]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        )}
        <View style={styles.footer}>
          <MaterialIcons name="schedule" size={16} color={getDeadlineColor()} />
          <Text style={[styles.deadline, { color: getDeadlineColor() }]}>
            {getDeadlineText()}
          </Text>
          {task.notificationMinutes.length > 0 && !task.completed && (
            <>
              <MaterialIcons
                name="notifications-active"
                size={16}
                color={colors.text.light}
                style={styles.notificationIcon}
              />
              <Text style={styles.notificationCount}>
                {task.notificationMinutes.length}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <MaterialIcons name="delete-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  subjectTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  subjectName: {
    ...typography.small,
    fontWeight: '600',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.light,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    ...typography.caption,
    marginLeft: 4,
    fontWeight: '500',
  },
  notificationIcon: {
    marginLeft: spacing.md,
  },
  notificationCount: {
    ...typography.small,
    color: colors.text.light,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
});
