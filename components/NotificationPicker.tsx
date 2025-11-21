import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NOTIFICATION_OPTIONS } from '../constants/types';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface NotificationPickerProps {
  selected: number[];
  onChange: (values: number[]) => void;
}

export default function NotificationPicker({ selected, onChange }: NotificationPickerProps) {
  const toggleOption = (value: number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value].sort((a, b) => b - a));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Напомнить за:</Text>
      <View style={styles.options}>
        {NOTIFICATION_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => toggleOption(option.value)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
                size={20}
                color={isSelected ? colors.primary : colors.text.light}
              />
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
