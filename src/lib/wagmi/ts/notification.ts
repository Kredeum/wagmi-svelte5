import { BaseNotification } from "@wagmi-svelte5/components";
import toast, { type Renderable, type ToastPosition } from "svelte-hot-french-toast";

type NotificationProps = {
  Content: Renderable;
  status: "success" | "info" | "loading" | "error" | "warning";
  duration?: number;
  icon?: string;
  position?: ToastPosition;
  props?: Record<string, unknown>;
};

type NotificationOptions = {
  duration?: number;
  icon?: string;
  position?: ToastPosition;
  props?: Record<string, unknown>;
};

const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION: ToastPosition = "top-center";

const Notification = ({
  Content,
  status,
  duration = DEFAULT_DURATION,
  icon,
  position = DEFAULT_POSITION,
  props
}: NotificationProps) => {
  return toast.custom(BaseNotification, {
    duration: status === "loading" ? Infinity : duration,
    position,
    props: { ...props, Content, status },
    icon
  });
};

export const notification = {
  success: (Content: Renderable, options?: NotificationOptions) => {
    return Notification({ Content, status: "success", ...options });
  },
  info: (Content: Renderable, options?: NotificationOptions) => {
    return Notification({ Content, status: "info", ...options });
  },
  warning: (Content: Renderable, options?: NotificationOptions) => {
    return Notification({ Content, status: "warning", ...options });
  },
  error: (Content: Renderable, options?: NotificationOptions) => {
    return Notification({ Content, status: "error", ...options });
  },
  loading: (Content: Renderable, options?: NotificationOptions) => {
    return Notification({ Content, status: "loading", ...options });
  },
  remove: (toastId: string) => {
    toast.remove(toastId);
  }
};
