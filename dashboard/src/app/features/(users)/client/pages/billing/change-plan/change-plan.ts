import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from '../../../../../auth/services/state/auth/auth-state';
import { NgIcon } from "@ng-icons/core";
import { Loader } from "../../../../../../shared/components/loader/loader";
import { OnboardingTitle } from "../../../components/onboarding-title/onboarding-title";
import { UiButton } from "../../../../../../shared/ui/button/button";

interface Plan {
  id: number;
  type: 'galera' | 'pro';
  name: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-change-plan',
  imports: [
    NgIcon,
    Loader,
    OnboardingTitle,
    UiButton
],
  templateUrl: './change-plan.html',
  styleUrl: './change-plan.css',
})
export class ChangePlan {
  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);

  readonly isInitialLoading = signal(false);

  readonly plans = signal<Plan[]>([
    {
      id: 1,
      type: 'galera',
      name: 'Rencard da Galera',
      description: 'Para iniciar novas conexões de forma simples e prática.',
      features: [
        'Informações concentradas em um só lugar',
        'Moderno e tecnológico',
        'Suas redes sociais de forma mais interativa (Até 10 redes)',
        'Link personalizado',
        'Música - Sua vibe, em um toque.',
      ],
    },
    {
      id: 2,
      type: 'pro',
      name: 'Rencard Pro',
      description: 'Para quem quer ir além e explorar todos os recursos.',
      features: [
        'Tudo do plano Galera',
        'Redes sociais ilimitadas',
        'Portfólio de imagens e vídeos',
        'Estatísticas avançadas (Google Analytics)',
        'Suporte prioritário',
      ],
    },
  ]);

  readonly currentPlanType = computed(() => this.authState.user()?.active_plan?.type ?? null);

  readonly currentPlan = computed(
    () => this.plans().find((p) => p.type === this.currentPlanType()) ?? null,
  );

  choosePlan(plan: Plan) {
    if (this.currentPlan()?.id === plan.id) return;

    // TODO: chamar API de troca/checkout de plano
    // ao concluir com sucesso, redirecionar ou atualizar o authState
    console.log('Trocar para o plano:', plan);
  }
}
