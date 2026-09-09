import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  FormField,
  debounce,
  email,
  form,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { Modal } from '../../../../../shared/ui/modal/modal';
import { UiInput } from '../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../shared/ui/button/button';

import { AdminService } from '../../services/facade/admin.service';

import {
  AffiliateCreatePayload,
  AffiliateCreateResponse,
  PixKeyType,
} from '../../types/affiliate-model';

import { CepService } from '../../../../../core/services/cep/cep.service';

interface AffiliateFormModel {
  full_name: string;
  email: string;
  terms_accepted: boolean;

  cpf_cnpj: string;
  phone_number: string;

  street: string;
  number: string;
  neighborhood: string;
  cep: string;
  complement: string;
  city: string;
  state: string;
  country: string;

  affiliate_active: boolean;

  pix_key: string;
  pix_key_type: PixKeyType;
  pix_owner_name: string;
}

function initialAffiliateModel(): AffiliateFormModel {
  return {
    full_name: '',
    email: '',
    terms_accepted: false,

    cpf_cnpj: '',
    phone_number: '',

    street: '',
    number: '',
    neighborhood: '',
    cep: '',
    complement: '',
    city: '',
    state: '',
    country: 'BR',

    affiliate_active: true,

    pix_key: '',
    pix_key_type: 'email',
    pix_owner_name: '',
  };
}

@Component({
  selector: 'app-create-partner',
  imports: [Modal, UiInput, UiButton, FormField],
  templateUrl: './create-partner.html',
  styleUrl: './create-partner.css',
})
export class CreatePartner {
  private readonly adminService = inject(AdminService);
  private readonly cepService = inject(CepService);

  // ============================================================
  // INPUT / OUTPUT
  // ============================================================

  isOpen = input(false);

  close = output<void>();

  created = output<AffiliateCreateResponse>();

  // ============================================================
  // MODEL
  // ============================================================

  protected readonly affiliateModel = signal<AffiliateFormModel>(initialAffiliateModel());

  // ============================================================
  // FORM
  // ============================================================

  protected readonly affiliateForm = form(this.affiliateModel, (schemaPath) => {
    // --------------------------------------------------------
    // DADOS DO AFILIADO
    // --------------------------------------------------------

    required(schemaPath.full_name, {
      message: 'Nome completo é obrigatório',
    });

    required(schemaPath.email, {
      message: 'E-mail é obrigatório',
    });

    email(schemaPath.email, {
      message: 'Digite um e-mail válido',
    });

    required(schemaPath.cpf_cnpj, {
      message: 'CPF/CNPJ é obrigatório',
    });

    required(schemaPath.phone_number, {
      message: 'Telefone é obrigatório',
    });

    // --------------------------------------------------------
    // ENDEREÇO
    // --------------------------------------------------------

    required(schemaPath.street, {
      message: 'Rua é obrigatória',
    });

    required(schemaPath.number, {
      message: 'Número é obrigatório',
    });

    required(schemaPath.neighborhood, {
      message: 'Bairro é obrigatório',
    });

    required(schemaPath.cep, {
      message: 'CEP é obrigatório',
    });

    pattern(schemaPath.cep, /^\d{5}-?\d{3}$/, {
      message: 'CEP inválido',
    });

    required(schemaPath.city, {
      message: 'Cidade é obrigatória',
    });

    required(schemaPath.state, {
      message: 'Estado é obrigatório',
    });

    required(schemaPath.country, {
      message: 'País é obrigatório',
    });

    // --------------------------------------------------------
    // PIX
    // --------------------------------------------------------

    required(schemaPath.pix_key, {
      message: 'Chave PIX é obrigatória',
    });

    required(schemaPath.pix_owner_name, {
      message: 'Nome do titular é obrigatório',
    });

    // --------------------------------------------------------
    // TERMOS
    // --------------------------------------------------------

    validate(schemaPath.terms_accepted, ({ value }) =>
      value()
        ? undefined
        : {
            kind: 'terms_required',
            message: 'É necessário aceitar os termos para continuar',
          },
    );

    // --------------------------------------------------------
    // CEP
    // --------------------------------------------------------

    debounce(schemaPath.cep, 500);
  });

