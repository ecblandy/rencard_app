import { computed, Injectable, signal } from '@angular/core';
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '../../../../../shared/utils/localStorage.util';
import { User } from '../../../../../shared/types/user.model';

@Injectable({
  providedIn: 'root',
})
export class SignupState {
  private readonly _state = signal<Partial<User>>(
    getFromStorage<Partial<User>>('signup_state') ?? {},
  );

  readonly data = computed(() => this._state());

  setStepData(stepData: Partial<User>) {
    this._state.update((current) => ({
      ...current,
      ...stepData,
    }));

    saveToStorage('signup_state', this._state());
  }

  clear() {
    this._state.set({});
    removeFromStorage('signup_state');
  }
}
