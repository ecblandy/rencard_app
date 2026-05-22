import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../../../../../shared/types/order';
import { Surface } from "../../../../../../../shared/components/surface/surface";
import { NgIcon } from "@ng-icons/core";
import { UiButton } from "../../../../../../../shared/ui/button/button";
import { OnboardingTitle } from "../../../../components/onboarding-title/onboarding-title";
import { OnboardingStep } from "../../../../components/onboarding-step/onboarding-step";

@Component({
  selector: 'app-checkout',
  imports: [Surface, NgIcon, UiButton, OnboardingTitle, OnboardingStep],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private router = inject(Router);

  readonly order = signal<Order | null>(
    this.router.getCurrentNavigation()?.extras.state?.['order'] ?? null,
  );

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
