# Установка зависимостей для админ-панели GreenZone

## Необходимые зависимости

Для работы админ-панели необходимо установить следующие дополнительные зависимости:

```bash
npm install react-hook-form react-hot-toast react-router-dom
```

## Полная команда установки

```bash
# Установка всех зависимостей проекта
npm install

# Или если нужно установить только новые зависимости
npm install react-hook-form@^7.48.2 react-hot-toast@^2.4.1 react-router-dom@^6.20.1
```

## Проверка установки

После установки зависимостей проверьте, что все пакеты установлены корректно:

```bash
npm list react-hook-form react-hot-toast react-router-dom
```

## Возможные проблемы

### Ошибка версий React Router
Если возникают конфликты версий с React Router, попробуйте:

```bash
npm install react-router-dom@^6.20.1 --legacy-peer-deps
```

### Проблемы с TypeScript
Если возникают ошибки типов, убедитесь, что установлены правильные версии:

```bash
npm install @types/react@^18.0.0 @types/react-dom@^18.0.0 --save-dev
```

## Проверка работоспособности

После установки всех зависимостей запустите проект:

```bash
npm run dev
```

Админ-панель должна быть доступна по адресу: http://localhost:3000/admin
