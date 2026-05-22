import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { SessionInitializer } from './session-initializer';

export const sessionResolver: ResolveFn<void> = () => {
  const session = inject(SessionInitializer);
  return session.init();
};
