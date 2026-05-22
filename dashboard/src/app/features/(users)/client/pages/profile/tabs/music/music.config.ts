export type MusicFormModel = Record<'music', string>;

export interface MusicModel {
  key: 'music';
  label: string;
  value: string;
  icon: string;
  enabled: boolean;
}

export const MUSIC_CARD = {
  key: 'music',
  label: 'Exibir no perfil',
  value: '',
  icon: 'bootstrapMusicNoteBeamed',
  enabled: false,
} satisfies MusicModel;
