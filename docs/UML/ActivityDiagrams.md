# Activity Диаграммы
## StudentCounter - Диаграммы активностей

---

## 1. Создание задачи

```mermaid
flowchart TD
    Start([Начало: Пользователь нажал Добавить задачу]) --> OpenForm[Открыть форму создания задачи]
    OpenForm --> InputTitle[Ввести название задачи]
    InputTitle --> SelectSubject{Выбрать предмет}
    
    SelectSubject -->|Существующий| SubjectSelected[Предмет выбран]
    SelectSubject -->|Создать новый| CreateSubject[Создать новый предмет]
    
    CreateSubject --> InputSubjectName[Ввести название предмета]
    InputSubjectName --> SelectColor[Выбрать цвет]
    SelectColor --> ValidateSubject{Валидация предмета}
    
    ValidateSubject -->|Название пустое| ShowSubjectError[Показать ошибку: Введите название]
    ShowSubjectError --> InputSubjectName
    
    ValidateSubject -->|Предмет существует| ShowDuplicateWarning[Показать предупреждение: Предмет существует]
    ShowDuplicateWarning --> InputSubjectName
    
    ValidateSubject -->|OK| SaveSubject[Сохранить предмет]
    SaveSubject --> SubjectSelected
    
    SubjectSelected --> SelectDate[Выбрать дату дедлайна]
    SelectDate --> SelectTime[Выбрать время дедлайна]
    SelectTime --> InputDescription{Ввести описание?}
    
    InputDescription -->|Да| EnterDescription[Ввести описание]
    InputDescription -->|Нет| SelectNotifications
    EnterDescription --> SelectNotifications[Выбрать уведомления]
    
    SelectNotifications --> ClickSave[Нажать Сохранить]
    ClickSave --> ValidateTask{Валидация задачи}
    
    ValidateTask -->|Название пустое| ShowTitleError[Показать ошибку: Введите название задачи]
    ShowTitleError --> InputTitle
    
    ValidateTask -->|Предмет не выбран| ShowSubjectError2[Показать ошибку: Выберите предмет]
    ShowSubjectError2 --> SelectSubject
    
    ValidateTask -->|Дедлайн в прошлом| ShowDateError[Показать ошибку: Дедлайн не может быть в прошлом]
    ShowDateError --> SelectDate
    
    ValidateTask -->|OK| GenerateID[Сгенерировать UUID для задачи]
    GenerateID --> CalculateNotifTime[Вычислить время уведомлений]
    CalculateNotifTime --> CheckPastNotif{Есть уведомления в прошлом?}
    
    CheckPastNotif -->|Да| FilterNotif[Отфильтровать прошедшие]
    CheckPastNotif -->|Нет| ScheduleNotif
    FilterNotif --> ScheduleNotif[Запланировать уведомления]
    
    ScheduleNotif --> SaveTask[Сохранить задачу в AsyncStorage]
    SaveTask --> UpdateContext[Обновить TasksContext]
    UpdateContext --> CloseForm[Закрыть форму]
    CloseForm --> ShowInList[Показать задачу в списке]
    ShowInList --> End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowTitleError fill:#FFA07A
    style ShowSubjectError fill:#FFA07A
    style ShowSubjectError2 fill:#FFA07A
    style ShowDateError fill:#FFA07A
    style ShowDuplicateWarning fill:#FFD700
```

---

## 2. Редактирование задачи

```mermaid
flowchart TD
    Start([Начало: Пользователь нажал Редактировать]) --> LoadTask[Загрузить данные задачи]
    LoadTask --> OpenForm[Открыть форму редактирования]
    OpenForm --> FillFields[Заполнить поля текущими данными]
    FillFields --> UserEdit{Пользователь редактирует}
    
    UserEdit -->|Изменить название| EditTitle[Изменить название]
    UserEdit -->|Изменить предмет| EditSubject[Изменить предмет]
    UserEdit -->|Изменить дедлайн| EditDeadline[Изменить дату/время]
    UserEdit -->|Изменить описание| EditDescription[Изменить описание]
    UserEdit -->|Изменить уведомления| EditNotifications[Изменить уведомления]
    UserEdit -->|Отмена| Cancel[Закрыть без сохранения]
    
    EditTitle --> ClickSave
    EditSubject --> ClickSave
    EditDeadline --> ClickSave
    EditDescription --> ClickSave
    EditNotifications --> ClickSave[Нажать Сохранить]
    
    ClickSave --> ValidateTask{Валидация}
    
    ValidateTask -->|Ошибка| ShowError[Показать ошибку]
    ShowError --> UserEdit
    
    ValidateTask -->|OK| CancelOldNotif[Отменить старые уведомления]
    CancelOldNotif --> CalculateNewNotif[Вычислить новые уведомления]
    CalculateNewNotif --> ScheduleNewNotif[Запланировать новые уведомления]
    ScheduleNewNotif --> UpdateTask[Обновить задачу в хранилище]
    UpdateTask --> UpdateContext[Обновить TasksContext]
    UpdateContext --> CloseForm[Закрыть форму]
    CloseForm --> UpdateDisplay[Обновить отображение в списке]
    UpdateDisplay --> End
    
    Cancel --> End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowError fill:#FFA07A
```

