import { FileText, MessageCircle, Globe, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import SpotifyEmbed from "./components/spotify-embed";

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
}

export interface ProfileButton {
  id: number;
  profile: number;
  type: string;
  value: string;
  enabled: boolean;
}

export interface PortfolioImage {
  id: number;
  image: string;
  title?: string;
}

export interface PortfolioVideo {
  id: number;
  url: string;
  title?: string;
}

export interface Music {
  enabled: boolean;
  id: number;
  profile: number;
  type: "spotify";
  value: string;
}

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

function getButtonData(button: ProfileButton) {
  switch (button.type) {
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
        icon: Globe,
        label: button.type,
        href: button.value,
      };
  }
}

function getSpotifyEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    const match = parsedUrl.pathname.match(/\/track\/([^/]+)/);

    if (!match) {
      return null;
    }

    return `https://open.spotify.com/embed/track/${match[1]}`;
  } catch {
    return null;
  }
}

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

export default async function UserProfilePage({ params }: Props) {
  const { user: username } = await params;

  const url = new URL(
    `profiles/public/${encodeURIComponent(username)}/`,
    process.env.BACKEND_URL,
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

    console.log("Public profile:", responseToJson);
  } catch {
    return <ProfileUnavailable />;
  }

  if (responseToJson.is_private) {
    return <ProfileUnavailable privateProfile />;
  }

  const spotifyUrl = getSpotifyEmbedUrl(responseToJson.music?.value ?? "");

  const googleAnalyticsId = responseToJson.google_analytics_id?.trim();

  return (
    <>
      {/* ========================================================= */}
      {/* GOOGLE ANALYTICS */}
      {/* ========================================================= */}

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

      <main className="min-h-screen bg-[#F8F9FB] px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <span className="mb-6 block text-center text-xl font-semibold uppercase text-neutral-500">
            Perfil
          </span>

          <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-8 shadow-sm">
            {/* Foto */}
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
              className="rounded-xl object-cover"
            />

            {/* Nome */}
            <h1 className="mt-5 text-lg font-bold text-neutral-900">
              {responseToJson.display_name ||
                responseToJson.owner_name ||
                "username"}
            </h1>

            {/* Subtitulo */}
            <p className="mt-1 text-center text-sm text-neutral-500">
              {responseToJson.subtitle || "Nenhum subtítulo definido"}
            </p>

            {/* Currículo */}
            {responseToJson.resume?.enabled && responseToJson.resume?.file && (
              <a
                href={responseToJson.resume.file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-300 transition hover:bg-neutral-100"
              >
                <FileText className="h-5 w-5" />

                <span className="font-semibold">Baixar currículo</span>
              </a>
            )}

            {/* Spotify */}
            {responseToJson.music?.enabled && spotifyUrl && (
              <SpotifyEmbed url={spotifyUrl} />
            )}

            {/* Redes sociais */}
            <ul className="w-full space-y-4">
              {responseToJson.social_links
                .filter((social) => social.enabled)
                .map((social) => {
                  const label = getSocialLabel(social.value);

                  return (
                    <li
                      key={social.id}
                      className="flex h-11 items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-100 px-4"
                    >
                      <Globe className="h-5 w-5 text-neutral-600" />

                      <a
                        href={social.value}
                        className="font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
            </ul>

            {/* Botões */}
            <div className="mt-6 w-full space-y-4">
              {responseToJson.buttons
                .filter((button) => button.enabled)
                .map((button) => {
                  const { icon: Icon, label, href } = getButtonData(button);

                  return (
                    <a
                      key={button.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl bg-neutral-900 text-white transition hover:bg-neutral-800"
                    >
                      <Icon className="h-5 w-5" />

                      <span className="font-semibold">{label}</span>
                    </a>
                  );
                })}
            </div>

            {/* Footer */}
            <p className="mt-8 text-sm text-neutral-500">
              Feito com{" "}
              <span className="font-bold text-neutral-900">Rencard</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
