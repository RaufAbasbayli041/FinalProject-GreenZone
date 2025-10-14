# 🔄 Админ-панель теперь использует реальные API

## ✅ Что было изменено

1. **Удалена заглушка** из `auth-context.tsx` - теперь используется только реальный API
2. **Создан `services/admin-api.ts`** - все функции для работы с `/api/admin/*` эндпоинтами
3. **Обновлен `AdminDashboard.tsx`** - теперь загружает реальные данные
4. **Обновлен список заказов** - использует реальные API вместо моковых данных

## 🔧 API эндпоинты

Все функции в `services/admin-api.ts` используют эндпоинты:

### Заказы (`/api/admin/order`)
- `GET /api/admin/order` - получить все заказы
- `GET /api/admin/order/{id}` - получить заказ по ID
- `POST /api/admin/order` - создать заказ
- `PUT /api/admin/order/{id}` - обновить заказ
- `DELETE /api/admin/order/{id}` - удалить заказ
- `PUT /api/admin/order/{id}/deliver` - доставить заказ
- `PUT /api/admin/order/{id}/processing` - в обработку
- `PUT /api/admin/order/{id}/returned` - возврат
- `PUT /api/admin/order/{id}/cancel` - отмена

### Товары (`/api/admin/product`)
- `GET /api/admin/product` - получить все товары
- `GET /api/admin/product/{id}` - получить товар по ID
- `POST /api/admin/product` - создать товар
- `PUT /api/admin/product/{id}` - обновить товар
- `DELETE /api/admin/product/{id}` - удалить товар
- `POST /api/admin/product/upload-image/{id}` - загрузить изображение
- `POST /api/admin/product/upload-documents/{id}` - загрузить документы

### Клиенты (`/api/admin/customer`)
- `GET /api/admin/customer` - получить всех клиентов
- `GET /api/admin/customer/{id}` - получить клиента по ID
- `DELETE /api/admin/customer/{id}` - удалить клиента

### Категории (`/api/admin/category`)
- `GET /api/admin/category` - получить все категории
- `GET /api/admin/category/{id}` - получить категорию по ID
- `POST /api/admin/category` - создать категорию
- `PUT /api/admin/category/{id}` - обновить категорию
- `DELETE /api/admin/category/{id}` - удалить категорию

### Доставки (`/api/admin/delivery`)
- `GET /api/admin/delivery` - получить все доставки
- `GET /api/admin/delivery/{id}` - получить доставку по ID
- `POST /api/admin/delivery` - создать доставку
- `PUT /api/admin/delivery/{id}` - обновить доставку
- `DELETE /api/admin/delivery/{id}` - удалить доставку
- `PUT /api/admin/delivery/{id}/status/{status}` - обновить статус

## 🔐 Авторизация

Все запросы к админ API автоматически включают:
```
Authorization: Bearer <token>
```

Токен берется из `localStorage.getItem('auth_token')`

## 🚀 Как использовать

1. **Войдите как Admin** с реальными учетными данными
2. **Админ-панель** автоматически загрузит данные из API
3. **Все операции** (создание, редактирование, удаление) работают через реальные эндпоинты

## 📊 Дашборд

Дашборд теперь показывает:
- **Реальную статистику** (количество заказов, товаров, клиентов, доставок)
- **Графики** на основе реальных данных
- **Последние заказы** из API
- **Экспорт CSV** с реальными данными

## ⚠️ Требования к Backend

Убедитесь, что ваш ASP.NET Core backend поддерживает:

1. **Все эндпоинты** `/api/admin/*`
2. **JWT авторизацию** с ролью "Admin"
3. **CORS** для фронтенда
4. **Правильные типы данных** в ответах

## 🐛 Отладка

Если что-то не работает:

1. **Проверьте консоль браузера** на ошибки API
2. **Убедитесь**, что backend запущен на `https://localhost:7100`
3. **Проверьте токен** в localStorage
4. **Убедитесь**, что пользователь имеет роль "Admin"

## 📝 Следующие шаги

1. **Протестируйте** все функции админ-панели
2. **Обновите остальные страницы** (товары, клиенты, категории) для использования реальных API
3. **Добавьте обработку ошибок** и уведомления пользователю
4. **Оптимизируйте загрузку** данных с помощью React Query
