# Sequence Диаграммы
## StudentCounter - Диаграммы последовательности

---

## 1. Создание задачи

```mermaid
sequenceDiagram
    actor Student as Студент
    participant UI as TasksPage
    participant Form as AddTaskPage
    participant Hook as useTasks
    participant Context as TasksContext
    participant NotifSvc as NotificationService
    participant Storage as StorageService
    participant OS as AsyncStorage

    Student->>UI: Нажать "Добавить задачу"
    UI->>Form: Навигация к add-task
    Form->>Student: Показать форму
    Student->>Form: Ввести название
    Student->>Form: Выбрать предмет
    Student->>Form: Выбрать дату/время
    Student->>Form: Выбрать уведомления
    Student->>Form: Нажать "Сохранить"
    
    Form->>Form: Валидация формы
    alt Валидация не пройдена
        Form->>Student: Показать ошибку
    else Валидация пройдена
        Form->>Hook: addTask(taskData, subject)
        Hook->>Context: addTask(taskData, subject)
        Context->>Context: Генерировать UUID
        Context->>Context: Создать объект Task
        
        Context->>NotifSvc: scheduleNotificationsForTask(task, subject)
        NotifSvc->>NotifSvc: Вычислить время уведомлений
        loop Для каждого уведомления
            NotifSvc->>NotifSvc: calculateNotificationTime()
            alt Время не в прошлом
                NotifSvc->>OS: Expo.Notifications.scheduleNotificationAsync()
                OS-->>NotifSvc: notification ID
            end
        end
        NotifSvc-->>Context: Уведомления запланированы
        
        Context->>Storage: saveTasks([...tasks, newTask])
        Storage->>OS: AsyncStorage.setItem()
        OS-->>Storage: Success
        Storage-->>Context: Saved
        
        Context->>Context: setTasks([...tasks, newTask])
        Context-->>Hook: Task created
        Hook-->>Form: Success
        Form->>UI: Навигация назад
        UI->>UI: Обновить список
        UI->>Student: Показать новую задачу
    end
```

---

## 2. Редактирование задачи

```mermaid
sequenceDiagram
    actor Student as Студент
    participant UI as TasksPage
    participant Form as EditTaskPage
    participant Hook as useTasks
    participant Context as TasksContext
    participant NotifSvc as NotificationService
    participant Storage as StorageService

    Student->>UI: Нажать "Редактировать"
    UI->>Form: Навигация к edit-task?id=xxx
    Form->>Hook: getTaskById(id)
    Hook->>Context: getTaskById(id)
    Context-->>Hook: Task data
    Hook-->>Form: Task data
    Form->>Form: Заполнить форму
    Form->>Student: Показать форму с данными
    
    Student->>Form: Изменить поля
    Student->>Form: Нажать "Сохранить"
    Form->>Form: Валидация
    
    alt Валидация не пройдена
        Form->>Student: Показать ошибку
    else Валидация пройдена
        Form->>Hook: updateTask(id, updates, subject)
        Hook->>Context: updateTask(id, updates, subject)
        
        Context->>NotifSvc: cancelNotificationsForTask(id)
        NotifSvc->>NotifSvc: Отменить старые уведомления
        NotifSvc-->>Context: Cancelled
        
        Context->>Context: Обновить задачу
        
        Context->>NotifSvc: scheduleNotificationsForTask(updatedTask, subject)
        NotifSvc->>NotifSvc: Запланировать новые уведомления
        NotifSvc-->>Context: Scheduled
        
        Context->>Storage: saveTasks(updatedTasks)
        Storage-->>Context: Saved
        Context->>Context: setTasks(updatedTasks)
        
        Context-->>Hook: Task updated
        Hook-->>Form: Success
        Form->>UI: Навигация назад
        UI->>UI: Обновить список
        UI->>Student: Показать обновленную задачу
    end
```

---

## 3. Отправка уведомления

```mermaid
sequenceDiagram
    participant Timer as System Timer
    participant OS as Operating System
    participant NotifSys as Notification System
    participant App as StudentCounter App
    participant Storage as AsyncStorage
    actor Student as Студент

    Timer->>OS: Время уведомления наступило
    OS->>NotifSys: Триггер уведомления
    NotifSys->>NotifSys: Загрузить данные уведомления
    
    NotifSys->>App: Разбудить приложение (если нужно)
    App->>Storage: Загрузить задачу
    Storage-->>App: Task data
    
    App->>App: Проверить task.completed
    alt Задача выполнена
        App->>NotifSys: Отменить уведомление
    else Задача не выполнена
        App->>App: Вычислить время до дедлайна
        App->>App: Форматировать сообщение
        App->>NotifSys: Отправить уведомление
        NotifSys->>OS: Показать уведомление
        OS->>OS: Воспроизвести звук
        OS->>OS: Вибрация (Android)
        OS->>Student: Показать баннер/уведомление
        
        alt Студент нажал на уведомление
            Student->>OS: Tap notification
            OS->>App: Открыть приложение
            App->>App: Перейти к списку задач
            App->>Student: Показать задачу
        else Студент проигнорировал
            Student->>OS: Dismiss
        end
    end
```