  // ============================================================
  // ESTADOS
  // ============================================================

  protected readonly isSubmitting = signal(false);

  protected readonly submitError = signal<string | null>(null);

  protected readonly isLoadingCep = signal(false);

  protected readonly cepError = signal<string | null>(null);

  /**
   * Último CEP que já foi consultado com sucesso.
   *
   * Isso evita que o effect faça novas requisições
   * quando o preenchimento automático do endereço
   * altera o affiliateModel.
   */
  protected readonly lastSearchedCep = signal<string | null>(null);

  // ============================================================
  // MÁSCARAS
  // ============================================================

  protected readonly pixKeyMask = computed(() => {
    const type = this.affiliateModel().pix_key_type;

    switch (type) {
      case 'cpf':
        return '000.000.000-00';

      case 'cnpj':
        return '00.000.000/0000-00';

      case 'phone':
        return '(00) 00000-0000||(00) 0000-0000';

      case 'email':
      case 'random':
      default:
        return undefined;
    }
  });

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    /**
     * Quando o modal abrir, reseta completamente
     * o formulário e os estados auxiliares.
     */
    effect(() => {
      if (this.isOpen()) {
        this.affiliateModel.set(initialAffiliateModel());

        this.submitError.set(null);
        this.cepError.set(null);
        this.isLoadingCep.set(false);
        this.lastSearchedCep.set(null);
      }
    });

