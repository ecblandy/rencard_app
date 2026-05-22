type SocialKey =
  | 'instagram'
  | 'tiktok'
  | 'linkedIn'
  | 'facebook'
  | 'youtube'
  | 'telegram'
  | 'email'
  | 'x'
  | 'website'
  | 'spotify';

export type SocialsFormModel = Record<SocialKey, string>;

export interface SocialsModel {
  key: SocialKey;
  label: string;
  value: string;
  icon: string;
  enabled: boolean;
}

export const SOCIALS_CARD: SocialsModel[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    value: '',
    icon: 'lucideInstagram',
    enabled: false,
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    value: '',
    icon: 'svglTiktok',
    enabled: false,
  },
  {
    key: 'linkedIn',
    label: 'LinkedIn',
    value: '',
    icon: 'bootstrapLinkedin',
    enabled: false,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    value: '',
    icon: 'aspectsSocialFacebook',
    enabled: false,
  },
  {
    key: 'youtube',
    label: 'Youtube',
    value: '',
    icon: 'aspectsSocialYoutube',
    enabled: false,
  },
  {
    key: 'telegram',
    label: 'Telegram',
    value: '',
    icon: 'bootstrapTelegram',
    enabled: false,
  },
  {
    key: 'email',
    label: 'E-mail',
    value: '',
    icon: 'lucideMail',
    enabled: false,
  },
  {
    key: 'x',
    label: 'X',
    value: '',
    icon: 'bootstrapTwitterX',
    enabled: false,
  },
  {
    key: 'website',
    label: 'Site',
    value: '',
    icon: 'dripWeb',
    enabled: false,
  },
  {
    key: 'spotify',
    label: 'Spotify',
    value: '',
    icon: 'bootstrapSpotify',
    enabled: false,
  },
];
