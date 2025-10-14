# GreenZone Admin Panel

Полнофункциональная админ-панель для проекта GreenZone, построенная на React + TypeScript + Tailwind CSS + shadcn/ui.

## 🚀 Особенности

- **Полнофункциональный CRUD** для всех сущностей (Заказы, Товары, Клиенты, Категории, Доставки)
- **JWT авторизация** с ролевой проверкой (Admin/User)
- **Реактивные таблицы** с пагинацией, поиском и фильтрацией
- **Аналитический дашборд** с графиками и статистикой
- **Загрузка файлов** (изображения товаров, документы)
- **Уведомления** и валидация форм
- **Адаптивный дизайн** с поддержкой темной темы
- **TypeScript** для типобезопасности

## 📁 Структура проекта

```
src/
├── api/                    # API слой
│   ├── axiosInstance.ts    # Настроенный Axios с interceptors
│   └── endpoints.ts        # Все API endpoints и типы
├── auth/                   # Система авторизации
│   └── AuthProvider.tsx    # Context для JWT и ролей
├── components/             # Общие компоненты
│   ├── admin/             # Компоненты админ-панели
│   │   ├── DataTable.tsx   # Универсальная таблица
│   │   ├── Pagination.tsx  # Пагинация
│   │   ├── SearchBar.tsx   # Поиск
│   │   ├── ConfirmDialog.tsx # Диалог подтверждения
│   │   └── Loader.tsx      # Индикаторы загрузки
│   └── ProtectedRoute.tsx  # Защищенные маршруты
├── hooks/                  # Кастомные хуки
│   └── useEntityManagement.ts # Хуки для управления сущностями
├── layout/                 # Макеты
│   └── AdminLayout.tsx     # Макет админ-панели
├── pages/                  # Страницы
│   ├── admin/              # Страницы админ-панели
│   │   ├── AdminDashboard.tsx    # Главная панель
│   │   ├── OrdersList.tsx        # Список заказов
│   │   ├── OrderCreate.tsx      # Создание заказа
│   │   ├── OrderView.tsx         # Просмотр заказа
│   │   ├── ProductsList.tsx      # Список товаров
│   │   ├── ProductCreate.tsx    # Создание товара
│   │   ├── CustomersList.tsx    # Список клиентов
│   │   ├── CustomerView.tsx     # Просмотр клиента
│   │   ├── CategoriesList.tsx   # Список категорий
│   │   ├── CategoryCreate.tsx   # Создание категории
│   │   └── DeliveriesList.tsx   # Список доставок
│   └── ui/                 # Публичные страницы
│       └── Login.tsx        # Страница входа
├── router/                 # Роутинг
│   └── AppRouter.tsx       # Главный роутер
└── config/                 # Конфигурация
    └── app.ts              # Настройки приложения
```

## 🛠 Установка и запуск

### Предварительные требования

