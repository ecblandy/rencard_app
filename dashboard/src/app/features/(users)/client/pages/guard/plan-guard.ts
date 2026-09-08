import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../../../../auth/services/state/auth/auth-state';

export const hasActivePlanGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  const user = authState.user();

  if (user?.active_plan) {
    return true;
  }

  return router.createUrlTree(['/client/billing/preview']);
};
