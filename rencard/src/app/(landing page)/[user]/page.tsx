import {
  FileText,
  Github,
  Linkedin,
  Instagram,
  Mail,
  MessageCircle,
  Globe,
  Calendar,
} from "lucide-react";
import Image from "next/image";

type Props = {
  params: { user: string };
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
  file: string;
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

export default async function UserProfilePage({ params }: Props) {
  const { user: username } = await params;
  const url = new URL(
    `profiles/public/${encodeURIComponent(username)}`,
    process.env.BACKEND_URL,
  );

  const response = await fetch(url);
  const responseToJson: PublicProfile = await response.json();
  console.log(responseToJson);
  return (
    <main className="min-h-screen bg-[#F8F9FB] py-10 px-4">
      <div className="mx-auto w-full max-w-md">
        <span className="block text-center uppercase font-semibold text-xl text-neutral-500 mb-6">
          Perfil
        </span>

        <div className="flex flex-col items-center rounded-3xl bg-white shadow-sm px-6 py-8">
          {/* Foto */}
          <Image
            src={responseToJson.profile_image || "/images/user-placeholder.svg"}
            alt={
              responseToJson.display_name ||
              responseToJson.owner_name ||
              "Usuário"
            }
            width={102}
            height={102}
            className=" rounded-xl object-cover"
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
          <button className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-300 transition hover:bg-neutral-100">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">Baixar currículo</span>
          </button>

          {/* Spotify */}
          <iframe
            className="my-8 rounded-xl"
            src={
              responseToJson.music?.value ||
              "https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC"
            }
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />

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
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
          </ul>

          {/* Botões */}
          <div className="mt-6 w-full space-y-4">
            {[
              {
                icon: MessageCircle,
                label: "WhatsApp",
              },
              {
                icon: Globe,
                label: "Portfólio",
              },
            ].map((button) => {
              const Icon = button.icon;

              return (
                <button
                  key={button.label}
                  className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl bg-neutral-900 text-white transition hover:bg-neutral-800"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{button.label}</span>
                </button>
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
  );
}
