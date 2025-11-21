import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Subject } from '../constants/types';
import { colors } from '../constants/theme';

interface SubjectCardProps {
  subject: Subject;
  taskCount: number;
  onDelete: (id: string, name: string) => void;
}

export function SubjectCard({ subject, taskCount, onDelete }: SubjectCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.colorBadge, { backgroundColor: subject.color }]} />
        <View style={styles.info}>
          <Text style={styles.name}>{subject.name}</Text>
          {subject.teacher && (
            <Text style={styles.teacher}>{subject.teacher}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(subject.id, subject.name)}
        >
          <MaterialIcons name="delete" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.taskCount}>
          <MaterialIcons
            name="assignment"
            size={16}
            color={colors.text.light}
          />
          <Text style={styles.taskCountText}>
            {taskCount} {taskCount === 1 ? 'задача' : 'задач'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorBadge: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  teacher: {
    fontSize: 14,
    color: colors.text.light,
  },
  deleteButton: {
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCountText: {
    fontSize: 14,
    color: colors.text.light,
    marginLeft: 4,
  },
});
