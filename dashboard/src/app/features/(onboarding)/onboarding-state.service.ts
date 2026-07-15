import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OnboardingStateService {
  readonly plan = signal<string | null>(null);

  setPlan(plan: string): void {
    this.plan.set(plan);
  }

  getPlan(): string | null {
    return this.plan();
  }
}
