import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  email,
  form,
  minLength,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';

// Components
import { AuthForm } from '../../../../../../shared/components/auth-form/auth-form';
import { UiLabel } from '../../../../../../shared/ui/label/label';
import { UiInput } from '../../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../../shared/ui/button/button';

// Services
import { SignupState } from '../../../../services/state/signup/signup-state';
import { firstValueFrom } from 'rxjs';
import { UserRegistration } from '../../../../../../shared/types/user.model';
import { Auth } from '../../../../services/facade/auth';
import { toast } from 'ngx-sonner';
import { formatErrorList } from '../../../../../../shared/utils/format-error';
import { PaymentService } from '../../../../../(onboarding)/services/facade/payment.service';

interface SignupPersonalForm {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  terms_accepted: boolean;
  cpf_cnpj: string;
}

@Component({
  selector: 'app-personal-data',
  imports: [AuthForm, UiLabel, UiInput, UiButton, RouterLink],
  templateUrl: './personal-data.html',
  styleUrl: './personal-data.css',
})
export class PersonalData {
  private router = inject(Router);
  private auth = inject(Auth);
  private signupState = inject(SignupState);
  private readonly persisted = this.signupState.data();
  private readonly PaymentService = inject(PaymentService);

  temporaryCart = signal<any | null>(null);

  signupPersonalModel = signal<SignupPersonalForm>({
    full_name: this.persisted.full_name ?? '',
    email: this.persisted.email ?? '',
    password: this.persisted.password ?? '',
    phone_number: this.persisted.phone_number ?? '',
    terms_accepted: this.persisted.terms_accepted ?? false,
    cpf_cnpj: this.persisted.cpf_cnpj ?? '',
  });
  signupPersonalForm = form(this.signupPersonalModel, (schemaPath) => {
    required(schemaPath.full_name, { message: 'O campo de nome é obrigatório.' });

    required(schemaPath.email, { message: 'O e-mail é obrigatório.' });
    email(schemaPath.email, { message: 'Insira um endereço de e-mail válido.' });

    required(schemaPath.password, { message: 'Senha é obrigatória.' });
    minLength(schemaPath.password, 8, { message: 'A senha deve ter pelo menos 8 caracteres.' });

    validate(schemaPath.terms_accepted, ({ value }) => {
      return value() ? null : { kind: 'required', message: 'Você deve aceitar os termos.' };
    });

    required(schemaPath.phone_number, { message: 'O telefone é obrigatório.' });
    pattern(schemaPath.phone_number, /^\d{10,11}$/, {
      message: 'Insira um número de telefone válido (somente números).',
    });

    required(schemaPath.cpf_cnpj, { message: 'CPF ou CNPJ é obrigatório.' });
    pattern(schemaPath.cpf_cnpj, /^\d{11}$|^\d{14}$/, {
      message: 'Insira um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.',
    });
  });

  toggleTerms(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.signupPersonalModel.update((v) => ({ ...v, terms_accepted: checked }));
  }

  // só valida que o carrinho ainda existe antes de permitir o cadastro
  loadTempCart() {
    const temporaryCart = JSON.parse(localStorage.getItem('temporaryCart') ?? 'null');

    if (!temporaryCart?.id) {
      toast.error('Carrinho temporário não encontrado. Por favor, refaça o processo de compra.');
      this.router.navigate(['/onboarding/products']);
      return;
    }

    this.PaymentService.getTemporaryCartById(temporaryCart.id).subscribe({
      next: (response) => this.temporaryCart.set(response),
      error: () => {
        toast.error('Carrinho temporário inválido ou expirado. Por favor, refaça a compra.');
        this.router.navigate(['/onboarding/products']);
      },
    });
  }

  constructor() {
    this.loadTempCart();
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.signupPersonalForm, async () => {
      const personalData = this.signupPersonalModel();
      this.signupState.setStepData(personalData);
      const payload = this.signupState.data() as UserRegistration;

      const cart = this.temporaryCart();
      if (!cart) {
        toast.error('Carrinho temporário não encontrado.');
        return;
      }

      const loadingToast = toast.loading('Enviando cadastro...');

      try {
        // Cria usuário — carrinho continua salvo no localStorage,
        // será usado pelo confirm-email pra criar a ordem depois
        await firstValueFrom(this.auth.register(payload));

        this.signupState.clear();

        toast.success('Cadastro realizado!', {
          description: 'Confirme seu e-mail para concluir o pedido.',
          id: loadingToast,
        });

        this.router.navigate(['/auth/confirm-email']);
      } catch (err: any) {
        const backendError = err?.error ?? err;
        const errorMessages = formatErrorList(backendError);

        toast.error('Ops, algo deu errado!', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      }
    });
  }
}
