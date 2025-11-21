# State Диаграммы
## StudentCounter - Диаграммы состояний

---

## 1. Состояния задачи (Task State)

```mermaid
stateDiagram-v2
    [*] --> Creating: Пользователь создает задачу
    
    Creating --> Validating: Нажать "Сохранить"
    Validating --> Creating: Ошибка валидации
    Validating --> Active: Валидация успешна
    
    Active --> Editing: Нажать "Редактировать"
    Active --> Completed: Отметить выполненной
    Active --> Overdue: Дедлайн прошел
    Active --> Deleted: Удалить задачу
    
    Editing --> Validating: Сохранить изменения
    Editing --> Active: Отменить редактирование
    
    Completed --> Active: Снять отметку
    Completed --> Deleted: Удалить задачу
    
    Overdue --> Completed: Отметить выполненной
    Overdue --> Editing: Редактировать
    Overdue --> Deleted: Удалить задачу
    
    Deleted --> [*]
    
    note right of Active
        completed: false
        deadline >= now
        Уведомления активны
    end note
    
    note right of Completed
        completed: true
        Уведомления отменены (опционально)
    end note
    
    note right of Overdue
        completed: false
        deadline < now
        Визуально выделено красным
    end note
```

---

## 2. Состояния формы создания задачи (Add Task Form State)

```mermaid
stateDiagram-v2
    [*] --> Empty: Форма открыта
    
    Empty --> FillingTitle: Ввод названия
    FillingTitle --> SelectingSubject: Название введено
    
    SelectingSubject --> CreatingSubject: Создать новый предмет
    SelectingSubject --> SubjectSelected: Выбран существующий
    
    CreatingSubject --> SubjectCreating: Форма создания предмета
    SubjectCreating --> SubjectSelected: Предмет создан
    SubjectCreating --> SelectingSubject: Отмена создания
    
    SubjectSelected --> SelectingDate: Предмет выбран
    SelectingDate --> SelectingTime: Дата выбрана
    SelectingTime --> FillingDescription: Время выбрано
    
    FillingDescription --> SelectingNotifications: Описание введено (опционально)
    SelectingTime --> SelectingNotifications: Пропустить описание
    
    SelectingNotifications --> ReadyToSubmit: Уведомления выбраны
    ReadyToSubmit --> Validating: Нажать "Сохранить"
    
    Validating --> ValidationError: Данные невалидны
    ValidationError --> FillingTitle: Ошибка в названии
    ValidationError --> SelectingSubject: Предмет не выбран
    ValidationError --> SelectingDate: Дедлайн в прошлом
    
    Validating --> Submitting: Данные валидны
    Submitting --> Saving: Сохранение в хранилище
    Saving --> SchedulingNotifications: Планирование уведомлений
    SchedulingNotifications --> Success: Уведомления запланированы
    
    Success --> [*]: Форма закрыта
    
    Empty --> [*]: Отмена
    FillingTitle --> [*]: Отмена
    SelectingSubject --> [*]: Отмена
    SelectingDate --> [*]: Отмена
    SelectingTime --> [*]: Отмена
    FillingDescription --> [*]: Отмена
    SelectingNotifications --> [*]: Отмена
```

---

## 3. Состояния уведомления (Notification State)

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Задача создана/обновлена
    
    Scheduled --> Pending: Ожидание времени
    
    Pending --> Triggered: Время наступило
    Pending --> Cancelled: Задача удалена
    Pending --> Cancelled: Задача отредактирована
    Pending --> Cancelled: Предмет удален
    
    Triggered --> CheckingTask: Проверка задачи
    
    CheckingTask --> Skipped: Задача выполнена
    CheckingTask --> Delivering: Задача не выполнена
    
    Delivering --> Delivered: Уведомление отправлено
    
    Delivered --> UserInteracted: Пользователь нажал
    Delivered --> Dismissed: Пользователь проигнорировал
    
    UserInteracted --> OpeningApp: Открытие приложения
    OpeningApp --> [*]
    
    Dismissed --> [*]
    Skipped --> [*]
    Cancelled --> [*]
    
    note right of Scheduled
        Вычислено время отправки
        Сохранен ID уведомления
    end note
    
    note right of Delivered
        Отображено в системе
        Воспроизведен звук
        Вибрация (Android)
    end note
```

---

## 4. Состояния приложения (Application State)

```mermaid
stateDiagram-v2
    [*] --> Initializing: Запуск приложения
    
    Initializing --> LoadingData: Загрузка провайдеров
    LoadingData --> RequestingPermissions: Данные загружены
    
    RequestingPermissions --> PermissionGranted: Уведомления разрешены
    RequestingPermissions --> PermissionDenied: Уведомления запрещены
    
    PermissionGranted --> Ready: Инициализация завершена
    PermissionDenied --> ReadyLimited: Ограниченная функциональность
    
    Ready --> ViewingTasks: Просмотр задач
    Ready --> ViewingSubjects: Просмотр предметов
    
    ViewingTasks --> CreatingTask: Создание задачи
    ViewingTasks --> EditingTask: Редактирование задачи
    ViewingTasks --> Ready: Навигация
    
    ViewingSubjects --> CreatingSubject: Создание предмета
    ViewingSubjects --> Ready: Навигация
    
    CreatingTask --> ViewingTasks: Задача создана
    CreatingTask --> ViewingTasks: Отмена
    
    EditingTask --> ViewingTasks: Изменения сохранены
    EditingTask --> ViewingTasks: Отмена
    
    CreatingSubject --> ViewingSubjects: Предмет создан
    CreatingSubject --> CreatingTask: Создать задачу для предмета
    CreatingSubject --> ViewingSubjects: Отмена
    
    Ready --> Background: Приложение свернуто
    ViewingTasks --> Background: Приложение свернуто
    ViewingSubjects --> Background: Приложение свернуто
    
    Background --> Ready: Приложение открыто
    Background --> ViewingTasks: Открыто из уведомления
    
    ReadyLimited --> ViewingTasks: Просмотр (без уведомлений)
    ReadyLimited --> ViewingSubjects: Просмотр (без уведомлений)
    
    note right of Ready
        Данные загружены
        Уведомления работают
        Все функции доступны
    end note
    
    note right of ReadyLimited
        Данные загружены
        Уведомления НЕ работают
        Предупреждение отображено
    end note
    
    note right of Background
        Приложение неактивно
        Уведомления продолжают работать
        Данные сохранены
    end note
