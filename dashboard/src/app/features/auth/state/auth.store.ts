import { signal } from '@angular/core';
import { User } from '../../../shared/types/user.model';

export const authStore = {
  accessToken: signal<string | null>(null),
  user: signal<User | null>(null),
  initialized: signal(false),
};
