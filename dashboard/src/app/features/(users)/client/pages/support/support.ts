import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Surface } from '../../../../../shared/components/surface/surface';
import { UiButton } from '../../../../../shared/ui/button/button';
import { AuthState } from '../../../../auth/services/state/auth/auth-state';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
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
  { value: 'pagamento', label: 'Pagamento e assinatura', icon: 'lucideCreditCard' },
  { value: 'perfil', label: 'Perfil e personalização', icon: 'lucideUser' },
  { value: 'produto_fisico', label: 'Cartão / Tag física', icon: 'lucideTag' },
  { value: 'duvida_geral', label: 'Dúvida geral', icon: 'lucideFileText' },
  { value: 'outro', label: 'Outro assunto', icon: 'lucideTriangleAlert' },
];

const WHATSAPP_NUMBER = '5571994027893'; // TODO: número real do suporte
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 500;

@Component({
  selector: 'app-support',
  imports: [NgIcon, UiButton, OnboardingTitle],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support {
  private readonly authState = inject(AuthState);

  readonly problemTypes = signal(PROBLEM_TYPES);
  readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;

  readonly form = signal<SupportForm>({
    email: this.authState.user()?.email ?? '',
    problemType: '',
    description: '',
  });

  readonly isFormValid = computed(() => {
    const { email, problemType, description } = this.form();
    return !!email.trim() && !!problemType && description.trim().length >= DESCRIPTION_MIN_LENGTH;
  });

  readonly descriptionLength = computed(() => this.form().description.length);

  updateField<K extends keyof SupportForm>(field: K, value: SupportForm[K]) {
    this.form.update((state) => ({ ...state, [field]: value }));
  }

  selectProblemType(value: string) {
    this.updateField('problemType', value);
  }

  openWhatsApp() {
    if (!this.isFormValid()) return;

    const { email, problemType, description } = this.form();
    const problemLabel =
      this.problemTypes().find((t) => t.value === problemType)?.label ?? problemType;
    const userName = this.authState.user()?.full_name ?? '';

    const message = [
      `Olá! Preciso de ajuda com a minha conta Rencard.`,
      ``,
      `*Nome:* ${userName}`,
      `*E-mail:* ${email}`,
      `*Tipo de problema:* ${problemLabel}`,
      `*Descrição:* ${description}`,
    ].join('\n');

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
