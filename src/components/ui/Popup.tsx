import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PopupSize = "sm" | "md" | "lg" | "xl";
export type PopupVariant = "default" | "danger" | "success" | "warning";

export interface PopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: PopupSize;
  variant?: PopupVariant;
  /** Footer action buttons */
  footer?: ReactNode;
  /** Hide the X close button in the header */
  hideCloseButton?: boolean;
  /** Prevent closing on backdrop click */
  disableBackdropClose?: boolean;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeMap: Record<PopupSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

// ─── Variant icon + accent bar ────────────────────────────────────────────────

const variantConfig: Record<
  PopupVariant,
  { accent: string; icon: ReactNode }
> = {
  default: {
    accent: "bg-[#2563EB]",
    icon: (
      <svg
        className="w-5 h-5 text-[#2563EB]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  danger: {
    accent: "bg-red-500",
    icon: (
      <svg
        className="w-5 h-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  success: {
    accent: "bg-emerald-500",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    accent: "bg-amber-500",
    icon: (
      <svg
        className="w-5 h-5 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Popup: React.FC<PopupProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  variant = "default",
  footer,
  hideCloseButton = false,
  disableBackdropClose = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { accent, icon } = variantConfig[variant];

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "popup-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F1729]/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={disableBackdropClose ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={`
          relative w-full ${sizeMap[size]}
          bg-white rounded-xl shadow-2xl shadow-slate-900/15
          flex flex-col overflow-hidden
          animate-in zoom-in-95 fade-in duration-200
        `}
      >
        {/* Accent top bar */}


        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start gap-3 px-5 pt-5 pb-0">
            {title && (
              <div className="mt-0.5 shrink-0">{icon}</div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id="popup-title"
                  className="text-[15px] font-semibold text-slate-800 leading-snug truncate"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 -mt-0.5 -mr-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {children && (
          <div className="px-5 py-4 text-sm text-slate-700 leading-relaxed">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// ─── Convenience button components ────────────────────────────────────────────

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const PopupPrimaryButton: React.FC<BtnProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2
      px-4 py-2 text-[13px] font-medium text-white
      bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF]
      rounded-lg transition-colors shadow-sm shadow-blue-900/20
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export const PopupSecondaryButton: React.FC<BtnProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2
      px-4 py-2 text-[13px] font-medium text-slate-600
      bg-white hover:bg-slate-50 active:bg-slate-100
      border border-slate-200 rounded-lg transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export const PopupDangerButton: React.FC<BtnProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2
      px-4 py-2 text-[13px] font-medium text-white
      bg-red-500 hover:bg-red-600 active:bg-red-700
      rounded-lg transition-colors shadow-sm shadow-red-900/20
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);
