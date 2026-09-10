"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";

type ContactFormProps = {
  customUrl: string;
  primaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm({
  customUrl,
  primaryColor,
  primaryTextColor,
  secondaryTextColor,
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  /* ========================================================= */
  /* FORM STYLE */
  /* ========================================================= */

  const formStyle = {
    "--contact-primary": primaryColor,
    "--contact-text": primaryTextColor,
    "--contact-placeholder": secondaryTextColor,
    "--contact-border": secondaryTextColor,
  } as CSSProperties;

  /* ========================================================= */
  /* UPDATE FIELD */
  /* ========================================================= */

  function updateField(field: keyof FormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setApiError("");
    setSuccessMessage("");
  }

  /* ========================================================= */
  /* VALIDATION */
  /* ========================================================= */

  function validate(): boolean {
    const newErrors: FormErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    /* NAME */

    if (!name) {
      newErrors.name = "Informe seu nome.";
    } else if (name.length < 3) {
      newErrors.name = "Informe seu nome completo.";
    } else if (name.length > 100) {
      newErrors.name = "O nome deve ter no máximo 100 caracteres.";
    }

    /* EMAIL */

    if (!email) {
      newErrors.email = "Informe seu e-mail.";
    } else if (email.length > 254) {
      newErrors.email = "O e-mail deve ter no máximo 254 caracteres.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Informe um endereço de e-mail válido.";
    }

    /* PHONE */

    if (phone) {
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        newErrors.phone = "Informe um telefone válido.";
      }
    }

    /* MESSAGE */

    if (!message) {
      newErrors.message = "Informe sua mensagem.";
    } else if (message.length < 10) {
      newErrors.message = "Sua mensagem deve conter pelo menos 10 caracteres.";
    } else if (message.length > 2000) {
      newErrors.message = "Sua mensagem deve ter no máximo 2.000 caracteres.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* ========================================================= */
  /* SUBMIT */
  /* ========================================================= */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setApiError("");
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      setApiError(
        "Não foi possível estabelecer conexão com o serviço. Tente novamente mais tarde.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = backendUrl.endsWith("/") ? backendUrl : `${backendUrl}/`;

      const endpoint = new URL(
        `profiles/public/${encodeURIComponent(customUrl)}/contact/`,
        baseUrl,
      );

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      };

      const response = await fetch(endpoint.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      /* ===================================================== */
      /* SUCCESS */
      /* ===================================================== */

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

        setErrors({});

        setSuccessMessage(
          "Sua mensagem foi enviada com sucesso. Obrigado pelo contato!",
        );

        return;
      }

      /* ===================================================== */
      /* API ERRORS */
      /* ===================================================== */

      if (response.status === 400) {
        setApiError(
          "Algumas informações precisam ser revisadas. Confira os dados e tente novamente.",
        );
        return;
      }

      if (response.status === 403) {
        setApiError(
          "Este formulário de contato está temporariamente indisponível.",
        );
        return;
      }

      if (response.status === 404) {
        setApiError("Não foi possível localizar este perfil.");
        return;
      }

      if (response.status === 429) {
        setApiError(
          "Recebemos muitas tentativas recentemente. Aguarde alguns instantes e tente novamente.",
        );
        return;
      }

      if (response.status === 503) {
        setApiError(
          "O serviço de mensagens está temporariamente indisponível. Tente novamente em alguns minutos.",
        );
        return;
      }

      setApiError(
        "Não foi possível enviar sua mensagem no momento. Tente novamente.",
      );
    } catch {
      setApiError(
        "Não foi possível concluir o envio. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ========================================================= */
  /* CLASSES */
  /* ========================================================= */

  const inputClassName =
    "contact-input h-[2.75rem] w-full rounded-[.75rem] border bg-transparent px-[.875rem] text-[.875rem] outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const textareaClassName =
    "contact-input min-h-[7rem] w-full resize-none rounded-[.75rem] border bg-transparent px-[.875rem] py-[.75rem] text-[.875rem] outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <>
      {/* ===================================================== */}
      {/* CONTACT FORM STYLES */}
      {/* ===================================================== */}

      <style>{`
        .contact-input {
          color: var(--contact-text) !important;
          border-color: var(--contact-border) !important;
          caret-color: var(--contact-text) !important;
          -webkit-text-fill-color: var(--contact-text) !important;
        }

        .contact-input::placeholder {
          color: var(--contact-placeholder) !important;
          opacity: 1 !important;
          -webkit-text-fill-color: var(--contact-placeholder) !important;
        }

        .contact-input:focus {
          color: var(--contact-text) !important;
          border-color: var(--contact-primary) !important;
          caret-color: var(--contact-text) !important;
          -webkit-text-fill-color: var(--contact-text) !important;
          box-shadow: 0 0 0 1px var(--contact-primary);
        }

        .contact-input:focus::placeholder {
          color: var(--contact-placeholder) !important;
          opacity: 0.65 !important;
          -webkit-text-fill-color: var(--contact-placeholder) !important;
        }

        .contact-input:disabled {
          color: var(--contact-text) !important;
          -webkit-text-fill-color: var(--contact-text) !important;
        }

        .contact-input:-webkit-autofill,
        .contact-input:-webkit-autofill:hover,
        .contact-input:-webkit-autofill:focus,
        .contact-input:-webkit-autofill:active {
          -webkit-text-fill-color: var(--contact-text) !important;
          caret-color: var(--contact-text) !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      {/* ===================================================== */}
      {/* FORM */}
      {/* ===================================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-[.75rem]"
        style={formStyle}
      >
        {/* =================================================== */}
        {/* NAME */}
        {/* =================================================== */}

        <div className="w-full">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Nome completo"
            autoComplete="name"
            maxLength={100}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClassName}
          />

          {errors.name && (
            <p
              id="contact-name-error"
              className="mt-1 text-xs"
              style={{
                color: secondaryTextColor,
              }}
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* =================================================== */}
        {/* EMAIL */}
        {/* =================================================== */}

        <div className="w-full">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="E-mail"
            autoComplete="email"
            maxLength={254}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClassName}
          />

          {errors.email && (
            <p
              id="contact-email-error"
              className="mt-1 text-xs"
              style={{
                color: secondaryTextColor,
              }}
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* =================================================== */}
        {/* PHONE */}
        {/* =================================================== */}

        <div className="w-full">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Telefone"
            autoComplete="tel"
            maxLength={20}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={inputClassName}
          />

          {errors.phone && (
            <p
              id="contact-phone-error"
              className="mt-1 text-xs"
              style={{
                color: secondaryTextColor,
              }}
            >
              {errors.phone}
            </p>
          )}
        </div>

        {/* =================================================== */}
        {/* MESSAGE */}
        {/* =================================================== */}

        <div className="w-full">
          <textarea
            name="message"
            value={formData.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Mensagem"
            rows={4}
            maxLength={2000}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            className={textareaClassName}
          />

          {errors.message && (
            <p
              id="contact-message-error"
              className="mt-1 text-xs"
              style={{
                color: secondaryTextColor,
              }}
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* =================================================== */}
        {/* API ERROR */}
        {/* =================================================== */}

        {apiError && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs leading-5"
            style={{
              color: primaryTextColor,
              borderColor: secondaryTextColor,
            }}
          >
            <CircleAlert
              size={16}
              strokeWidth={1.8}
              className="mt-[2px] shrink-0"
              aria-hidden="true"
            />

            <span>{apiError}</span>
          </div>
        )}

        {/* =================================================== */}
        {/* SUCCESS */}
        {/* =================================================== */}

        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs leading-5"
            style={{
              color: primaryTextColor,
              borderColor: primaryColor,
            }}
          >
            <CircleCheck
              size={16}
              strokeWidth={1.8}
              className="mt-[2px] shrink-0"
              aria-hidden="true"
            />

            <span>{successMessage}</span>
          </div>
        )}

        {/* =================================================== */}
        {/* SUBMIT */}
        {/* =================================================== */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: primaryColor,
            color: "#ffffff",
          }}
        >
          {isSubmitting ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Send size={18} strokeWidth={1.8} aria-hidden="true" />
          )}

          <span>
            {isSubmitting ? "Enviando mensagem..." : "Enviar mensagem"}
          </span>
        </button>
      </form>
    </>
  );
}
