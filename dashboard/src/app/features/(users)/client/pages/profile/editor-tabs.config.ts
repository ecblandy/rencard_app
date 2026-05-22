import { Type } from '@angular/core';
import { PersonalInfoTab } from './tabs/personal-info-tab/personal-info-tab';
import { Appearance } from './tabs/appearance/appearance';
import { Socials } from './tabs/socials/socials';
import { Curriculum } from './tabs/curriculum/curriculum';
import { Form } from './tabs/form/form';
import { Music } from './tabs/music/music';
import { Settings } from './tabs/settings/settings';
import { Buttons } from './tabs/buttons/buttons';
import { Portfolio } from './tabs/portfolio/portfolio';

interface EditorTab {
  key: string;
  label: string;
  component: Type<unknown>;
  icon: string;
}

export const EDITOR_TABS: EditorTab[] = [
  {
    key: 'appearence',
    label: 'Aparência',
    component: Appearance,
    icon: 'lucidePalette',
  },

  {
    key: 'personal-info',
    label: 'Dados pessoais',
    component: PersonalInfoTab,
    icon: 'lucideUser',
  },

  {
    key: 'socials',
    label: 'Rede sociais',
    component: Socials,
    icon: 'lucideShare2',
  },

  {
    key: 'buttons',
    label: 'Botões',
    component: Buttons,
    icon: 'lucideMousePointerClick',
  },

  {
    key: 'portfolio',
    label: 'Portfólio',
    component: Portfolio,
    icon: 'lucideImages',
  },

  {
    key: 'music',
    label: 'Música',
    component: Music,
    icon: 'bootstrapMusicNoteBeamed',
  },

  {
    key: 'form',
    label: 'Formúlario',
    component: Form,
    icon: 'lucideFileText',
  },

  {
    key: 'curriculum',
    label: 'Currículo',
    component: Curriculum,
    icon: 'lucideFileUser',
  },

  {
    key: 'settings',
    label: 'Configurações',
    component: Settings,
    icon: 'lucideSettings',
  },
];
