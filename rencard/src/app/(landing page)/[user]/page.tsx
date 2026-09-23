import {
  FileText,
  MessageCircle,
  Globe,
  UserRound,
  MailOpen,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Twitter,
  Github,
  ExternalLink,
} from "lucide-react";

import { SiTiktok, SiThreads, SiDiscord, SiTelegram } from "react-icons/si";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { CSSProperties } from "react";

import SpotifyEmbed from "./components/spotify-embed";
import ContactForm from "./components/contact-form";
import TrackedLink from "./components/tracked-link";

type Props = {
  params: Promise<{ user: string }>;
};

export interface PublicProfile {
  id: number;
  owner_name: string;
  google_analytics_id: string;
  background_color: string;
  text_primary: string;
  text_secondary: string;
  button_bg_primary: string;
  button_bg_secondary: string;
  button_text_primary: string;
  button_text_secondary: string;
  background_image: string | null;
  profile_image: string | null;
  qr_image: string;
  display_name: string;
  subtitle: string;
  custom_url: string;
  is_private: boolean;
  contact_enabled: boolean;
  resume: Resume;
  portfolio_images_enabled: boolean;
  portfolio_videos_enabled: boolean;
  social_links: SocialLink[];
  buttons: ProfileButton[];
  portfolio_images: PortfolioImage[];
  portfolio_videos: PortfolioVideo[];
  music: Music | null;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  file: string | null;
  enabled: boolean;
}

export interface SocialLink {
  id: number;
  profile: number;
  type: string;
  value: string;
  enabled: boolean;
  tracked_url: string | null;
}

export interface ProfileButton {
  id: number;
  profile: number;
  type: string;
  value: string;
  enabled: boolean;
  tracked_url: string | null;
}

export interface PortfolioImage {
  id: number;
  image: string;
  title?: string;
  caption?: string;
  created_at?: string;
}

export interface PortfolioVideo {
  id: number;
  profile: number;
  youtube_url: string;
  created_at: string;
}

export interface Music {
  enabled: boolean;
  id: number;
  profile: number;
  type: "spotify";
  value: string;
}

/* ========================================================= */
/* SOCIAL LABEL */
/* ========================================================= */

function getSocialLabel(url: string) {
  try {
    const parsedUrl = new URL(url);

    const pathname = parsedUrl.pathname.replace(/^\/|\/$/g, "");

    if (!pathname) {
      return parsedUrl.hostname.replace("www.", "");
    }

    return pathname.split("/").pop() || parsedUrl.hostname;
  } catch {
    return url;
  }
}

/* ========================================================= */
/* SOCIAL ICON */
/* ========================================================= */

function getSocialIcon(type: string) {
  switch (type.toLowerCase().trim()) {
    case "instagram":
      return Instagram;

    case "linkedin":
      return Linkedin;

    case "facebook":
      return Facebook;

    case "youtube":
      return Youtube;

    case "twitter":
    case "x":
      return Twitter;

    case "github":
      return Github;

    case "tiktok":
      return SiTiktok;

    case "threads":
      return SiThreads;

    case "discord":
      return SiDiscord;

    case "telegram":
      return SiTelegram;

    default:
      return Globe;
  }
}

/* ========================================================= */
/* BUTTON DATA */
/* ========================================================= */

function getButtonData(button: ProfileButton) {
  switch (button.type.toLowerCase().trim()) {
    case "whatsapp":
      return {
        icon: MessageCircle,
        label: "WhatsApp",
        href: `https://wa.me/55${button.value.replace(/\D/g, "")}`,
      };

    case "pix":
      return {
        icon: Globe,
        label: "Pix",
        href: `pix:${button.value}`,
      };

    default:
      return {
        icon: ExternalLink,
        label: button.type,
        href: button.value,
      };
  }
}

/* ========================================================= */
/* SPOTIFY */
/* ========================================================= */

function getSpotifyEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostname !== "open.spotify.com") {
      return null;
    }

    const pathname = parsedUrl.pathname;

    const match = pathname.match(
      /^\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show)\/([^/]+)/,
    );

    if (!match) {
      return null;
    }

    const [, type, id] = match;

    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return null;
  }
}

