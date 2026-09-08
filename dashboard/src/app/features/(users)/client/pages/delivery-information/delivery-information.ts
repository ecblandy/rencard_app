import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ProfileModel } from '../../../../../shared/types/profile-model';
import { Auth } from '../../../../auth/services/facade/auth';

@Component({
  selector: 'app-delivery-information',
  standalone: true,
  templateUrl: './delivery-information.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryInformation implements OnInit {
  private readonly auth = inject(Auth);

  // =========================================================
  // PROFILE
  // =========================================================

  readonly profile = signal<ProfileModel | null>(null);

  readonly loading = signal(true);

  readonly error = signal(false);

  // =========================================================
  // PHYSICAL ITEM
  // =========================================================

  readonly physicalItem = computed(() => {
    return this.profile()?.physical_items?.[0] ?? null;
  });

  // =========================================================
  // STATUS
  // =========================================================

  readonly status = computed(() => {
    const status = this.physicalItem()?.status?.toLowerCase();

    switch (status) {
      case 'em produção':
      case 'em producao':
        return {
          label: 'Em produção',
          description: 'Seu cartão está sendo produzido e em breve estará pronto para envio.',
        };

      case 'enviado':
        return {
          label: 'Enviado',
          description: 'Seu cartão já foi enviado e está a caminho do endereço cadastrado.',
        };

      case 'entregue':
        return {
          label: 'Entregue',
          description: 'Seu cartão foi entregue no endereço cadastrado.',
        };

      case 'cancelado':
        return {
          label: 'Cancelado',
          description: 'Este pedido foi cancelado.',
        };

      case 'pedido realizado':
        return {
          label: 'Pedido realizado',
          description: 'Seu pedido foi recebido e está sendo preparado.',
        };

      default:
        return {
          label: 'Processando',
          description: 'Estamos preparando seu pedido.',
        };
    }
  });

  // =========================================================
  // CURRENT STEP
  // =========================================================

  readonly currentStep = computed(() => {
    const status = this.physicalItem()?.status?.toLowerCase();

    switch (status) {
      case 'pedido realizado':
        return 1;

      case 'em produção':
      case 'em producao':
        return 2;

      case 'enviado':
        return 3;

      case 'entregue':
        return 4;

      default:
        return 1;
    }
  });

  // =========================================================
  // CEP
  // =========================================================

  readonly formattedCep = computed(() => {
    const cep = this.profile()?.cep;

    if (!cep) {
      return '';
    }

    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  });

  // =========================================================
  // DELIVERY DATE
  // =========================================================

  readonly formattedDeliveryDate = computed(() => {
    const date = this.physicalItem()?.delivery_preview_date;

    if (!date) {
      return null;
    }

    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
    }).format(new Date(date));
  });

  // =========================================================
  // TRACKING
  // =========================================================

  readonly hasTracking = computed(() => {
    return Boolean(this.physicalItem()?.shipping_code?.trim());
  });

  // =========================================================
  // DELIVERY DATE EXISTS
  // =========================================================

  readonly hasDeliveryDate = computed(() => {
    return Boolean(this.physicalItem()?.delivery_preview_date);
  });

  // =========================================================
  // ADDRESS
  // =========================================================

  readonly address = computed(() => {
    const profile = this.profile();

    if (!profile) {
      return {
        firstLine: '',
        complement: '',
        secondLine: '',
        cep: '',
      };
    }

    return {
      firstLine: `${profile.street}, ${profile.number}`,
      complement: profile.complement,
      secondLine: `${profile.neighborhood} · ${profile.city} - ${profile.state}`,
      cep: this.formattedCep(),
    };
  });

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadUser();
  }

  // =========================================================
  // LOAD USER
  // =========================================================

  private loadUser(): void {
    this.loading.set(true);
    this.error.set(false);

    console.log('[DeliveryInformation] chamando Auth.loadUser()');

    this.auth.loadUser().subscribe({
      next: (profile) => {
        console.log('[DeliveryInformation] dados recebidos:', profile);

        this.profile.set(profile as unknown as ProfileModel);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('[DeliveryInformation] erro ao carregar usuário:', error);

        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // =========================================================
  // STEP
  // =========================================================

  isStepCompleted(step: number): boolean {
    return this.currentStep() >= step;
  }
}
