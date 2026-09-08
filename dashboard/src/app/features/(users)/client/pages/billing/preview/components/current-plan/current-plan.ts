import { Component, computed, input, output, signal } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

import { UiButton } from '../../../../../../../../shared/ui/button/button';
import { Surface } from '../../../../../../../../shared/components/surface/surface';
import { LocalDatePipe } from '../../../../../../../../shared/pipes/local-date.pipe.ts-pipe';

@Component({
  selector: 'app-current-plan',
  standalone: true,
  imports: [NgIcon, UiButton, Surface, LocalDatePipe],
  templateUrl: './current-plan.html',
  styleUrl: './current-plan.css',
})
export class CurrentPlan {
  readonly data = input.required<any>();

  readonly selectPlan = output<void>();
  readonly changePlan = output<void>();
  readonly renew = output<void>();
  readonly cancelSubscription = output<void>();

  readonly isCancellationModalOpen = signal(false);

  // =========================================================
  // EXPIRAÇÃO
  // =========================================================

  readonly expirationDate = computed<Date | null>(() => {
    const value = this.data()?.endDate;

    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  });

  // =========================================================
  // MODAL
  // =========================================================

  openCancellationModal(): void {
    this.isCancellationModalOpen.set(true);
  }

  closeCancellationModal(): void {
    this.isCancellationModalOpen.set(false);
  }

  confirmCancellation(): void {
    this.closeCancellationModal();

    this.cancelSubscription.emit();
  }
}