/* ========================================================= */
/* YOUTUBE */
/* ========================================================= */

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    let videoId: string | null = null;

    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1).split("/")[0];
    }

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0];
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0];
      }

      if (parsedUrl.pathname.startsWith("/live/")) {
        videoId = parsedUrl.pathname.split("/live/")[1]?.split("/")[0];
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

/* ========================================================= */
/* EMAIL */
/* ========================================================= */

function getEmailHref(value: string) {
  const email = value.trim();

  if (email.toLowerCase().startsWith("mailto:")) {
    return email;
  }

  return `mailto:${email}`;
}

/* ========================================================= */
/* SECTION TITLE */
/* ========================================================= */

function SectionTitle({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <h2
      className="mb-[1rem] text-[1rem] font-semibold"
      style={{
        color,
      }}
    >
      {children}
    </h2>
  );
}

/* ========================================================= */
/* UNAVAILABLE */
/* ========================================================= */

function ProfileUnavailable({
  privateProfile = false,
}: {
  privateProfile?: boolean;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white px-6 py-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <UserRound className="h-7 w-7 text-neutral-500" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-neutral-900">
          {privateProfile ? "Este perfil é privado" : "Perfil não encontrado"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {privateProfile
            ? "Este usuário optou por manter o perfil privado."
            : "O perfil que você está procurando não existe ou não está mais disponível."}
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}

/* ========================================================= */
/* PAGE */
/* ========================================================= */

export default async function UserProfilePage({ params }: Props) {
  const { user: username } = await params;

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return <ProfileUnavailable />;
  }

  const url = new URL(
    `profiles/public/${encodeURIComponent(username)}/`,
    backendUrl.endsWith("/") ? backendUrl : `${backendUrl}/`,
  );

  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store",
    });
  } catch {
    return <ProfileUnavailable />;
  }

  if (!response.ok) {
    return <ProfileUnavailable />;
  }

  let responseToJson: PublicProfile;

  try {
    responseToJson = await response.json();
    console.log(responseToJson);
  } catch {
    return <ProfileUnavailable />;
  }

  if (responseToJson.is_private) {
    return <ProfileUnavailable privateProfile />;
  }

  /* ========================================================= */
  /* COLORS */
  /* ========================================================= */

  const primaryButtonColor = responseToJson.button_bg_primary || "#171717";

  const secondaryButtonColor = responseToJson.button_bg_secondary || "#F5F5F5";

  const primaryButtonText = responseToJson.button_text_primary || "#FFFFFF";

  const secondaryButtonText = responseToJson.button_text_secondary || "#171717";

  const primaryText = responseToJson.text_primary || "#171717";

  const secondaryText = responseToJson.text_secondary || "#737373";

  const backgroundColor = responseToJson.background_color || "#FFFFFF";

  /* ========================================================= */
  /* SPOTIFY */
  /* ========================================================= */

  const spotifyValue = responseToJson.music?.enabled
    ? responseToJson.music.value
    : "";

  const spotifyUrl = getSpotifyEmbedUrl(spotifyValue);

  /* ========================================================= */
  /* GOOGLE ANALYTICS */
  /* ========================================================= */

  const googleAnalyticsId = responseToJson.google_analytics_id?.trim();

  /* ========================================================= */
  /* EMAIL */
  /* ========================================================= */

  const emailSocial = responseToJson.social_links.find(
    (social) => social.enabled && social.type.toLowerCase() === "email",
  );

  /* ========================================================= */
  /* SOCIALS */
  /* ========================================================= */

  const socialLinks = responseToJson.social_links.filter(
    (social) =>
      social.enabled &&
      social.type.toLowerCase() !== "email" &&
      social.type.toLowerCase() !== "spotify",
  );

  return (
    <>
      {/* ===================================================== */}
      {/* GOOGLE ANALYTICS */}
      {/* ===================================================== */}

      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />

          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];

              function gtag() {
                window.dataLayer.push(arguments);
              }

              gtag('js', new Date());

              gtag('config', '${googleAnalyticsId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* ===================================================== */}
      {/* PAGE */}
      {/* ===================================================== */}

      <main
        className="min-h-screen px-4 py-10"
        style={
          {
            backgroundColor,
            "--contact-primary": primaryButtonColor,
            "--contact-secondary": secondaryText,
          } as CSSProperties
        }
      >
        <div className="mx-auto w-full max-w-md">
          {/* ================================================= */}
          {/* PROFILE */}
          {/* ================================================= */}

          <span
            className="mb-6 block text-center text-xl font-semibold uppercase"
            style={{
              color: secondaryText,
            }}
          >
            Perfil
          </span>

          <div
            className="flex flex-col items-center rounded-3xl px-6 py-8 shadow-sm"
            style={{
              backgroundColor,
            }}
          >
            {/* =============================================== */}
            {/* PROFILE INFORMATION */}
            {/* =============================================== */}

            <Image
              src={
                responseToJson.profile_image || "/images/user-placeholder.svg"
              }
              alt={
                responseToJson.display_name ||
                responseToJson.owner_name ||
                "Usuário"
              }
              width={102}
              height={102}
              className="h-[6.375rem] w-[6.375rem] rounded-[.625rem] object-cover"
            />

            <h1
              className="mt-[1.125rem] text-[.9375rem] font-bold"
              style={{
                color: primaryText,
              }}
            >
              {responseToJson.display_name ||
                responseToJson.owner_name ||
                "Nome não definido"}
            </h1>

            <p
              className="w-full break-words text-center text-[.75rem]"
              style={{
                color: secondaryText,
              }}
            >
              {responseToJson.subtitle || "Sem subtítulo"}
            </p>

            {/* =============================================== */}
            {/* ANEXO */}
            {/* =============================================== */}

            {responseToJson.resume?.enabled && responseToJson.resume?.file && (
              <section className="mt-[1.875rem] w-full">
                <SectionTitle color={primaryText}>Anexo</SectionTitle>

                <a
                  href={responseToJson.resume.file}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[2.375rem] w-full items-center justify-center gap-x-[.75rem] rounded-[.875rem] border-2 px-[.75rem] text-[.875rem] font-semibold shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                  style={{
                    backgroundColor: primaryButtonColor,
                    borderColor: primaryButtonColor,
                    color: primaryButtonText,
                  }}
                >
                  <FileText size={16} />

                  <span>Baixar anexo</span>
                </a>
              </section>
            )}

            {/* =============================================== */}
            {/* MUSIC / SPOTIFY */}
            {/* =============================================== */}

            {responseToJson.music?.enabled &&
              responseToJson.music?.value &&
              spotifyUrl && (
                <section className="mt-[1.875rem] w-full">
                  <SectionTitle color={primaryText}>Música</SectionTitle>

                  <SpotifyEmbed url={spotifyUrl} />
                </section>
              )}

            {/* =============================================== */}
            {/* PORTFOLIO IMAGENS */}
            {/* =============================================== */}

            {responseToJson.portfolio_images_enabled &&
              responseToJson.portfolio_images?.length > 0 && (
                <section className="mt-[1.875rem] w-full">
                  <SectionTitle color={primaryText}>Portfólio</SectionTitle>

                  <div className="grid grid-cols-3 gap-3">
                    {responseToJson.portfolio_images.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square overflow-hidden rounded-xl bg-neutral-200"
                      >
                        <Image
                          src={item.image}
                          alt={item.caption || item.title || "Portfólio"}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* =============================================== */}
            {/* PORTFOLIO VÍDEOS */}
            {/* =============================================== */}

            {responseToJson.portfolio_videos_enabled &&
              responseToJson.portfolio_videos?.length > 0 && (
                <section className="mt-[1.875rem] w-full">
                  <SectionTitle color={primaryText}>Vídeos</SectionTitle>

                  <div className="flex w-full flex-col gap-3">
                    {responseToJson.portfolio_videos.map((video) => {
                      const embedUrl = getYouTubeEmbedUrl(video.youtube_url);

                      if (!embedUrl) {
                        return null;
                      }

                      return (
                        <div
                          key={video.id}
                          className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-200"
                        >
                          <iframe
                            src={embedUrl}
                            title="Vídeo do YouTube"
                            className="h-full w-full"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            {/* =============================================== */}
            {/* SOCIALS */}
            {/* =============================================== */}

            {socialLinks.length > 0 && (
              <section className="mt-[1.875rem] w-full">
                <SectionTitle color={primaryText}>Redes sociais</SectionTitle>

                <ul className="flex w-full flex-col space-y-[1.125rem]">
                  {socialLinks.map((social) => {
                    const label = getSocialLabel(social.value);

                    const Icon = getSocialIcon(social.type);

                    return (
                      <li key={social.id}>
                        <TrackedLink
                          href={social.value}
                          trackedUrl={social.tracked_url}
                          className="flex h-[2.375rem] w-full items-center gap-x-[.75rem] rounded-[.875rem] px-[.75rem] transition-all duration-200 hover:scale-105"
                          style={{
                            backgroundColor: secondaryButtonColor,
                            color: secondaryButtonText,
                          }}
                        >
                          <Icon size={18} />

                          <span className="font-medium">{label}</span>
                        </TrackedLink>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* =============================================== */}
            {/* CONTACT FORM */}
            {/* =============================================== */}

            {responseToJson.contact_enabled && (
              <section className="mt-[1.875rem] w-full">
                <SectionTitle color={primaryText}>
                  Entre em contato
                </SectionTitle>

                <ContactForm
                  customUrl={responseToJson.custom_url}
                  primaryColor={primaryButtonColor}
                  primaryTextColor={primaryText}
                  secondaryTextColor={secondaryText}
                />
              </section>
            )}

            {/* =============================================== */}
            {/* EMAIL */}
            {/* =============================================== */}

            {emailSocial && (
              <section className="mt-[1.875rem] w-full">
                <SectionTitle color={primaryText}>E-mail</SectionTitle>

                <TrackedLink
                  href={getEmailHref(emailSocial.value)}
                  trackedUrl={emailSocial.tracked_url}
                  target="_self"
                  className="flex h-[2.375rem] w-full items-center justify-center gap-x-[.75rem] rounded-[.875rem] border-2 px-[.75rem] text-[.875rem] font-semibold shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                  style={{
                    backgroundColor: primaryButtonColor,
                    borderColor: primaryButtonColor,
                    color: primaryButtonText,
                  }}
                >
                  <MailOpen size={18} />

                  <span>Enviar email</span>
                </TrackedLink>
              </section>
            )}

            {/* =============================================== */}
            {/* BUTTONS */}
            {/* =============================================== */}

            {responseToJson.buttons.some((button) => button.enabled) && (
              <section className="mt-[1.875rem] w-full">
                <SectionTitle color={primaryText}>Links</SectionTitle>

                <ul className="w-full space-y-[1rem]">
                  {responseToJson.buttons
                    .filter((button) => button.enabled)
                    .map((button) => {
                      const { icon: Icon, label, href } = getButtonData(button);

                      const isPix = button.type.toLowerCase().trim() === "pix";

                      return (
                        <li key={button.id}>
                          <TrackedLink
                            href={href}
                            trackedUrl={isPix ? null : button.tracked_url}
                            className="flex h-[2.375rem] w-full items-center justify-center gap-x-[.75rem] rounded-[.875rem] px-[.75rem] transition-all duration-200 hover:scale-105"
                            style={{
                              backgroundColor: primaryButtonColor,
                              color: primaryButtonText,
                            }}
                          >
                            <Icon size={16} />

                            <span className="text-[.875rem] font-semibold">
                              {label}
                            </span>
                          </TrackedLink>
                        </li>
                      );
                    })}
                </ul>
              </section>
            )}

            {/* =============================================== */}
            {/* FOOTER */}
            {/* =============================================== */}

            <p
              className="mt-[1.875rem] font-medium"
              style={{
                color: secondaryText,
              }}
            >
              Feito com{" "}
              <Link
                href="/"
                className="font-bold hover:underline"
                style={{
                  color: primaryText,
                }}
              >
                Rencard
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
