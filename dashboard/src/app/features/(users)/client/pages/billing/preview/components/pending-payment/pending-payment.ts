import { Component, input, output } from '@angular/core';

import { DatePipe } from '@angular/common';

import { NgIcon } from '@ng-icons/core';

import { UiButton } from '../../../../../../../../shared/ui/button/button';

import { Surface } from '../../../../../../../../shared/components/surface/surface';

import { PendingPaymentData } from '../../../../../types/pending-subscription';

@Component({
  selector: 'app-pending-payment',
  standalone: true,
  imports: [NgIcon, UiButton, DatePipe, Surface],
  templateUrl: './pending-payment.html',
  styleUrl: './pending-payment.css',
})
export class PendingPayment {
  readonly data = input.required<PendingPaymentData>();

  readonly payment = output<void>();

  readonly cancel = output<void>();

  readonly hasBillingType = () => {
    const billingType = this.data().billingType;

    if (!billingType) {
      return false;
    }

    const normalized = billingType.trim().toLowerCase();

    return normalized !== 'undefined' && normalized !== 'null' && normalized !== '';
  };

  completePayment(): void {
    this.payment.emit();
  }

  cancelPayment(): void {
    this.cancel.emit();
  }
}
