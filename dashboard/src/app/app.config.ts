import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideRouter } from '@angular/router';

import { provideIcons } from '@ng-icons/core';

import {
  lucideHome,
  lucideMenu,
  lucideLayoutDashboard,
  lucideCrown,
  lucideQrCode,
  lucideLogOut,
  lucideSettings,
  lucideUser,
  lucideCheck,
  lucideStore,
  lucideHandshake,
  lucideTriangleAlert,
  lucidePalette,
  lucideShare2,
  lucideMousePointerClick,
  lucideImages,
  lucideUpload,
  lucideInstagram,
  lucideFacebook,
  lucideMail,
  lucideCheckCircle,
  lucideTag,
  lucideCreditCard,
  lucideCalendar,
  lucideMapPin,
  lucideChevronDown,
  lucideEye,
  lucideEdit,
  lucideLoader2,
  lucidePhone,
  lucideFileText,
  lucideXCircle,
  lucideChevronRight,
  lucideChevronsRight,
  lucideChevronLeft,
  lucideChevronsLeft,
  lucidePlus,
  lucideRefreshCcw,
  lucideCopy,
  lucideContact,
  lucideLink,
  lucideLockKeyhole,
  lucideFileUser,
  lucideVideo,
  lucideYoutube,
  lucideDownload,
  lucideX,
  lucideArrowRight,
  lucideArrowLeft,
  lucideLock,
  lucideMailOpen,
  lucideInfo,
  lucideMessageSquare,
  lucideTruck,

  // ==========================================
  // ÍCONES DO CARTÃO FÍSICO
  // ==========================================
  lucidePackage,
  lucideHistory,

  // ==========================================
  // ÍCONES DA PÁGINA DE PARCEIROS
  // ==========================================
  lucideUsers,
  lucideShoppingBag,
  lucideDollarSign,
  lucideWallet,
  lucideActivity,
  lucideUserCheck,
  lucideCircleCheck,
  lucideExternalLink,
  lucideArrowUpRight,
  lucideUserRoundX,
  lucideTrendingUp,
} from '@ng-icons/lucide';

import { svglTiktok } from '@ng-icons/svgl';

import {
  bootstrapArrowLeft,
  bootstrapArrowRight,
  bootstrapArrowClockwise,
  bootstrapBox,
  bootstrapCalendarEvent,
  bootstrapCheck,
  bootstrapCheckCircle,
  bootstrapCheckCircleFill,
  bootstrapChevronDown,
  bootstrapClockHistory,
  bootstrapCloudUpload,
  bootstrapCreditCard,
  bootstrapCurrencyDollar,
  bootstrapExclamationTriangle,
  bootstrapFileEarmarkWordFill,
  bootstrapGraphUp,
  bootstrapHeadset,
  bootstrapHourglassSplit,
  bootstrapInfoCircle,
  bootstrapLink,
  bootstrapLinkedin,
  bootstrapLock,
  bootstrapLockFill,
  bootstrapMusicNoteBeamed,
  bootstrapPerson,
  bootstrapQuestionCircle,
  bootstrapReceipt,
  bootstrapShieldCheck,
  bootstrapShieldLock,
  bootstrapSpotify,
  bootstrapTelegram,
  bootstrapTicketPerforated,
  bootstrapTwitterX,
  bootstrapWhatsapp,
  bootstrapXCircle,
  bootstrapLightbulb,
} from '@ng-icons/bootstrap-icons';

import { monoClipboardCheck, monoCreditCard, monoPause } from '@ng-icons/mono-icons';

import { aspectsSocialFacebook, aspectsSocialYoutube } from '@ng-icons/ux-aspects';

import { dripWeb } from '@ng-icons/dripicons';

import { remixFeedbackLine, remixPixFill, remixSuitcase2Line } from '@ng-icons/remixicon';

import { provideNgxMask, provideEnvironmentNgxMask } from 'ngx-mask';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

