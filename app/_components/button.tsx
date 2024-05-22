import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "destructive";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "flex items-center justify-center rounded-lg px-3 py-2 text-base font-medium transition duration-150 ease-in-out",
          {
            "bg-primary-600 text-white hover:bg-primary-500 focus:bg-primary-500":
              variant === "primary",
            "bg-white text-black border border-gray-300 hover:bg-gray-100 focus:bg-gray-100":
              variant === "secondary",
            "bg-red-500 text-white hover:bg-red-400 focus:bg-red-400":
              variant === "destructive",
          }
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
