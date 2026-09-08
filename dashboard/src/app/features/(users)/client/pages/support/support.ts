import { Component, computed, inject, signal } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

import { UiButton } from '../../../../../shared/ui/button/button';

import { AuthState } from '../../../../auth/services/state/auth/auth-state';

import { OnboardingTitle } from '../../components/onboarding-title/onboarding-title';

interface SupportForm {
  email: string;
  problemType: string;
  description: string;
}

interface ProblemType {
  value: string;
  label: string;
  icon: string;
}

const PROBLEM_TYPES: ProblemType[] = [
  {
    value: 'pagamento',
    label: 'Pagamento e assinatura',
    icon: 'lucideCreditCard',
  },
  {
    value: 'perfil',
    label: 'Perfil e personalização',
    icon: 'lucideUser',
  },
  {
    value: 'produto_fisico',
    label: 'Cartão / Tag física',
    icon: 'lucideTag',
  },
  {
    value: 'duvida_geral',
    label: 'Dúvida geral',
    icon: 'lucideFileText',
  },
  {
    value: 'outro',
    label: 'Outro assunto',
    icon: 'lucideTriangleAlert',
  },
];

const WHATSAPP_NUMBER = '5571994027893';

const DESCRIPTION_MIN_LENGTH = 10;

const DESCRIPTION_MAX_LENGTH = 500;

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [NgIcon, UiButton, OnboardingTitle],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support {
  private readonly authState = inject(AuthState);

  readonly problemTypes = signal<ProblemType[]>(PROBLEM_TYPES);

  readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;

  readonly form = signal<SupportForm>({
    email: this.authState.user()?.email ?? '',

    problemType: '',

    description: '',
  });

  readonly isFormValid = computed(() => {
    const { email, problemType, description } = this.form();

    return (
      this.isValidEmail(email) &&
      !!problemType &&
      description.trim().length >= DESCRIPTION_MIN_LENGTH
    );
  });

  readonly descriptionLength = computed(() => this.form().description.length);

  updateField<K extends keyof SupportForm>(field: K, value: SupportForm[K]): void {
    this.form.update((state) => ({
      ...state,
      [field]: value,
    }));
  }

  selectProblemType(value: string): void {
    this.updateField('problemType', value);
  }

  openWhatsApp(): void {
    if (!this.isFormValid()) {
      return;
    }

    const { email, problemType, description } = this.form();

    const problemLabel =
      this.problemTypes().find((type) => type.value === problemType)?.label ?? problemType;

    const userName = this.authState.user()?.full_name ?? '';

    const message = [
      'Olá! Preciso de ajuda com a minha conta Rencard.',
      '',
      `*Nome:* ${userName || 'Não informado'}`,
      `*E-mail:* ${email.trim()}`,
      `*Tipo de problema:* ${problemLabel}`,
      `*Descrição:* ${description.trim()}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}` + `?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  private isValidEmail(email: string): boolean {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  }
}