---

## 3. Отправка уведомления

```mermaid
flowchart TD
    Start([Начало: Наступило время уведомления]) --> TriggerTime[Системный таймер срабатывает]
    TriggerTime --> LoadTask[Загрузить данные задачи]
    LoadTask --> CheckCompleted{Задача выполнена?}
    
    CheckCompleted -->|Да| Skip[Пропустить уведомление]
    CheckCompleted -->|Нет| CalcTimeLeft[Вычислить время до дедлайна]
    
    CalcTimeLeft --> FormatMessage[Форматировать сообщение уведомления]
    FormatMessage --> CreateNotification[Создать объект уведомления]
    CreateNotification --> SetSound[Установить звук уведомления]
    SetSound --> SetVibration[Установить вибрацию Android]
    SetVibration --> SendToOS[Отправить в систему ОС]
    SendToOS --> OSDisplays{ОС отображает уведомление}
    
    OSDisplays -->|Уведомления разрешены| PlaySound[Воспроизвести звук]
    OSDisplays -->|Уведомления запрещены| Silent[Тихое уведомление]
    
    PlaySound --> UserSees[Пользователь видит/слышит уведомление]
    Silent --> End
    UserSees --> UserAction{Действие пользователя}
    
    UserAction -->|Нажал на уведомление| OpenApp[Открыть приложение]
    UserAction -->|Проигнорировал| End
    
    OpenApp --> NavigateToTask[Перейти к списку задач]
    NavigateToTask --> End
    
    Skip --> End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style PlaySound fill:#87CEEB
```

---

## 4. Удаление предмета

```mermaid
flowchart TD
    Start([Начало: Пользователь нажал Удалить предмет]) --> ShowDialog[Показать диалог подтверждения]
    ShowDialog --> UserConfirm{Подтвердить?}
    
    UserConfirm -->|Отмена| CloseDialog[Закрыть диалог]
    UserConfirm -->|Подтвердить| LoadTasks[Загрузить все задачи]
    
    LoadTasks --> FilterTasks[Найти задачи этого предмета]
    FilterTasks --> CheckTasks{Есть задачи?}
    
    CheckTasks -->|Нет| DeleteSubject
    CheckTasks -->|Да| IterateTasks[Для каждой задачи]
    
    IterateTasks --> CancelNotif[Отменить уведомления задачи]
    CancelNotif --> DeleteTask[Удалить задачу]
    DeleteTask --> MoreTasks{Еще задачи?}
    
    MoreTasks -->|Да| IterateTasks
    MoreTasks -->|Нет| DeleteSubject[Удалить предмет из хранилища]
    
    DeleteSubject --> UpdateSubjectsContext[Обновить SubjectsContext]
    UpdateSubjectsContext --> UpdateTasksContext[Обновить TasksContext]
    UpdateTasksContext --> UpdateUI[Обновить интерфейс]
    UpdateUI --> End
    
    CloseDialog --> End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowDialog fill:#FFD700
```

---

## 5. Просмотр списка задач

