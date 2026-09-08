import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { form, min, minLength, required, submit } from '@angular/forms/signals';
import { toast } from 'ngx-sonner';

import { DashboardTitle } from '../dashboard-title/dashboard-title';
import { Surface } from '../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../surface-title/surface-title';
import { UiLabel } from '../../../../shared/ui/label/label';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiButton } from '../../../../shared/ui/button/button';
import { Loader } from '../../../../shared/components/loader/loader';

import { Auth } from '../../../auth/services/facade/auth';
import { CepService } from '../../../../core/services/cep/cep.service';
import { formatErrorList } from '../../../../shared/utils/format-error';

interface AddressModel {
  cep: string;
  city: string;
  neighborhood: string;
  complement: string;
  street: string;
  number: number | null;
  state: string;
}

@Component({
  selector: 'app-address-form',
  imports: [DashboardTitle, Surface, SurfaceTitle, UiLabel, UiInput, UiButton, Loader],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css',
})
export class AddressForm {
  private readonly authService = inject(Auth);
  private readonly cepService = inject(CepService);

  isInitialLoading = signal(true);

  addressModel = signal<AddressModel>({
    cep: '',
    city: '',
    neighborhood: '',
    complement: '',
    street: '',
    number: null,
    state: '',
  });

  addressForm = form(this.addressModel, (schema) => {
    required(schema.cep, {
      message: 'CEP é obrigatório',
    });

    minLength(schema.cep, 8, {
      message: 'CEP deve ter 8 caracteres',
    });

    required(schema.street, {
      message: 'Rua é obrigatória',
    });

    required(schema.number, {
      message: 'Número é obrigatório',
    });

    min(schema.number, 1, {
      message: 'Número deve ser positivo',
    });

    required(schema.neighborhood, {
      message: 'Bairro é obrigatório',
    });

    required(schema.city, {
      message: 'Cidade é obrigatória',
    });

    required(schema.state, {
      message: 'Estado é obrigatório',
    });
  });

  ngOnInit() {
    this.authService.loadUser().subscribe({
      next: (user) => {
        if (!user) {
          return;
        }

        this.addressModel.set({
          cep: user.cep || '',
          city: user.city || '',
          neighborhood: user.neighborhood || '',
          complement: user.complement || '',
          street: user.street || '',
          number: user.number ? Number(user.number) : null,
          state: user.state || '',
        });
      },

      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
        this.isInitialLoading.set(false);
      },

      complete: () => {
        this.isInitialLoading.set(false);
      },
    });
  }

  async onCepChange(event: Event) {
    const input = event.target as HTMLInputElement;

    const cep = input.value.replace(/\D/g, '');

    if (cep.length !== 8) {
      return;
    }

    try {
      const res = await firstValueFrom(this.cepService.getCep(cep));

      this.addressModel.update((value) => ({
        ...value,

        city: res.localidade || '',
        state: res.uf || '',
        street: res.logradouro || '',
        neighborhood: res.bairro || '',
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.addressForm, async () => {
      const payload = this.addressModel();

      console.log('Enviando endereço:', payload);

      const loadingToast = toast.loading('Atualizando seus dados...');

      try {
        await firstValueFrom(this.authService.updateUser(payload));

        toast.success('Dados atualizados', {
          description: 'Seu endereço foi atualizado com sucesso.',
          id: loadingToast,
        });
      } catch (err: any) {
        const backendError = err?.error ?? err;

        const errorMessages = formatErrorList(backendError);

        toast.error('Não foi possível atualizar', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      }
    });
  }
}
