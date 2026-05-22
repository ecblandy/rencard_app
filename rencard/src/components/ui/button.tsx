import { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import Loader from "../loader";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  sizeH: "sm" | "xl" | "md";
  variant: "default" | "outline" | "custom" | "destructive";
  href?: string;
}

export default function Button({
  children,
  sizeH,
  isLoading,
  variant,
  href,
  ...props
}: ButtonProps) {
  const sizeMap = { sm: "h-[2.5rem]", md: "h-[3.125rem]", xl: "h-[3.75rem]" };
  const baseButtonClass = `font-manrope font-medium rounded-[.625rem] px-[1rem] py-[.5rem] transition-all duration-300 ease-in-out `;

  const variantMap = {
    default: "bg-black text-white hover:bg-neutral-strong cursor-pointer",
    outline:
      "border-2 border-black text-black hover:bg-black hover:text-white cusor-pointer",
    custom: "cursor-pointer",
    destructive: `
    text-neutral-900
    hover:bg-red-100
    hover:text-red-700
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-red-600
    focus-visible:ring-offset-2
    cursor-pointer
  `,
    disabled:
      "bg-black/50 text-white cursor-not-allowed hover:bg-green-nature/50 border-green-nature/50",
  };

  const isDisabled = isLoading || props.disabled;
  const appliedVariant = isDisabled ? variantMap.disabled : variantMap[variant];

  // if href is provided, render Link
  if (href) {
    return (
      <Link
        href={href}
        className={`${baseButtonClass} ${sizeMap[sizeH]} ${variantMap[variant]} ${props.className}`}
      >
        {children}
      </Link>
    );
  }

  // if no href, render button
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${baseButtonClass} ${sizeMap[sizeH]} ${props.className} ${appliedVariant}`}
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
}