    /**
     * Observa o CEP.
     *
     * A máscara exibe:
     *
     * 12345-678
     *
     * mas aqui trabalhamos somente com:
     *
     * 12345678
     *
     * Quando o CEP já tiver sido consultado,
     * não faz uma nova requisição.
     */
    effect(() => {
      const cep = this.affiliateModel().cep;

      const cleanCep = cep.replace(/\D/g, '');

      /**
       * Enquanto não tiver 8 dígitos,
       * não pesquisa.
       */
      if (cleanCep.length !== 8) {
        this.cepError.set(null);
        this.lastSearchedCep.set(null);
        return;
      }

      /**
       * Evita consultar o mesmo CEP novamente.
       */
      if (this.lastSearchedCep() === cleanCep) {
        return;
      }

      /**
       * Marca imediatamente como processado
       * para impedir execuções duplicadas
       * enquanto o endereço é preenchido.
       */
      this.lastSearchedCep.set(cleanCep);

      void this.searchCep(cleanCep);
    });
  }

  // ============================================================
  // BUSCAR CEP
  // ============================================================

  private async searchCep(cep: string): Promise<void> {
    /**
     * Proteção adicional contra chamadas simultâneas.
     */
    if (this.isLoadingCep()) {
      return;
    }

    console.log('📍 Buscando CEP:', cep);

    this.isLoadingCep.set(true);
    this.cepError.set(null);

    try {
      const response = await firstValueFrom(this.cepService.getCep(cep));

      console.log('📍 Resposta do ViaCEP:', response);

      /**
       * CEP não encontrado.
       */
      if (response.erro) {
        this.cepError.set('CEP não encontrado.');

        /**
         * Permite tentar novamente o mesmo CEP.
         */
        this.lastSearchedCep.set(null);

        return;
      }

      /**
       * Preenche automaticamente o endereço.
       */
      this.affiliateModel.update((current) => ({
        ...current,

        street: response.logradouro || current.street,

        neighborhood: response.bairro || current.neighborhood,

        city: response.localidade || current.city,

        state: response.uf || current.state,

        complement: response.complemento || current.complement,
      }));

      console.log('✅ Endereço preenchido automaticamente.');
    } catch (error) {
      console.error('❌ Erro ao consultar CEP:', error);

      this.cepError.set('Não foi possível consultar o CEP.');

      /**
       * Como a consulta falhou,
       * permite tentar novamente.
       */
      this.lastSearchedCep.set(null);
    } finally {
      this.isLoadingCep.set(false);
    }
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.isSubmitting()) {
      return;
    }

    submit(this.affiliateForm, async () => {
      this.isSubmitting.set(true);
      this.submitError.set(null);

      try {
        const payload = this.buildPayload();

        console.log('📤 Payload do afiliado:', payload);

        const created = await firstValueFrom(this.adminService.registerAffiliate(payload));

        console.log('✅ Afiliado cadastrado:', created);

        this.created.emit(created);

        this.onClose();
      } catch (error) {
        console.error('❌ Erro ao cadastrar afiliado:', error);

        this.handleSubmitError(error);
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  // ============================================================
  // ERRO DO BACKEND
  // ============================================================

  private handleSubmitError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      console.error('❌ Status HTTP:', error.status);

      console.error('❌ Resposta da API:', error.error);

      /**
       * Erro:
       *
       * {
       *   "detail": "..."
       * }
       */
      if (
        error.error &&
        typeof error.error === 'object' &&
        typeof error.error.detail === 'string'
      ) {
        this.submitError.set(error.error.detail);

        return;
      }

      /**
       * Erros por campo:
       *
       * {
       *   "email": ["..."],
       *   "cpf_cnpj": ["..."]
       * }
       */
      if (error.error && typeof error.error === 'object') {
        const messages: string[] = [];

        for (const [field, value] of Object.entries(error.error)) {
          if (Array.isArray(value)) {
            messages.push(`${field}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            messages.push(`${field}: ${value}`);
          }
        }

        if (messages.length > 0) {
          this.submitError.set(messages.join(' | '));

          return;
        }
      }

      // --------------------------------------------------------
      // STATUS HTTP
      // --------------------------------------------------------

      if (error.status === 400) {
        this.submitError.set('Os dados enviados são inválidos. Verifique os campos.');

        return;
      }

      if (error.status === 401) {
        this.submitError.set('Sua sessão expirou. Faça login novamente.');

        return;
      }

      if (error.status === 403) {
        this.submitError.set('Você não tem permissão para cadastrar parceiros.');

        return;
      }

      if (error.status === 409) {
        this.submitError.set('Já existe um usuário com esses dados.');

        return;
      }

      if (error.status >= 500) {
        this.submitError.set('O servidor apresentou um erro. Tente novamente.');

        return;
      }
    }

    this.submitError.set(
      'Não foi possível cadastrar o afiliado. Verifique os dados e tente novamente.',
    );
  }

  // ============================================================
  // PAYLOAD
  // ============================================================

  private buildPayload(): AffiliateCreatePayload {
    const value = this.affiliateModel();

    return {
      full_name: value.full_name.trim(),

      email: value.email.trim(),

      terms_accepted: value.terms_accepted,

      /**
       * Remove máscara do CPF/CNPJ.
       */
      cpf_cnpj: value.cpf_cnpj.replace(/\D/g, ''),

      /**
       * Remove máscara do telefone.
       */
      phone_number: value.phone_number.replace(/\D/g, ''),

      street: value.street.trim(),

      number: value.number.trim(),

      neighborhood: value.neighborhood.trim(),

      /**
       * Remove o hífen do CEP.
       */
      cep: value.cep.replace(/\D/g, ''),

      complement: value.complement.trim(),

      city: value.city.trim(),

      state: value.state.trim(),

      country: value.country.trim(),

      affiliate_active: value.affiliate_active,

      /**
       * Remove espaços externos,
       * mas mantém o conteúdo da chave.
       */
      pix_key: value.pix_key.trim(),

      pix_key_type: value.pix_key_type,

      pix_owner_name: value.pix_owner_name.trim(),
    };
  }

  // ============================================================
  // FECHAR MODAL
  // ============================================================

  onClose(): void {
    this.close.emit();
  }
}