import { authInterceptor } from './core/http/auth.interceptors';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    // ==========================================
    // ANGULAR
    // ==========================================

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    // ==========================================
    // ÍCONES
    // ==========================================

    provideIcons({
      // ==========================================
      // LUCIDE
      // ==========================================

      lucideHome,
      lucideMenu,
      lucideLayoutDashboard,
      lucideCrown,
      lucideQrCode,
      lucideLogOut,
      lucideSettings,
      lucideUser,
      lucideCheck,
      lucideStore,
      lucideHandshake,
      lucideTriangleAlert,
      lucidePalette,
      lucideShare2,
      lucideMousePointerClick,
      lucideImages,
      lucideUpload,
      lucideInstagram,
      lucideFacebook,
      lucideMail,
      lucideCheckCircle,
      lucideTag,
      lucideCreditCard,
      lucideCalendar,
      lucideMapPin,
      lucideChevronDown,
      lucideEye,
      lucideEdit,
      lucideLoader2,
      lucidePhone,
      lucideFileText,
      lucideXCircle,
      lucideChevronRight,
      lucideChevronsRight,
      lucideChevronLeft,
      lucideChevronsLeft,
      lucidePlus,
      lucideRefreshCcw,
      lucideCopy,
      lucideContact,
      lucideLink,
      lucideLockKeyhole,
      lucideFileUser,
      lucideVideo,
      lucideYoutube,
      lucideDownload,
      lucideX,
      lucideArrowRight,
      lucideArrowLeft,
      lucideLock,
      lucideMailOpen,
      lucideInfo,
      lucideMessageSquare,
      lucideTruck,

      // ==========================================
      // CARTÃO FÍSICO
      // ==========================================

      lucidePackage,
      lucideHistory,

      // ==========================================
      // PARCEIROS
      // ==========================================

      lucideUsers,
      lucideShoppingBag,
      lucideDollarSign,
      lucideWallet,
      lucideActivity,
      lucideUserCheck,
      lucideCircleCheck,
      lucideExternalLink,
      lucideArrowUpRight,
      lucideUserRoundX,
      lucideTrendingUp,

      // ==========================================
      // SVG / TIKTOK
      // ==========================================

      svglTiktok,

      // ==========================================
      // BOOTSTRAP ICONS
      // ==========================================

      bootstrapArrowLeft,
      bootstrapArrowRight,
      bootstrapArrowClockwise,
      bootstrapBox,
      bootstrapCalendarEvent,
      bootstrapCheck,
      bootstrapCheckCircle,
      bootstrapCheckCircleFill,
      bootstrapChevronDown,
      bootstrapClockHistory,
      bootstrapCloudUpload,
      bootstrapCreditCard,
      bootstrapCurrencyDollar,
      bootstrapExclamationTriangle,
      bootstrapFileEarmarkWordFill,
      bootstrapGraphUp,
      bootstrapHeadset,
      bootstrapHourglassSplit,
      bootstrapInfoCircle,
      bootstrapLink,
      bootstrapLinkedin,
      bootstrapLock,
      bootstrapLockFill,
      bootstrapMusicNoteBeamed,
      bootstrapPerson,
      bootstrapQuestionCircle,
      bootstrapReceipt,
      bootstrapShieldCheck,
      bootstrapShieldLock,
      bootstrapSpotify,
      bootstrapTelegram,
      bootstrapTicketPerforated,
      bootstrapTwitterX,
      bootstrapWhatsapp,
      bootstrapXCircle,
      bootstrapLightbulb,

      // ==========================================
      // MONO ICONS
      // ==========================================

      monoClipboardCheck,
      monoCreditCard,
      monoPause,

      // ==========================================
      // UX ASPECTS
      // ==========================================

      aspectsSocialFacebook,
      aspectsSocialYoutube,

      // ==========================================
      // DRIP ICONS
      // ==========================================

      dripWeb,

      // ==========================================
      // REMIX ICONS
      // ==========================================

      remixFeedbackLine,
      remixPixFill,
      remixSuitcase2Line,
    }),

    // ==========================================
    // NGX MASK
    // ==========================================

    provideEnvironmentNgxMask(),

    provideNgxMask(),

    // ==========================================
    // HTTP
    // ==========================================

    provideHttpClient(withInterceptors([authInterceptor])),

    // ==========================================
    // CHARTS
    // ==========================================

    provideCharts(withDefaultRegisterables()),
  ],
};
