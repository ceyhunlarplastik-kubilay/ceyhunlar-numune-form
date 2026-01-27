import { toast } from "sonner";

export interface ToastOptions {
  description?: string;
  duration?: number;
  className?: string;
}

export const toastSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    position: "top-right",
    duration: options?.duration ?? 3000,
    className:
      options?.className ||
      "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-900",
    ...(options?.description && { description: options.description }),
  });
};

export const toastError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    position: "top-right",
    duration: options?.duration ?? 5000,
    className:
      options?.className ||
      "bg-red-50 border-l-4 border-red-500 text-red-900",
    ...(options?.description && { description: options.description }),
  });
};

export const toastWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    position: "top-right",
    duration: options?.duration ?? 4000,
    className:
      options?.className ||
      "bg-amber-50 border-l-4 border-amber-500 text-amber-900",
    ...(options?.description && { description: options.description }),
  });
};

export const toastInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    position: "top-right",
    duration: options?.duration ?? 3000,
    className:
      options?.className ||
      "bg-blue-50 border-l-4 border-blue-500 text-blue-900",
    ...(options?.description && { description: options.description }),
  });
};