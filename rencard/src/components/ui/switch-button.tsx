"use client";

import { useState } from "react";

interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export default function SwitchButton({
  value,
  onChange,
  disabled,
}: SwitchProps) {
  const [internal, setInternal] = useState(false);
  const isControlled = value !== undefined;
  const checked = isControlled ? value : internal;

  function toggle() {
    if (disabled) return;

    if (!isControlled) {
      setInternal(!checked);
    }

    onChange?.(!checked);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={`
        relative w-[3rem] h-[1.5rem] rounded-full transition-colors
        ${checked ? "bg-neutral-strong" : "bg-neutral-soft"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-pressed={checked}
    >
      <span
        className={`
          absolute top-[0.125rem] left-[0.125rem]
          w-[1.25rem] h-[1.25rem] bg-white rounded-full
          transition-transform
          ${checked ? "translate-x-[1.5rem]" : "translate-x-0"}
        `}
      />
    </button>
  );
}