---

## 4. Удаление предмета с задачами

```mermaid
sequenceDiagram
    actor Student as Студент
    participant UI as SubjectsPage
    participant Dialog as Alert Dialog
    participant SubjHook as useSubjects
    participant TaskHook as useTasks
    participant SubjCtx as SubjectsContext
    participant TaskCtx as TasksContext
    participant NotifSvc as NotificationService
    participant Storage as StorageService

    Student->>UI: Нажать "Удалить предмет"
    UI->>Dialog: Показать подтверждение
    Dialog->>Student: "Удалить предмет и все задачи?"
    
    alt Студент отменил
        Student->>Dialog: Нажать "Отмена"
        Dialog->>UI: Закрыть диалог
    else Студент подтвердил
        Student->>Dialog: Нажать "Удалить"
        Dialog->>SubjHook: deleteSubject(subjectId)
        SubjHook->>SubjCtx: deleteSubject(subjectId)
        
        SubjCtx->>TaskCtx: Запрос всех задач
        TaskCtx-->>SubjCtx: tasks[]
        SubjCtx->>SubjCtx: Фильтровать задачи по subjectId
        
        loop Для каждой задачи предмета
            SubjCtx->>NotifSvc: cancelNotificationsForTask(taskId)
            NotifSvc->>NotifSvc: Отменить уведомления
            SubjCtx->>TaskCtx: deleteTask(taskId)
            TaskCtx->>TaskCtx: Удалить из массива
        end
        
        TaskCtx->>Storage: saveTasks(updatedTasks)
        Storage-->>TaskCtx: Saved
        
        SubjCtx->>SubjCtx: Удалить предмет из массива
        SubjCtx->>Storage: saveSubjects(updatedSubjects)
        Storage-->>SubjCtx: Saved
        
        SubjCtx->>SubjCtx: setSubjects(updatedSubjects)
        TaskCtx->>TaskCtx: setTasks(updatedTasks)
        
        SubjCtx-->>SubjHook: Subject deleted
        SubjHook-->>UI: Success
        UI->>UI: Обновить список
        UI->>Student: Предмет удален
    end
```

---

## 5. Запуск приложения и загрузка данных

```mermaid
sequenceDiagram
    actor Student as Студент
    participant OS as Operating System
    participant App as App Component
    participant SubjCtx as SubjectsContext
    participant TaskCtx as TasksContext
    participant NotifSvc as NotificationService
    participant Storage as StorageService
    participant AsyncSt as AsyncStorage
    participant UI as TasksPage

    Student->>OS: Запустить приложение
    OS->>App: Инициализация
    App->>App: Загрузить провайдеры
    
    par Параллельная загрузка
        App->>SubjCtx: Инициализация SubjectsProvider
        SubjCtx->>Storage: getSubjects()
        Storage->>AsyncSt: getItem('@studentcounter:subjects')
        AsyncSt-->>Storage: JSON string
        Storage->>Storage: JSON.parse()
        Storage-->>SubjCtx: subjects[]
        SubjCtx->>SubjCtx: setSubjects(subjects)
    and
        App->>TaskCtx: Инициализация TasksProvider
        TaskCtx->>Storage: getTasks()
        Storage->>AsyncSt: getItem('@studentcounter:tasks')
        AsyncSt-->>Storage: JSON string
        Storage->>Storage: JSON.parse()
        Storage-->>TaskCtx: tasks[]
        TaskCtx->>TaskCtx: setTasks(tasks)
    end
    
    App->>NotifSvc: requestPermissions()
    NotifSvc->>OS: Запрос разрешения
    
    alt Первый запуск
        OS->>Student: Диалог разрешения
        Student->>OS: Разрешить/Запретить
        OS-->>NotifSvc: Permission status
    else Разрешение уже выдано
        OS-->>NotifSvc: granted
    end
    
    NotifSvc-->>App: Permission result
    
    alt Разрешение запрещено
        App->>Student: Показать предупреждение
    end
    
    App->>UI: Рендер главного экрана
    UI->>UI: Отобразить список задач
    UI->>Student: Приложение готово
```