```

---

## 5. Состояния предмета (Subject State)

```mermaid
stateDiagram-v2
    [*] --> Creating: Создание предмета
    
    Creating --> Validating: Нажать "Сохранить"
    Validating --> Creating: Ошибка валидации
    Validating --> ActiveEmpty: Валидация успешна (без задач)
    
    ActiveEmpty --> ActiveWithTasks: Задача добавлена
    ActiveEmpty --> Deleting: Удалить предмет
    
    ActiveWithTasks --> Deleting: Удалить предмет
    ActiveWithTasks --> ActiveEmpty: Все задачи удалены
    
    Deleting --> ConfirmingDeletion: Показать подтверждение
    ConfirmingDeletion --> Deleting: Подтверждено
    ConfirmingDeletion --> ActiveEmpty: Отменено
    ConfirmingDeletion --> ActiveWithTasks: Отменено
    
    Deleting --> DeletingTasks: Удаление связанных задач
    DeletingTasks --> Deleted: Все задачи удалены
    
    Deleted --> [*]
    
    note right of ActiveEmpty
        Предмет существует
        Нет связанных задач
        Можно безопасно удалить
    end note
    
    note right of ActiveWithTasks
        Предмет существует
        Есть связанные задачи
        При удалении удалятся и задачи
    end note
```

---

## 6. Состояния списка задач (Task List View State)

```mermaid
stateDiagram-v2
    [*] --> Loading: Загрузка списка
    
    Loading --> Empty: Задач нет
    Loading --> DisplayingTasks: Задачи есть
    Loading --> Error: Ошибка загрузки
    
    Empty --> DisplayingTasks: Задача добавлена
    Empty --> CreatingFirst: Создать первую задачу
    
    CreatingFirst --> DisplayingTasks: Задача создана
    CreatingFirst --> Empty: Отмена
    
    DisplayingTasks --> Refreshing: Pull to refresh
    DisplayingTasks --> FilteringBySubject: Фильтр по предмету
    DisplayingTasks --> SortingByDate: Сортировка
    
    Refreshing --> DisplayingTasks: Обновлено
    FilteringBySubject --> DisplayingFiltered: Фильтр применен
    SortingByDate --> DisplayingSorted: Сортировка применена
    
    DisplayingFiltered --> DisplayingTasks: Сбросить фильтр
    DisplayingSorted --> DisplayingTasks: Сбросить сортировку
    
    DisplayingTasks --> MarkingOverdue: Проверка дедлайнов
    MarkingOverdue --> DisplayingTasks: Просроченные выделены
    
    DisplayingTasks --> Empty: Все задачи удалены
    
    Error --> Loading: Повторить загрузку
    Error --> Empty: Очистить данные
    
    note right of DisplayingTasks
        Задачи отсортированы по дате
        Просроченные выделены красным
        Выполненные зачеркнуты
    end note
```

---

## Условия переходов (Guards)

### Валидация задачи
- **title.length > 0** - Название не пустое
- **subjectId !== null** - Предмет выбран
- **deadline > now()** - Дедлайн в будущем
- **notifications.length >= 0** - Уведомления валидны (может быть пустым)

### Валидация предмета
- **name.length > 0** - Название не пустое
- **!subjects.find(s => s.name === name)** - Имя уникально
- **color.match(/^#[0-9A-F]{6}$/i)** - Валидный hex-цвет

### Проверка разрешений
- **Notification.requestPermissionsAsync()** - Запрос разрешения
- **status === 'granted'** - Разрешение выдано

### Проверка времени
- **task.deadline < Date.now()** - Дедлайн прошел
- **notification.time <= Date.now()** - Время уведомления наступило

---

## События (Events)

### Пользовательские действия
- `CREATE_TASK` - Создать задачу
- `EDIT_TASK` - Редактировать задачу
- `DELETE_TASK` - Удалить задачу
- `TOGGLE_COMPLETE` - Переключить выполнение
- `CREATE_SUBJECT` - Создать предмет
- `DELETE_SUBJECT` - Удалить предмет
- `SAVE_FORM` - Сохранить форму
- `CANCEL_FORM` - Отменить форму

### Системные события
- `APP_STARTED` - Приложение запущено
- `DATA_LOADED` - Данные загружены
- `PERMISSION_GRANTED` - Разрешение выдано
- `PERMISSION_DENIED` - Разрешение отклонено
- `NOTIFICATION_TRIGGERED` - Уведомление сработало
- `APP_BACKGROUNDED` - Приложение свернуто
- `APP_FOREGROUNDED` - Приложение развернуто

### Таймерные события
- `DEADLINE_PASSED` - Дедлайн прошел
- `NOTIFICATION_TIME` - Время уведомления
- `CHECK_OVERDUE` - Проверка просроченных

---

**Конец документа**
