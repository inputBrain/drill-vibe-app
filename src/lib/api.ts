import type {
  CreateDrill,
  CreateUser,
  DeleteDrill,
  DeleteUser,
  DeleteUserDrill,
  DrillDto,
  StartDrill,
  StartDrillResponse,
  StopDrill,
  StopDrillResponse,
  UpdateDrill,
  UpdateDrillResponse,
  UpdateUser,
  UpdateUserResponse,
  UserDto,
  UserDrillDto,
} from '@/types';

const BASE_URL = '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }

  // For DELETE requests that return 200 OK with no content
  if (response.status === 200 && response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // User endpoints
  users: {
    list: (): Promise<UserDto[]> =>
      fetch(`${BASE_URL}/api/User/ListAllUsers/list`).then(handleResponse<UserDto[]>),

    create: (data: CreateUser): Promise<UserDto> =>
      fetch(`${BASE_URL}/api/User/CreateUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<UserDto>),

    update: (data: UpdateUser): Promise<UpdateUserResponse> =>
      fetch(`${BASE_URL}/api/User/UpdateUser`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<UpdateUserResponse>),

    delete: (userId: number): Promise<void> =>
      fetch(`${BASE_URL}/api/User/DeleteUser`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId } satisfies DeleteUser),
      }).then(handleResponse<void>),
  },

  // Drill endpoints
  drills: {
    list: (): Promise<DrillDto[]> =>
      fetch(`${BASE_URL}/api/Drill/ListAllDrills/list`).then(handleResponse<DrillDto[]>),

    create: (data: CreateDrill): Promise<DrillDto> =>
      fetch(`${BASE_URL}/api/Drill/CreateDrill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<DrillDto>),

    update: (data: UpdateDrill): Promise<UpdateDrillResponse> =>
      fetch(`${BASE_URL}/api/Drill/UpdateDrill`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<UpdateDrillResponse>),

    delete: (drillId: number): Promise<void> =>
      fetch(`${BASE_URL}/api/Drill/DeleteDrill`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drillId } satisfies DeleteDrill),
      }).then(handleResponse<void>),

    start: (data: StartDrill): Promise<StartDrillResponse> =>
      fetch(`${BASE_URL}/api/Drill/StartDrill/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<StartDrillResponse>),

    stop: (data: StopDrill): Promise<StopDrillResponse> =>
      fetch(`${BASE_URL}/api/Drill/StopDrill/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<StopDrillResponse>),
  },

  // UserDrill endpoints
  userDrills: {
    list: (): Promise<UserDrillDto[]> =>
      fetch(`${BASE_URL}/api/UserDrill/ListAll/list`).then(handleResponse<UserDrillDto[]>),

    active: (): Promise<UserDrillDto[]> =>
      fetch(`${BASE_URL}/api/UserDrill/GetActive/active`).then(handleResponse<UserDrillDto[]>),

    completed: (): Promise<UserDrillDto[]> =>
      fetch(`${BASE_URL}/api/UserDrill/GetCompleted/completed`).then(handleResponse<UserDrillDto[]>),

    delete: (userId: number, drillId: number): Promise<void> =>
      fetch(`${BASE_URL}/api/UserDrill/DeleteUserDrill`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, drillId } satisfies DeleteUserDrill),
      }).then(handleResponse<void>),
  },
};
