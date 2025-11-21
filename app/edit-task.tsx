import React, { useState, useEffect, Platform } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { NotificationPicker } from '../components';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { notificationService } from '../services/notification.service';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask } = useTasks();
  const { subjects } = useSubjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [notificationMinutes, setNotificationMinutes] = useState<number[]>([1440]);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: '', message: '' });

  useEffect(() => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setSelectedSubject(task.subjectId);
      setDeadline(new Date(task.deadline));
      setNotificationMinutes(task.notificationMinutes);
    }
  }, [id, tasks]);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message });
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !selectedSubject) {
      showAlert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    const updates = {
      subjectId: selectedSubject,
      title: title.trim(),
      description: description.trim(),
      deadline: deadline.toISOString(),
      notificationMinutes,
    };

    await updateTask(id!, updates);

    const task = tasks.find((t) => t.id === id);
    const subject = subjects.find((s) => s.id === selectedSubject);
    if (task && subject) {
      await notificationService.cancelTaskNotifications(id!);
      if (!task.completed) {
        await notificationService.scheduleTaskNotifications(
          { ...task, ...updates },
          subject
        );
      }
    }

    router.back();
  };

  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>
            Название задачи <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Например: Лабораторная работа №3"
            placeholderTextColor={colors.text.light}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Предмет <Text style={styles.required}>*</Text>
          </Text>
          {subjects.length === 0 ? (
            <View style={styles.noSubjectsContainer}>
              <Text style={styles.noSubjectsText}>
                Сначала создайте предмет на вкладке "Предметы"
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowSubjectPicker(true)}
            >
              {selectedSubjectObj ? (
                <View style={styles.selectedSubject}>
                  <View
                    style={[
                      styles.subjectColorDot,
                      { backgroundColor: selectedSubjectObj.color },
                    ]}
                  />
                  <Text style={styles.selectButtonText}>
                    {selectedSubjectObj.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.selectButtonPlaceholder}>Выберите предмет</Text>
              )}
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Описание</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Дополнительная информация о задаче"
            placeholderTextColor={colors.text.light}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Дедлайн <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => {
                setTempDate(new Date(deadline));
                setShowDateModal(true);
              }}
            >
              <MaterialIcons name="event" size={24} color={colors.primary} />
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>Дата</Text>
                <Text style={styles.dateTimeValue}>
                  {deadline.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => {
                setTempDate(new Date(deadline));
                setShowTimeModal(true);
              }}
            >
              <MaterialIcons name="access-time" size={24} color={colors.primary} />
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>Время</Text>
                <Text style={styles.dateTimeValue}>
                  {deadline.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <NotificationPicker
          selected={notificationMinutes}
          onChange={setNotificationMinutes}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!title.trim() || !selectedSubject) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!title.trim() || !selectedSubject}
        >
          <Text style={styles.saveButtonText}>Сохранить изменения</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSubjectPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSubjectPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите предмет</Text>
              <TouchableOpacity onPress={() => setShowSubjectPicker(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={styles.subjectOption}
                  onPress={() => {
                    setSelectedSubject(subject.id);
                    setShowSubjectPicker(false);
                  }}
                >
                  <View
                    style={[
                      styles.subjectColorDot,
                      { backgroundColor: subject.color },
                    ]}
                  />
                  <Text style={styles.subjectOptionText}>{subject.name}</Text>
                  {selectedSubject === subject.id && (
                    <MaterialIcons
                      name="check"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showDateModal} transparent animationType="slide">
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Выберите дату</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
                textColor={colors.text.primary}
                locale="ru-RU"
                minimumDate={new Date()}
              />
            </View>
            <View style={styles.pickerActions}>
              <TouchableOpacity
                style={styles.pickerCancelButton}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.pickerCancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerConfirmButton}
                onPress={() => {
                  const newDeadline = new Date(deadline);
                  newDeadline.setFullYear(tempDate.getFullYear());
                  newDeadline.setMonth(tempDate.getMonth());
                  newDeadline.setDate(tempDate.getDate());
                  setDeadline(newDeadline);
                  setShowDateModal(false);
                }}
              >
                <Text style={styles.pickerConfirmText}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showTimeModal} transparent animationType="slide">
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Выберите время</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={tempDate}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
                textColor={colors.text.primary}
                locale="ru-RU"
                is24Hour={true}
              />
            </View>
            <View style={styles.pickerActions}>
              <TouchableOpacity
                style={styles.pickerCancelButton}
                onPress={() => setShowTimeModal(false)}
              >
                <Text style={styles.pickerCancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerConfirmButton}
                onPress={() => {
                  const newDeadline = new Date(deadline);
                  newDeadline.setHours(tempDate.getHours());
                  newDeadline.setMinutes(tempDate.getMinutes());
                  setDeadline(newDeadline);
                  setShowTimeModal(false);
                }}
              >
                <Text style={styles.pickerConfirmText}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{alertConfig.title}</Text>
              <Text style={styles.alertMessage}>{alertConfig.message}</Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() =>
                  setAlertConfig((prev) => ({ ...prev, visible: false }))
                }
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  required: {
    color: colors.danger,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    ...typography.body,
    color: colors.text.primary,
  },
  selectButtonPlaceholder: {
    ...typography.body,
    color: colors.text.light,
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
  },
  dateTimeTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  dateTimeLabel: {
    ...typography.caption,
    color: colors.text.light,
    fontSize: 11,
    marginBottom: 2,
  },
  dateTimeValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '600',
  },
  pickerWrapper: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  pickerActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pickerCancelButton: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  pickerConfirmButton: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.lg,
  },
  pickerCancelText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  pickerConfirmText: {
    ...typography.body,
    color: colors.card,
    fontWeight: '600',
  },
  noSubjectsContainer: {
    backgroundColor: colors.warning + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  noSubjectsText: {
    ...typography.caption,
    color: colors.warning,
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectOptionText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  alertBox: {
    backgroundColor: 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 280,
    alignSelf: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: spacing.lg,
    color: colors.text.secondary,
  },
  alertButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-end',
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
