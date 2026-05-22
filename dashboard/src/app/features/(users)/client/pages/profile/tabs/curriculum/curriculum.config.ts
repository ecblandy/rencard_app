export type CurriculumFormModel = Record<'curriculum', string>;

export interface CurriculumModel {
  key: 'curriculum';
  label: string;
  value: string;
  icon: string;
  enabled: boolean;
}

export const CURRICULUM_CARD = {
  key: 'curriculum',
  label: 'Exibir no perfil',
  value: '',
  icon: 'lucideFileUser',
  enabled: false,
};
