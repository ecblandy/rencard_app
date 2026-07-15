import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { NgIcon } from '@ng-icons/core';
import { OnboardingStep } from '../../../(users)/client/components/onboarding-step/onboarding-step';
import { OnboardingTitle } from '../../../(users)/client/components/onboarding-title/onboarding-title';
import { Surface } from '../../../../shared/components/surface/surface';
import { Order } from '../../../../shared/types/order';
import { UiButton } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-checkout',
  imports: [Surface, NgIcon, UiButton, OnboardingTitle, OnboardingStep],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private router = inject(Router);

  readonly order = signal<Order | null>(this.loadOrder());

  private loadOrder(): Order | null {
    const stored = localStorage.getItem('pendingOrder');
    if (!stored) return null;

    try {
      return JSON.parse(stored) as Order;
    } catch {
      return null;
    }
  }

  formatPrice(priceCents: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      priceCents / 100,
    );
  }

  goToPayment() {
    const url = this.order()?.checkout_url;
    if (url) window.open(url, '_blank');
  }
}
