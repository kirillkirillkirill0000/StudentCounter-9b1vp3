# StudentCounter

Мобильное приложение для управления учебными задачами и дедлайнами студентов.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)
![Expo](https://img.shields.io/badge/Expo-51-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📱 О приложении

**StudentCounter** - это простое и удобное приложение для студентов, помогающее эффективно управлять учебными задачами, отслеживать дедлайны и получать своевременные напоминания.

### Основные возможности

- ✅ **Управление предметами** - создавайте предметы с уникальными цветами для визуальной идентификации
- 📝 **Управление задачами** - добавляйте задачи с названием, описанием и дедлайном
- ⏰ **Гибкие уведомления** - настраивайте множественные напоминания от 14 дней до 30 минут до дедлайна
- 🔔 **Push-уведомления** - получайте уведомления со звуком, даже когда приложение закрыто
- 💾 **Локальное хранение** - все данные хранятся на устройстве, работа без интернета
- 🎨 **Современный дизайн** - минималистичный и интуитивно понятный интерфейс

---

## 🚀 Быстрый старт

### Требования

- Node.js 18.0 или выше
- npm или yarn
- Expo CLI
- iOS Simulator (для разработки под iOS) или Android Emulator (для Android)

### Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd StudentCounter

# Установить зависимости
npm install

# Запустить приложение
npm start
```

### Запуск на устройствах

```bash
# iOS
npm run ios

# Android
npm run android

# Web (экспериментально)
npm run web
```

---

## 🏗️ Структура проекта

```
StudentCounter/
├── app/                      # Expo Router pages (UI)
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Главный экран - список задач
│   │   └── subjects.tsx     # Экран списка предметов
│   ├── add-task.tsx         # Модальное окно создания задачи
│   ├── edit-task.tsx        # Модальное окно редактирования задачи
│   └── add-subject.tsx      # Модальное окно создания предмета
│
├── components/              # UI компоненты
│   ├── TaskCard.tsx         # Карточка задачи
│   ├── SubjectCard.tsx      # Карточка предмета
│   └── NotificationPicker.tsx # Выбор времени уведомлений
│
├── contexts/                # React Context (глобальное состояние)
│   ├── SubjectsContext.tsx  # Управление предметами
│   └── TasksContext.tsx     # Управление задачами
│
├── hooks/                   # Custom hooks
│   ├── useSubjects.tsx      # Хук для работы с предметами
│   └── useTasks.tsx         # Хук для работы с задачами
│
├── services/                # Бизнес-логика и API
│   ├── storage.service.ts   # Работа с AsyncStorage
│   └── notification.service.ts # Работа с уведомлениями
│
├── constants/               # Константы и типы
│   ├── types.ts            # TypeScript типы
│   └── theme.ts            # Цвета и стили
│
└── docs/                    # Документация
    ├── SRS.md              # Спецификация требований
    ├── TestPlan.md         # План тестирования
    ├── TestResults.md      # Результаты тестирования
    └── UML/                # UML диаграммы
        ├── UseCaseDiagram.md
        ├── ActivityDiagrams.md
        ├── SequenceDiagrams.md
        ├── StateDiagrams.md
        ├── ClassDiagram.md
        └── ComponentDeployment.md
```

---

## 🎯 Архитектура

Приложение следует трехслойной архитектуре:

### 1. Presentation Layer (UI)
- **app/** - Страницы приложения (Expo Router)
- **components/** - Переиспользуемые UI компоненты

### 2. Business Logic Layer
- **contexts/** - Глобальное состояние (Context API)
- **hooks/** - Бизнес-логика и взаимодействие с Context

### 3. Data Layer
- **services/** - Работа с данными и внешними API
  - `storage.service.ts` - AsyncStorage операции
  - `notification.service.ts` - Expo Notifications API

### Поток данных

```
UI Component → Custom Hook → Context → Service → AsyncStorage/API
     ↓                                      ↓
  render ← state update ← Context update ← Service response
```

---

## 📋 Основные функции

### Управление предметами

```typescript
// Создание предмета
const { addSubject } = useSubjects();
await addSubject({
  name: 'Математика',
  color: '#2196F3'
});

// Удаление предмета (и всех его задач)
await deleteSubject(subjectId);
```

### Управление задачами

```typescript
// Создание задачи
const { addTask } = useTasks();
await addTask({
  title: 'Лабораторная работа №1',
  description: 'Решить задачи 1-10',
  subjectId: 'subject-id',
  deadline: new Date('2025-11-15T23:59'),
  notifications: [1440, 60, 30], // 1 день, 1 час, 30 минут
  completed: false
}, subject);

// Редактирование задачи
await updateTask(taskId, {
  title: 'Новое название',
  deadline: newDate
}, subject);

// Отметить выполненной
await toggleTaskComplete(taskId);
```

### Уведомления

Доступные интервалы уведомлений:
- 14 дней, 7 дней, 5 дней, 3 дня, 1 день
- 12 часов, 6 часов, 3 часа, 1 час
- 30 минут
- В момент дедлайна

```typescript
// Уведомления планируются автоматически при создании/редактировании задачи
// Отправляются даже когда приложение закрыто
```

---

## 🛠️ Технологический стек

### Основные технологии
- **React Native** 0.74+ - Кроссплатформенная разработка
- **Expo** SDK 51+ - Фреймворк и инструменты
- **TypeScript** 5.3+ - Типобезопасность
- **Expo Router** - Файловая маршрутизация

### Ключевые библиотеки
- `@react-native-async-storage/async-storage` - Локальное хранилище
- `expo-notifications` - Push-уведомления
- `expo-router` - Навигация
- `react-native-safe-area-context` - Safe area handling
- `@expo/vector-icons` - Иконки

### Инструменты разработки
- ESLint - Линтер
- TypeScript - Статическая типизация
- Expo DevTools - Отладка

---

## 📚 Документация

### Техническая документация

Полная документация проекта находится в папке `docs/`:

1. **[SRS.md](docs/SRS.md)** - Software Requirements Specification
   - Функциональные и нефункциональные требования
   - Описание архитектуры
   - Модель данных

2. **[Test Plan](docs/TestPlan.md)** - План тестирования
   - Стратегия тестирования
   - Тест-кейсы
   - Критерии приемки

3. **[Test Results](docs/TestResults.md)** - Результаты тестирования
   - Шаблон для заполнения результатов
   - Обнаруженные дефекты
   - Метрики качества

### UML диаграммы

Все UML диаграммы в формате Mermaid находятся в `docs/UML/`:

- **[Use Case Diagram](docs/UML/UseCaseDiagram.md)** - Диаграмма вариантов использования
- **[Activity Diagrams](docs/UML/ActivityDiagrams.md)** - Диаграммы активностей
- **[Sequence Diagrams](docs/UML/SequenceDiagrams.md)** - Диаграммы последовательности
- **[State Diagrams](docs/UML/StateDiagrams.md)** - Диаграммы состояний
- **[Class Diagram](docs/UML/ClassDiagram.md)** - Диаграмма классов
- **[Component & Deployment](docs/UML/ComponentDeployment.md)** - Компоненты и развертывание

---

## 🧪 Тестирование

### Запуск тестов

```bash
# Unit тесты
npm test

# Тесты с покрытием
npm run test:coverage

# E2E тесты (если настроено)
npm run test:e2e
```

### Ручное тестирование

См. подробный [Test Plan](docs/TestPlan.md) с описанием всех тест-кейсов.

### Метрики качества

- **Test Coverage:** Цель ≥80%
- **Pass Rate:** Цель ≥95%
- **Zero Critical Bugs:** Перед релизом

---

## 📦 Сборка и развертывание

### Локальная сборка

```bash
# Собрать для Android
eas build --platform android --profile preview

# Собрать для iOS
eas build --platform ios --profile preview

# Собрать для обоих платформ
eas build --platform all
```

### Публикация

```bash
# Отправить в App Store
eas submit --platform ios

# Отправить в Google Play
eas submit --platform android
```

---

## 🔧 Конфигурация

### app.json

Основные настройки приложения находятся в `app.json`:

```json
{
  "expo": {
    "name": "StudentCounter",
    "slug": "studentcounter",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

### Переменные окружения

Создайте `.env` файл для локальных настроек (не коммитится):

```
EXPO_PUBLIC_API_URL=...
```

---

## 🤝 Вклад в проект

### Процесс разработки

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

### Стандарты кода

- Следуйте ESLint правилам
- Пишите TypeScript типы для всех функций
- Добавляйте комментарии для сложной логики
- Обновляйте документацию при изменении API

---

## 📄 Лицензия

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Авторы

- **Команда разработки StudentCounter**

---

## 📞 Контакты

- **Email:** support@studentcounter.app
- **GitHub Issues:** [Открыть issue](https://github.com/your-repo/StudentCounter/issues)

---

## 🙏 Благодарности

- [Expo](https://expo.dev/) - За отличный фреймворк
- [React Native](https://reactnative.dev/) - За кроссплатформенные возможности
- Все контрибьюторы и пользователи приложения

---

## 🗺️ Roadmap

### Версия 1.0 (Текущая)
- ✅ Базовое управление предметами и задачами
- ✅ Локальное хранение данных
- ✅ Push-уведомления
- ✅ iOS и Android поддержка

### Версия 1.1 (Планируется)
- 🔄 Синхронизация между устройствами
- 🔄 Облачное резервное копирование
- 🔄 Виджеты для главного экрана
- 🔄 Темная тема

### Версия 2.0 (Будущее)
- 📅 Календарный вид задач
- 📊 Статистика и аналитика
- 👥 Совместная работа над задачами
- 🌐 Веб-версия

---

**Made with ❤️ for students**
