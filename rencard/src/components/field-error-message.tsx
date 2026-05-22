"use client";

interface FieldErrorProps {
  message?: string;
  id: string;
}

export default function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;

  return (
    <span id={id} role="alert" className="text-sm text-error">
      {message}
    </span>
  );
}
