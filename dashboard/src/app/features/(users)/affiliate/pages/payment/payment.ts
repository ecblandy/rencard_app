import { Component, computed, effect, inject, signal } from '@angular/core';
import { Surface } from '../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { UiLabel } from '../../../../../shared/ui/label/label';
import { UiInput } from '../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../shared/ui/button/button';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../../auth/services/facade/auth';
import { formatErrorList } from '../../../../../shared/utils/format-error';
import { NgIcon } from '@ng-icons/core';
import { Loader } from '../../../../../shared/components/loader/loader';

interface PaymentModel {
  pix_key_type: string;
  pix_key: string;
  pix_owner_name: string;
}

@Component({
  selector: 'app-payment',
  imports: [
    Surface,
    SurfaceTitle,
    DashboardTitle,
    UiLabel,
    UiInput,
    UiButton,
    FormField,
    NgIcon,
    Loader,
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  private readonly authService = inject(Auth);
  isLoadingPixData = signal(true);
  pixKeyTypes = [
    { value: '', label: 'Selecione o tipo de chave' },
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telefone' },
    { value: 'random', label: 'Chave Aleatória' },
  ];

  pixKeyMasks: Record<string, string> = {
    cpf: '000.000.000-00',
    cnpj: '00.000.000/0000-00',
    phone: '(00) 00000-0000',
    random: 'SSSSSSSS-SSSS-SSSS-SSSS-SSSSSSSSSSSS', // Máscara para UUID (S = caractere alfanumérico)
  };

  pixKeyPlaceholders: Record<string, string> = {
    cpf: '000.000.000-00',
    cnpj: '00.000.000/0000-00',
    email: 'seu@email.com',
    phone: '(00) 00000-0000',
    random: '12345678-1234-1234-1234-123456789012',
  };

  maskValue = signal<string | undefined>(undefined);
  inputType = signal<'text' | 'email'>('text');
  placeholder = signal('Selecione o tipo de chave primeiro');

  // Computed para verificar se tem tipo selecionado
  hasPixKeyType = computed(() => {
    return this.paymentForm.pix_key_type().value() !== '';
  });

  paymentModel = signal<PaymentModel>({
    pix_key_type: '',
    pix_key: '',
    pix_owner_name: '',
  });

  paymentForm = form(this.paymentModel, (schema) => {
    // Validação do tipo de chave
    required(schema.pix_key_type, { message: 'Selecione o tipo de chave' });

    // Validação da chave PIX
    required(schema.pix_key, { message: 'Chave PIX é obrigatória' });

    // Validação adicional baseada no tipo
    validate(schema.pix_key, ({ value, valueOf }) => {
      const type = valueOf(schema.pix_key_type);
      const pixKey = value();

      if (!pixKey || !type) return undefined;

      switch (type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(pixKey)) {
            return { kind: 'email-invalid', message: 'Email inválido' };
          }
          break;

        case 'cpf':
          const cpfClean = pixKey.replace(/\D/g, '');
          if (cpfClean.length !== 11) {
            return { kind: 'cpf-incomplete', message: 'CPF incompleto' };
          }
          break;

        case 'cnpj':
          const cnpjClean = pixKey.replace(/\D/g, '');
          if (cnpjClean.length !== 14) {
            return { kind: 'cnpj-incomplete', message: 'CNPJ incompleto' };
          }
          break;

        case 'phone':
          const phoneClean = pixKey.replace(/\D/g, '');
          if (phoneClean.length < 10 || phoneClean.length > 11) {
            return {
              kind: 'phone-invalid',
              message: 'Telefone deve ter 10 ou 11 dígitos',
            };
          }
          break;

        case 'random':
          // Remove hífens para validar
          const randomClean = pixKey.replace(/-/g, '');
          if (randomClean.length !== 32) {
            return {
              kind: 'random-incomplete',
              message: 'Chave aleatória incompleta',
            };
          }
          // Valida se é alfanumérico
          if (!/^[a-f0-9]{32}$/i.test(randomClean)) {
            return {
              kind: 'random-invalid',
              message: 'Chave aleatória inválida (deve conter apenas letras e números)',
            };
          }
          break;
      }

      return undefined;
    });

    // Validação do nome do titular
    required(schema.pix_owner_name, { message: 'Nome do titular é obrigatório' });

    validate(schema.pix_owner_name, ({ value }) => {
      const name = value();

      if (!name) return undefined;

      if (name.trim().length < 3) {
        return {
          kind: 'name-too-short',
          message: 'Nome deve ter pelo menos 3 caracteres',
        };
      }

      // Verifica se tem pelo menos nome e sobrenome
      if (!name.trim().includes(' ')) {
        return {
          kind: 'name-incomplete',
          message: 'Informe nome e sobrenome',
        };
      }

      return undefined;
    });
  });

  constructor() {
    // Observa mudanças no tipo de chave PIX
    effect(() => {
      const type = this.paymentForm.pix_key_type().value();
      this.updatePixKeyInput(type);
    });
  }

  updatePixKeyInput(type: string) {
    // Limpa o campo ao trocar de tipo
    this.paymentForm.pix_key().value.set('');

    if (!type) {
      // Se não tem tipo selecionado, reseta tudo
      this.maskValue.set(undefined);
      this.inputType.set('text');
      this.placeholder.set('Selecione o tipo de chave primeiro');
      return;
    }

    // Define máscara (se houver)
    this.maskValue.set(this.pixKeyMasks[type]);

    // Define tipo de input
    this.inputType.set(type === 'email' ? 'email' : 'text');

    // Define placeholder
    this.placeholder.set(this.pixKeyPlaceholders[type] || 'Digite sua chave PIX');
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.paymentForm, async () => {
      if (this.paymentForm().invalid()) {
        console.log('Formulário inválido');
        // Marca todos os campos como touched para mostrar erros
        this.paymentForm.pix_key_type().touched();
        this.paymentForm.pix_key().touched();
        this.paymentForm.pix_owner_name().touched();
        return;
      }

      const paymentData = this.paymentModel();
      console.log('Dados para enviar:', paymentData);
      const loadingToast = toast.loading('Processando...', {
        description: 'Atualizando seus dados de pagamento.',
      });
      try {
        await firstValueFrom(this.authService.updateUser(paymentData));

        // Atualiza o pixData após salvar com sucesso
        this.pixData.set(paymentData);

        toast.success('Sucesso!', {
          description: 'Seus dados foram atualizados com sucesso.',
          id: loadingToast,
        });
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

  // Signal para dados PIX vindos do backend
  pixData = signal<PaymentModel | null>(null);

  // Computed para verificar se tem dados PIX
  hasPixData = computed(() => this.pixData() !== null);

  ngOnInit() {
    // Buscar dados PIX do backend
    this.loadPixData();
  }

  loadPixData() {
    this.isLoadingPixData.set(true); // 👈 Inicia loading

    this.authService.loadUser().subscribe({
      next: (user) => {
        if (user.pix_key && user.pix_key_type && user.pix_owner_name) {
          this.pixData.set({
            pix_key: user.pix_key,
            pix_key_type: user.pix_key_type,
            pix_owner_name: user.pix_owner_name,
          });
        }
        this.isLoadingPixData.set(false); // 👈 Finaliza loading
      },
      error: (err) => {
        console.error('Erro ao carregar dados PIX:', err);
        this.isLoadingPixData.set(false); // 👈 Finaliza loading mesmo com erro
      },
    });
  }
  getPixKeyTypeLabel(type: string): string {
    const pixType = this.pixKeyTypes.find((t) => t.value === type);
    return pixType?.label || type;
  }

  copyPixKey() {
    const pixKey = this.pixData()?.pix_key;
    if (pixKey) {
      navigator.clipboard.writeText(pixKey).then(() => {
        toast.success('Chave PIX copiada!');
      });
    }
  }
}
