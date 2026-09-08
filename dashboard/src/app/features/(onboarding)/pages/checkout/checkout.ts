import { Component, signal } from '@angular/core';
import { OnboardingStep } from '../../../(users)/client/components/onboarding-step/onboarding-step';
import { OnboardingTitle } from '../../../(users)/client/components/onboarding-title/onboarding-title';
import { Order } from '../../../../shared/types/order';
import { UiButton } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-checkout',
  imports: [UiButton, OnboardingTitle, OnboardingStep],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  readonly order = signal<Order | null>(this.loadOrder());

  private loadOrder(): Order | null {
    const stored = localStorage.getItem('pendingOrder');

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as Order;
    } catch {
      localStorage.removeItem('pendingOrder');

      return null;
    }
  }

  getSubtotal(order: Order): number {
    const itemsTotal = order.items.reduce((sum, item) => {
      return sum + item.unit_price_cents * item.quantity;
    }, 0);

    return order.subtotal_cents && order.subtotal_cents > 0 ? order.subtotal_cents : itemsTotal;
  }

  formatPrice(priceCents: number) {
    if (!priceCents || isNaN(priceCents)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(0);
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceCents / 100);
  }

  goToPayment() {
    const url = this.order()?.checkout_url;

    if (!url) {
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
