// User Types
export interface UserDto {
  id: number;
  email: string | null;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface CreateUser {
  email?: string | null;
  firstName: string;
  lastName: string;
}

export interface UpdateUser {
  userId: number;
  email?: string | null;
  firstName: string;
  lastName: string;
}

export interface DeleteUser {
  userId: number;
}

export interface UpdateUserResponse {
  user: UserDto;
}

// Drill Types
export interface DrillDto {
  id: number;
  title: string;
  pricePerMinute: number;
  createdAt: string;
  users: UserDrillDto[];
}

export interface CreateDrill {
  title: string;
  pricePerMinute: number;
}

export interface UpdateDrill {
  drillId: number;
  title: string;
  pricePerMinute: number;
}

export interface DeleteDrill {
  drillId: number;
}

export interface UpdateDrillResponse {
  drill: DrillDto;
}

export interface StartDrill {
  drillId: number;
  userIds: number[];
}

export interface StopDrill {
  drillId: number;
  userIds: number[];
}

export interface StartDrillResponse {
  drill: DrillDto;
}

export interface StopDrillResponse {
  drill: DrillDto;
}

// UserDrill Types
export interface UserDrillDto {
  id: number;
  userId: number;
  drillId: number;
  startedAt: string | number; // Unix timestamp (seconds) or ISO string
  stoppedAt: string | number | null; // Unix timestamp (seconds) or ISO string
  user: UserDto;
  drill: Omit<DrillDto, 'users'>;
}

export interface DeleteUserDrill {
  userId: number;
  drillId: number;
}
