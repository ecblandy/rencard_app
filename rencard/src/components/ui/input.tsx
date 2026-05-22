"use client";

import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disable?: boolean;
  variant: "disabled" | "default";
  sizeH: "sm" | "xl";
  error?: boolean;
}

const baseInput =
  "h-[2.375rem] w-full rounded-[.625rem] border mt-[.5rem] pl-[1rem]";

const inputStyles = {
  disabled:
    "placeholder:text-neutral-strong bg-neutral-soft border-neutral-soft",
  default: "placeholder:text-neutral-medium bg-white border-neutral-soft",
};

const inputSizeH = {
  sm: "h-[2.375rem]",
  xl: "h-[3.75rem]",
};

export default function Input({
  disable,
  variant,
  sizeH,
  error,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isPassword && showPassword ? "text" : props.type}
        aria-invalid={error}
        disabled={disable}
        className={clsx(
          props.className,
          baseInput,
          inputSizeH[sizeH],
          error
            ? "bg-error-soft border-error outline-error"
            : inputStyles[variant]
        )}
      />

      {isPassword && (
        <button
          type="button"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/3 p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 text-gray6b" />
          ) : (
            <Eye className="w-5 h-5 text-gray6b" />
          )}
        </button>
      )}
    </div>
  );
}