- Node.js 18+ 
- npm или yarn
- ASP.NET Core 8 Backend (запущенный на https://localhost:7100)

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://localhost:7100

# App Configuration
NEXT_PUBLIC_APP_NAME=GreenZone Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🔐 Авторизация

### JWT Claims для ролей

Админ-панель поддерживает следующие варианты claims в JWT токене:

- `role` - строка (например: "Admin", "User")
- `roles` - массив строк (например: ["Admin"], ["User", "Manager"])
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` - стандартный ASP.NET Core claim

### Логика перенаправления

- При успешном входе с ролью **Admin** → перенаправление на `/admin`
- При входе с любой другой ролью → перенаправление на публичную UI (`/`)
- При 401 ошибке → автоматический logout и перенаправление на `/login`

## 📡 API Endpoints

### Админ API (требует Authorization: Bearer <token>)

#### Заказы
- `GET /api/admin/order` - Список заказов с пагинацией
- `GET /api/admin/order/{id}` - Получить заказ по ID
- `POST /api/admin/order` - Создать заказ
- `PUT /api/admin/order/{id}` - Обновить заказ
- `DELETE /api/admin/order/{id}` - Удалить заказ
- `GET /api/admin/order/by-status/{statusId}` - Заказы по статусу
- `POST /api/admin/order/{id}/deliver` - Отметить как доставленный
- `POST /api/admin/order/{id}/processing` - Взять в обработку
- `POST /api/admin/order/{id}/returned` - Отметить как возвращенный
- `POST /api/admin/order/{id}/cancel` - Отменить заказ

#### Товары
- `GET /api/admin/product` - Список товаров с пагинацией
- `GET /api/admin/product/{id}` - Получить товар по ID
- `POST /api/admin/product` - Создать товар
- `PUT /api/admin/product/{id}` - Обновить товар
- `DELETE /api/admin/product/{id}` - Удалить товар
- `POST /api/admin/product/upload-image/{id}` - Загрузить изображение
- `POST /api/admin/product/upload-documents/{id}` - Загрузить документы

#### Клиенты
- `GET /api/admin/customer` - Список клиентов с пагинацией
- `GET /api/admin/customer/{id}` - Получить клиента по ID
- `DELETE /api/admin/customer/{id}` - Удалить клиента

#### Категории
- `GET /api/admin/category` - Список категорий
- `GET /api/admin/category/{id}` - Получить категорию по ID
- `POST /api/admin/category` - Создать категорию
- `PUT /api/admin/category/{id}` - Обновить категорию
- `DELETE /api/admin/category/{id}` - Удалить категорию

#### Доставки
- `GET /api/admin/delivery` - Список доставок с пагинацией
- `GET /api/admin/delivery/{id}` - Получить доставку по ID
- `POST /api/admin/delivery` - Создать доставку
- `PUT /api/admin/delivery/{id}` - Обновить доставку
- `DELETE /api/admin/delivery/{id}` - Удалить доставку
- `POST /api/admin/delivery/{id}/status/{status}` - Изменить статус

### Auth API
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/logout` - Выход
- `GET /api/auth/profile` - Получить профиль пользователя

## 🎨 UI/UX Особенности

### Компоненты
- **DataTable** - Универсальная таблица с сортировкой, пагинацией и действиями
- **SearchBar** - Поиск с debounce и очисткой
- **Pagination** - Полнофункциональная пагинация
- **ConfirmDialog** - Диалоги подтверждения действий
- **Loader** - Индикаторы загрузки разных размеров

### Стилизация
- **Tailwind CSS** для стилизации
- **shadcn/ui** компоненты
- **Lucide React** иконки
- **Адаптивный дизайн** для всех устройств
- **Темная тема** (базовая поддержка)

### Уведомления
- **react-hot-toast** для уведомлений
- Автоматическое скрытие через 3-5 секунд
- Разные типы: success, error, loading

## 📊 Аналитика

### Дашборд включает:
- **Карточки статистики**: Всего заказов, Активных товаров, Клиентов, Доставок
- **График заказов по месяцам** с использованием Recharts
- **Распределение заказов по статусам**
- **Последние заказы** с быстрым доступом
- **Экспорт заказов в CSV** (функция готова к интеграции)

## 🔧 Разработка

### Добавление новых сущностей

1. **Создайте типы** в `src/api/endpoints.ts`
2. **Добавьте API методы** в соответствующий раздел
3. **Создайте страницы** в `src/pages/admin/`
4. **Добавьте маршруты** в `src/router/AppRouter.tsx`
5. **Обновите навигацию** в `src/layout/AdminLayout.tsx`

### Пример добавления новой сущности:

```typescript
// 1. Типы
export interface NewEntityDto {
  id: number;
  name: string;
  // ... другие поля
}

// 2. API методы
export const adminApi = {
  newEntities: {
    getAll: (params) => apiClient.get('/api/admin/new-entity', { params }),
    getById: (id) => apiClient.get(`/api/admin/new-entity/${id}`),
    create: (data) => apiClient.post('/api/admin/new-entity', data),
    update: (id, data) => apiClient.put(`/api/admin/new-entity/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/new-entity/${id}`),
  },
};
```

## 🐛 Отладка

### Проверка авторизации
```javascript
// В консоли браузера
localStorage.getItem('greenzone_token')
```

### Проверка API запросов
- Откройте DevTools → Network
- Все запросы к `/api/admin/*` должны содержать заголовок `Authorization: Bearer <token>`

### Частые проблемы

1. **401 Unauthorized** - Проверьте токен в localStorage и его валидность
2. **CORS ошибки** - Убедитесь, что backend настроен для работы с фронтендом
3. **Роли не определяются** - Проверьте JWT payload и claims

## 📝 TODO / Известные ограничения

### Backend API (требует реализации):
- [ ] Endpoint для экспорта заказов в CSV
- [ ] Endpoint для загрузки статистики дашборда
- [ ] Endpoint для изменения статусов заказов
- [ ] Endpoint для загрузки файлов товаров

### Frontend (можно улучшить):
- [ ] Редактирование заказов (сейчас только создание)
- [ ] Редактирование товаров (сейчас только создание)
- [ ] Редактирование категорий (сейчас только создание)
- [ ] Создание и редактирование доставок
- [ ] Темная тема (полная реализация)
- [ ] Уведомления в реальном времени
- [ ] Экспорт данных в различных форматах

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что backend API доступен
3. Проверьте переменные окружения
4. Убедитесь, что все зависимости установлены

## 📄 Лицензия

Этот проект является частью GreenZone и предназначен для внутреннего использования.
