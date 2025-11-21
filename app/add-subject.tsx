import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSubjects } from '../hooks/useSubjects';
import { colors, spacing, typography, borderRadius, subjectColors } from '../constants/theme';

export default function AddSubjectScreen() {
  const { addSubject } = useSubjects();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(subjectColors[0]);
  const [createTaskAfter, setCreateTaskAfter] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    const newSubject = await addSubject(name.trim(), selectedColor);
    
    if (createTaskAfter) {
      router.replace(`/add-task?subjectId=${newSubject.id}`);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Название предмета</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Например: Математика"
            placeholderTextColor={colors.text.light}
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Цвет предмета</Text>
          <View style={styles.colorGrid}>
            {subjectColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setCreateTaskAfter(!createTaskAfter)}
        >
          <View style={styles.checkbox}>
            {createTaskAfter && (
              <View style={styles.checkboxInner} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Создать задачу для этого предмета</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text.primary,
    transform: [{ scale: 1.1 }],
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonDisabled: {
    backgroundColor: colors.text.light,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.card,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
});