---

## 6. Создание предмета с задачей

```mermaid
sequenceDiagram
    actor Student as Студент
    participant SubjUI as SubjectsPage
    participant SubjForm as AddSubjectPage
    participant TaskForm as AddTaskPage
    participant SubjHook as useSubjects
    participant TaskHook as useTasks
    participant SubjCtx as SubjectsContext
    participant TaskCtx as TasksContext
    participant Storage as StorageService

    Student->>SubjUI: Нажать "Добавить предмет"
    SubjUI->>SubjForm: Навигация к add-subject
    SubjForm->>Student: Показать форму
    
    Student->>SubjForm: Ввести название
    Student->>SubjForm: Выбрать цвет
    Student->>SubjForm: Отметить "Создать задачу"
    Student->>SubjForm: Нажать "Сохранить"
    
    SubjForm->>SubjForm: Валидация
    SubjForm->>SubjHook: addSubject(subjectData)
    SubjHook->>SubjCtx: addSubject(subjectData)
    SubjCtx->>SubjCtx: Генерировать UUID
    SubjCtx->>SubjCtx: Создать объект Subject
    SubjCtx->>Storage: saveSubjects([...subjects, newSubject])
    Storage-->>SubjCtx: Saved
    SubjCtx->>SubjCtx: setSubjects([...subjects, newSubject])
    SubjCtx-->>SubjHook: Subject created
    SubjHook-->>SubjForm: newSubject
    
    alt Флаг "Создать задачу" установлен
        SubjForm->>TaskForm: Навигация к add-task?subjectId=xxx
        TaskForm->>TaskForm: Предвыбрать предмет
        TaskForm->>Student: Показать форму задачи
        
        Student->>TaskForm: Ввести данные задачи
        Student->>TaskForm: Нажать "Сохранить"
        TaskForm->>TaskHook: addTask(taskData, subject)
        TaskHook->>TaskCtx: addTask(taskData, subject)
        TaskCtx->>TaskCtx: Создать задачу
        TaskCtx->>Storage: saveTasks([...tasks, newTask])
        Storage-->>TaskCtx: Saved
        TaskCtx-->>TaskHook: Task created
        TaskHook-->>TaskForm: Success
        TaskForm->>SubjUI: Навигация к главному экрану
    else Флаг не установлен
        SubjForm->>SubjUI: Навигация назад
    end
    
    SubjUI->>SubjUI: Обновить список
    SubjUI->>Student: Показать новый предмет
```

---

## 7. Переключение статуса выполнения задачи

```mermaid
sequenceDiagram
    actor Student as Студент
    participant Card as TaskCard
    participant Page as TasksPage
    participant Hook as useTasks
    participant Context as TasksContext
    participant Storage as StorageService

    Student->>Card: Нажать чекбокс
    Card->>Page: onToggleComplete(taskId)
    Page->>Hook: toggleTaskComplete(taskId)
    Hook->>Context: toggleTaskComplete(taskId)
    
    Context->>Context: Найти задачу по ID
    Context->>Context: Переключить task.completed
    
    alt Задача отмечена выполненной
        Context->>Context: completed = true
        Note over Context: Опционально: отменить будущие уведомления
    else Задача отмечена невыполненной
        Context->>Context: completed = false
    end
    
    Context->>Storage: saveTasks(updatedTasks)
    Storage-->>Context: Saved
    Context->>Context: setTasks(updatedTasks)
    Context-->>Hook: Task toggled
    Hook-->>Page: Success
    Page->>Card: Обновить props
    Card->>Card: Перерендер с новым статусом
    
    alt Выполнена
        Card->>Student: Показать зачеркнутый текст
    else Не выполнена
        Card->>Student: Показать обычный текст
    end
```

---

## Ключевые взаимодействия

### Паттерны взаимодействия

1. **UI → Hook → Context → Service → Storage**
   - Стандартный поток для операций с данными
   - Разделение ответственности между слоями

2. **Context координирует несколько сервисов**
   - TasksContext использует StorageService + NotificationService
   - Атомарные операции (сохранение + планирование уведомлений)

3. **Асинхронные операции**
   - Все операции с хранилищем асинхронные
   - Использование Promise для обработки результатов

4. **Двусторонняя связь Context ↔ UI**
   - Context обновляет состояние
   - UI автоматически ререндерится через React

5. **Система уведомлений работает независимо**
   - ОС триггерит уведомления по расписанию
   - Приложение может быть закрыто

---

**Конец документа**
