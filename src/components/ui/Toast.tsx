"use client";

import { toast, type ExternalToast } from "sonner";

const baseStyle: React.CSSProperties = {
  background: "#12121F",
  border: "1px solid rgba(255, 255, 255, 0.07)",
  color: "#F0EFF8",
  borderRadius: "12px",
};

type ToastOptions = ExternalToast;

export function showToast(
  message: string,
  variant: "success" | "error" | "info" = "info",
  options?: ToastOptions
) {
  const merged: ToastOptions = {
    style: baseStyle,
    ...options,
  };

  switch (variant) {
    case "success":
      return toast.success(message, {
        ...merged,
        style: {
          ...baseStyle,
          borderColor: "rgba(16, 185, 129, 0.3)",
          ...options?.style,
        },
      });
    case "error":
      return toast.error(message, {
        ...merged,
        style: {
          ...baseStyle,
          borderColor: "rgba(239, 68, 68, 0.3)",
          ...options?.style,
        },
      });
    case "info":
    default:
      return toast(message, {
        ...merged,
        style: {
          ...baseStyle,
          borderColor: "rgba(99, 102, 241, 0.3)",
          ...options?.style,
        },
      });
  }
}

export { toast };
