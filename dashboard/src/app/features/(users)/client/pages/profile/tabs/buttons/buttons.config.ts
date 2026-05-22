type ButtonKey = 'whatsapp' | 'pix';

export type ButtonsFormModel = Record<ButtonKey, string>;

export interface ButtonsModel {
  key: ButtonKey;
  label: string;
  value: string;
  icon: string;
  enabled: boolean;
  placeholder: string;
}

export const BUTTONS_CARD: ButtonsModel[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: '',
    icon: 'bootstrapWhatsapp',
    enabled: false,
    placeholder: '+55 11 99999-9999',
  },
  {
    key: 'pix',
    label: 'Chave Pix',
    value: '',
    icon: 'lucideQrCode',
    enabled: false,
    placeholder: 'CPF, e-mail, telefone ou chave aleatória',
  },
];
