import { Component, inject, signal } from '@angular/core';
import { form, max, pattern, required, submit, validate, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';

// Components
import { AuthForm } from '../../../../../../shared/components/auth-form/auth-form';
import { UiLabel } from '../../../../../../shared/ui/label/label';
import { UiInput } from '../../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../../shared/ui/button/button';

// Services
import { CepService } from '../../../../../../core/services/cep/cep.service';
import { SignupState } from '../../../../services/state/signup/signup-state';
import { NgxMaskDirective } from 'ngx-mask';

interface SignupAddressForm {
  street: string;
  number: number | null;
  neighborhood: string;
  cep: string;
  complement?: string;
  city: string;
  state: string;
}

@Component({
  selector: 'app-address',
  imports: [AuthForm, UiLabel, UiInput, UiButton, NgxMaskDirective, FormField],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address {
  private router = inject(Router);
  private cepService = inject(CepService);

  private signupState = inject(SignupState);

  signupAddressModel = signal<SignupAddressForm>({
    street: '',
    number: null,
    neighborhood: '',
    cep: '',
    complement: '',
    city: '',
    state: '',
  });

  signupAddressForm = form(this.signupAddressModel, (schemaPath) => {
    required(schemaPath.cep, { message: 'CEP é obrigatório.' });
    pattern(schemaPath.cep, /^\d{8}$/, {
      message: 'CEP inválido.',
    });

    required(schemaPath.city, { message: 'Cidade é obrigatória.' });
    required(schemaPath.number, { message: 'Número é obrigatório.' });
    max(schemaPath.number, 99999, {
      message: 'O número deve ter no máximo 5 dígitos.',
    });

    validate(schemaPath.number, ({ value }) => {
      const val = value();
      return val === null || val <= 0 ? { kind: 'invalid', message: 'Número inválido.' } : null;
    });

    required(schemaPath.street, { message: 'Rua é obrigatória.' });
    required(schemaPath.neighborhood, { message: 'Bairro é obrigatório.' });
    required(schemaPath.state, { message: 'Estado é obrigatório.' });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.signupAddressForm, async () => {
      const address = this.signupAddressModel();

      // ✅ Salva endereço no estado temporário
      this.signupState.setStepData(address);

      // ✅ Navega para step de dados pessoais
      this.router.navigate(['/auth/signup/personal-data']);
    });
  }

  // CEP CHANGE
  onCepChange(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    // opcional: debounce para evitar várias requisições

    console.log('CEP digitado:', cep);

    if (cep.length === 9) {
      // com máscara (00000-000)
      this.cepService.getCep(cep).subscribe((res) => {
        this.signupAddressModel.update((v) => ({
          ...v,
          city: res.localidade,
          state: res.uf,
          street: res.logradouro,
          neighborhood: res.bairro,
        }));
      });
    }
  }
}
