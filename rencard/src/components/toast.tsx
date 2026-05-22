"use client";

import clsx from "clsx";
import { XCircle, Info } from "lucide-react"; // adicionado Info
import { FaCheckCircle } from "react-icons/fa";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastMessageProps {
  type: "error" | "success" | "info"; // adicionado info
  title: string;
  message: string;
  duration?: number; // tempo que fica visível em ms
}

export default function ToastMessage({
  message,
  title,
  type,
  duration = 2000, // 2 segundos
}: ToastMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  const Icon =
    type === "success" ? FaCheckCircle : type === "error" ? XCircle : Info;

  const textCondition =
    type === "success"
      ? "text-success"
      : type === "error"
      ? "text-error"
      : "text-info"; // cor info

  // Fecha automaticamente
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            "flex items-center gap-4 p-4 sm:p-5 border border-[#E6E8EC]  font-manrope fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white max-w-190 w-full min-h-22.5 h-auto shadow-[0px_12px_32px_0px_rgba(6,28,61,0.08)] rounded-[.625rem]"
          )}
        >
          <Icon className={clsx("w-6 h-6 shrink-0", textCondition)} />
          <div className="flex flex-col">
            <h5
              className={clsx(
                "first-letter:uppercase font-semibold text-base sm:text-lg",
                textCondition
              )}
            >
              {title}
            </h5>
            <span className="first-letter:uppercase text-[0.875rem] text-[#838E9E] font-medium">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
