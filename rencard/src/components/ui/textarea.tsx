import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disable?: boolean;
  variant: "disabled" | "default";
}

const baseTextarea =
  "rounded-[.625rem] border border-neutral-soft mt-[.5rem] p-[1rem] resize-none";

const textareaStyles = {
  disabled: "placeholder:text-neutral-strong bg-neutral-soft",
  default: "placeholder:text-neutral-medium bg-white",
};

export default function Textarea({
  disable,
  variant,
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      disabled={disable}
      className={`${props.className} ${baseTextarea} ${textareaStyles[variant]}`}
    />
  );
}
