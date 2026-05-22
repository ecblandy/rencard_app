import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: string;
  variant: "default" | "auth";
  error?: boolean;
}

export default function Label({
  children,
  variant,
  error,
  ...props
}: LabelProps) {
  const labelStyleVariant = {
    default: "text-black",
    auth: "text-neutral-strong",
  };

  return (
    <label
      {...props}
      className={`font-urbanist font-semibold text-[1.25rem] ${
        error ? "text-error" : labelStyleVariant[variant]
      } 
       
        `}
    >
      {children}
    </label>
  );
}
