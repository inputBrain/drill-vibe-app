# API Client Generation with NSwag

Цей проект використовує **NSwag** для автоматичної генерації TypeScript API клієнта з ASP.NET Core сервера.

## Структура API файлів

- `nswag.json` - конфігурація NSwag для генерації клієнта
- `src/lib/generated-api.ts` - **автоматично згенерований** файл (НЕ редагувати вручну!)
- `src/lib/api-wrapper.ts` - обгортка з логуванням для pm2
- `src/lib/api-client.ts` - експорт API клієнта

## Як використовувати

### 1. Запустити сервер Drill.Server

```bash
cd D:\apps\Drill.Server\Drill.Server.Host
dotnet run
```

Сервер має запуститися на `http://localhost:5000`

### 2. Згенерувати TypeScript API клієнт

```bash
npm run generate-api
```

Ця команда:
- Завантажить swagger.json з сервера
- Згенерує TypeScript типи та методи
- Збереже результат в `src/lib/generated-api.ts`

### 3. Використання в коді

```typescript
import { apiClient, type CreateUser, type UserDto } from '@/lib/api-client';

const users = await apiClient.listAllUsers();

const newUser = await apiClient.createUser({
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe'
});
```

## Переваги NSwag

✅ **Автоматична типізація** - всі типи синхронізовані з сервером
✅ **Немає помилок в URL** - маршрути генеруються автоматично
✅ **IntelliSense** - автодоповнення методів та параметрів
✅ **Швидка синхронізація** - після зміни API на сервері просто перегенеруйте клієнт
✅ **Логування вбудоване** - всі запити автоматично логуються для pm2

## Логування для pm2

Всі API запити автоматично логуються в консоль:

```
[2025-01-15T10:30:45.123Z] GET http://localhost:5000/api/User/list
[2025-01-15T10:30:47.456Z] POST http://localhost:5000/api/Drill/start { body: {...} }
```

При запуску через pm2, логи будуть доступні через `pm2 logs`.

## Оновлення після змін на сервері

Коли ви змінюєте API на сервері:

1. Запустіть сервер
2. Виконайте `npm run generate-api`
3. Перезапустіть Next.js (якщо запущений)

Клієнт автоматично оновиться з новими типами та методами!

## Доступні методи API

Згенеровані методи:

### User
- `apiClient.createUser(data: CreateUser): Promise<UserDto>`
- `apiClient.listAllUsers(): Promise<UserDto[]>`
- `apiClient.updateUser(data: UpdateUser): Promise<UpdateUserResponse>`
- `apiClient.deleteUser(data: DeleteUser): Promise<void>`

### Drill
- `apiClient.createDrill(data: CreateDrill): Promise<DrillDto>`
- `apiClient.listAllDrills(): Promise<DrillDto[]>`
- `apiClient.updateDrill(data: UpdateDrill): Promise<UpdateDrillResponse>`
- `apiClient.deleteDrill(data: DeleteDrill): Promise<void>`
- `apiClient.start(data: StartDrill): Promise<StartDrillResponse>`
- `apiClient.stop(data: StopDrill): Promise<StopDrillResponse>`

### UserDrill
- `apiClient.listAll(): Promise<UserDrillDto[]>`
- `apiClient.getActive(): Promise<UserDrillDto[]>`
- `apiClient.getCompleted(): Promise<UserDrillDto[]>`
- `apiClient.deleteUserDrill(data: DeleteUserDrill): Promise<void>`