```mermaid
flowchart TD
    Start([Начало: Открыт экран Задачи]) --> LoadTasks[Загрузить задачи из AsyncStorage]
    LoadTasks --> LoadSubjects[Загрузить предметы из AsyncStorage]
    LoadSubjects --> CheckEmpty{Есть задачи?}
    
    CheckEmpty -->|Нет| ShowEmpty[Показать заглушку: Нет задач]
    CheckEmpty -->|Да| MapSubjects[Связать задачи с предметами]
    
    MapSubjects --> GetCurrentTime[Получить текущее время]
    GetCurrentTime --> SortTasks[Сортировать по дате дедлайна]
    SortTasks --> IterateTasks[Для каждой задачи]
    
    IterateTasks --> CheckOverdue{Дедлайн прошел?}
    CheckOverdue -->|Да| MarkRed[Отметить красным цветом]
    CheckOverdue -->|Нет| CheckSoon{Дедлайн скоро?}
    
    CheckSoon -->|< 24 часов| MarkYellow[Отметить желтым]
    CheckSoon -->|> 24 часов| MarkNormal[Обычный цвет]
    
    MarkRed --> CreateCard
    MarkYellow --> CreateCard
    MarkNormal --> CreateCard[Создать TaskCard компонент]
    
    CreateCard --> MoreTasks{Еще задачи?}
    MoreTasks -->|Да| IterateTasks
    MoreTasks -->|Нет| RenderList[Отобразить список]
    
    RenderList --> UserInteract{Взаимодействие пользователя}
    
    UserInteract -->|Отметить выполненной| ToggleComplete[Переключить статус]
    UserInteract -->|Редактировать| OpenEdit[Открыть редактирование]
    UserInteract -->|Удалить| DeleteTask[Удалить задачу]
    UserInteract -->|Добавить новую| CreateNew[Создать задачу]
    
    ToggleComplete --> UpdateStorage[Обновить хранилище]
    UpdateStorage --> RefreshList[Обновить список]
    
    OpenEdit --> End
    DeleteTask --> RefreshList
    CreateNew --> End
    RefreshList --> End
    ShowEmpty --> End
    
    End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style MarkRed fill:#FFA07A
    style MarkYellow fill:#FFD700
```

---

## 6. Запуск приложения

```mermaid
flowchart TD
    Start([Начало: Пользователь открыл приложение]) --> InitApp[Инициализация приложения]
    InitApp --> LoadProviders[Загрузить Context Providers]
    LoadProviders --> LoadSubjects[Загрузить предметы SubjectsContext]
    LoadSubjects --> LoadTasks[Загрузить задачи TasksContext]
    LoadTasks --> CheckPermissions{Разрешение на уведомления?}
    
    CheckPermissions -->|Не запрашивалось| RequestPermission[Запросить разрешение]
    CheckPermissions -->|Разрешено| InitNotif
    CheckPermissions -->|Запрещено| ShowWarning[Показать предупреждение]
    
    RequestPermission --> UserResponse{Ответ пользователя}
    UserResponse -->|Разрешено| InitNotif[Инициализировать систему уведомлений]
    UserResponse -->|Запрещено| ShowWarning
    
    ShowWarning --> RenderUI
    InitNotif --> CheckScheduled[Проверить запланированные уведомления]
    CheckScheduled --> CleanOld[Очистить старые уведомления]
    CleanOld --> RenderUI[Отобразить главный экран]
    
    RenderUI --> LoadTasksList[Загрузить список задач]
    LoadTasksList --> Ready[Приложение готово к работе]
    Ready --> End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowWarning fill:#FFD700
```

---

## 7. Создание предмета с задачей

```mermaid
flowchart TD
    Start([Начало: Создать предмет]) --> OpenForm[Открыть форму создания предмета]
    OpenForm --> InputName[Ввести название предмета]
    InputName --> SelectColor[Выбрать цвет]
    SelectColor --> CheckCreateTask{Создать задачу для предмета?}
    
    CheckCreateTask -->|Нет| ClickSave
    CheckCreateTask -->|Да| CheckFlag[Установить флаг createTask]
    
    CheckFlag --> ClickSave[Нажать Сохранить]
    ClickSave --> Validate{Валидация}
    
    Validate -->|Ошибка| ShowError[Показать ошибку]
    ShowError --> InputName
    
    Validate -->|OK| GenerateID[Сгенерировать ID предмета]
    GenerateID --> SaveSubject[Сохранить предмет]
    SaveSubject --> UpdateSubjectsContext[Обновить SubjectsContext]
    UpdateSubjectsContext --> CheckFlag2{Флаг createTask?}
    
    CheckFlag2 -->|Нет| CloseForm
    CheckFlag2 -->|Да| OpenTaskForm[Открыть форму создания задачи]
    
    OpenTaskForm --> PreSelectSubject[Предвыбрать созданный предмет]
    PreSelectSubject --> InputTaskTitle[Ввести название задачи]
    InputTaskTitle --> SelectDeadline[Выбрать дедлайн]
    SelectDeadline --> SelectNotif[Выбрать уведомления]
    SelectNotif --> SaveTask[Сохранить задачу]
    SaveTask --> UpdateTasksContext[Обновить TasksContext]
    UpdateTasksContext --> CloseTaskForm[Закрыть форму задачи]
    CloseTaskForm --> CloseForm[Закрыть форму предмета]
    
    CloseForm --> ShowInList[Показать предмет в списке]
    ShowInList --> End([Конец])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowError fill:#FFA07A
```

---

**Конец документа**
