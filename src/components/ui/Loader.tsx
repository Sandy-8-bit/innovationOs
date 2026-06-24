import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoaderVariant =
  | "spinner"   // Classic ring spinner
  | "dots"      // Three bouncing dots
  | "bar"       // Horizontal skeleton/progress bar
  | "pulse"     // Pulsing circle
  | "overlay";  // Full overlay with spinner + optional label

export type LoaderColor = "blue" | "white" | "slate";

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
  label?: string;
  /** For overlay variant: whether the overlay is visible */
  visible?: boolean;
  className?: string;
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const spinnerSizeMap: Record<LoaderSize, string> = {
  xs: "w-3 h-3 border-[2px]",
  sm: "w-4 h-4 border-[2px]",
  md: "w-6 h-6 border-[2.5px]",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-12 h-12 border-[3.5px]",
};

const dotSizeMap: Record<LoaderSize, string> = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
  xl: "w-3 h-3",
};

const colorMap: Record<
  LoaderColor,
  { ring: string; fill: string; track: string; text: string }
> = {
  blue: {
    ring: "border-[#2563EB]",
    fill: "bg-[#2563EB]",
    track: "border-blue-200",
    text: "text-[#2563EB]",
  },
  white: {
    ring: "border-white",
    fill: "bg-white",
    track: "border-white/30",
    text: "text-white",
  },
  slate: {
    ring: "border-slate-500",
    fill: "bg-slate-500",
    track: "border-slate-200",
    text: "text-slate-500",
  },
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ size: LoaderSize; color: LoaderColor; className?: string }> = ({
  size,
  color,
  className = "",
}) => {
  const { ring, track } = colorMap[color];
  return (
    <span
      className={`
        inline-block rounded-full border-solid animate-spin
        ${spinnerSizeMap[size]}
        ${track}
        border-t-transparent
        ${ring.replace("border-", "border-t-transparent border-")}
        ${className}
      `}
      style={{
        borderTopColor: "transparent",
        borderRightColor: "inherit",
        borderBottomColor: "inherit",
        borderLeftColor: "inherit",
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

// Simpler approach — avoids Tailwind class conflict
const SpinnerClean: React.FC<{
  size: LoaderSize;
  color: LoaderColor;
  className?: string;
}> = ({ size, color, className = "" }) => {
  const sizeStyle: Record<LoaderSize, React.CSSProperties> = {
    xs: { width: 12, height: 12, borderWidth: 2 },
    sm: { width: 16, height: 16, borderWidth: 2 },
    md: { width: 24, height: 24, borderWidth: 2.5 },
    lg: { width: 32, height: 32, borderWidth: 3 },
    xl: { width: 48, height: 48, borderWidth: 3.5 },
  };

  const colorStyle: Record<LoaderColor, string> = {
    blue: "#2563EB",
    white: "#ffffff",
    slate: "#64748b",
  };

  const trackStyle: Record<LoaderColor, string> = {
    blue: "#BFDBFE",
    white: "rgba(255,255,255,0.3)",
    slate: "#E2E8F0",
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin ${className}`}
      style={{
        ...sizeStyle[size],
        borderStyle: "solid",
        borderColor: trackStyle[color],
        borderTopColor: colorStyle[color],
      }}
    />
  );
};

// ─── Dots ─────────────────────────────────────────────────────────────────────

const Dots: React.FC<{ size: LoaderSize; color: LoaderColor; className?: string }> = ({
  size,
  color,
  className = "",
}) => {
  const { fill } = colorMap[color];
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`rounded-full ${dotSizeMap[size]} ${fill} animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
};

// ─── Bar ─────────────────────────────────────────────────────────────────────

const Bar: React.FC<{ color: LoaderColor; className?: string }> = ({
  color,
  className = "",
}) => {
  const trackStyle: Record<LoaderColor, string> = {
    blue: "#EFF6FF",
    white: "rgba(255,255,255,0.2)",
    slate: "#F1F5F9",
  };
  const fillStyle: Record<LoaderColor, string> = {
    blue: "#2563EB",
    white: "#ffffff",
    slate: "#64748b",
  };
  return (
    <span
      className={`block w-full h-1 rounded-full overflow-hidden ${className}`}
      style={{ background: trackStyle[color] }}
      role="status"
      aria-label="Loading"
    >
      <span
        className="block h-full rounded-full origin-left"
        style={{
          background: fillStyle[color],
          animation: "corteas-bar 1.4s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes corteas-bar {
          0%   { transform: translateX(-100%) scaleX(0.5); }
          50%  { transform: translateX(0%)    scaleX(0.6); }
          100% { transform: translateX(100%)  scaleX(0.5); }
        }
      `}</style>
    </span>
  );
};

// ─── Pulse ────────────────────────────────────────────────────────────────────

const Pulse: React.FC<{ size: LoaderSize; color: LoaderColor; className?: string }> = ({
  size,
  color,
  className = "",
}) => {
  const pxMap: Record<LoaderSize, number> = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };
  const colorStyle: Record<LoaderColor, string> = {
    blue: "#2563EB",
    white: "#ffffff",
    slate: "#64748b",
  };
  const px = pxMap[size];
  const c = colorStyle[color];
  return (
    <span
      className={`relative inline-flex ${className}`}
      style={{ width: px, height: px }}
      role="status"
      aria-label="Loading"
    >
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-50"
        style={{ background: c }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: px, height: px, background: c }}
      />
    </span>
  );
};

// ─── Overlay ─────────────────────────────────────────────────────────────────

const Overlay: React.FC<{
  visible: boolean;
  label?: string;
  size?: LoaderSize;
}> = ({ visible, label, size = "lg" }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#0F1729]/50 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-xl shadow-slate-900/15">
        <SpinnerClean size={size} color="blue" />
        {label && (
          <span className="text-sm font-medium text-slate-600">{label}</span>
        )}
      </div>
    </div>
  );
};

// ─── Main Loader export ───────────────────────────────────────────────────────

export const Loader: React.FC<LoaderProps> = ({
  variant = "spinner",
  size = "md",
  color = "blue",
  label,
  visible = true,
  className = "",
}) => {
  if (variant === "overlay") {
    return <Overlay visible={visible} label={label} size={size} />;
  }

  const wrapperClass = `inline-flex flex-col items-center gap-2 ${className}`;

  const inner = (() => {
    switch (variant) {
      case "spinner":
        return <SpinnerClean size={size} color={color} />;
      case "dots":
        return <Dots size={size} color={color} />;
      case "bar":
        return <Bar color={color} />;
      case "pulse":
        return <Pulse size={size} color={color} />;
      default:
        return <SpinnerClean size={size} color={color} />;
    }
  })();

  return (
    <span className={wrapperClass}>
      {inner}
      {label && (
        <span
          className={`text-xs font-medium ${colorMap[color].text}`}
        >
          {label}
        </span>
      )}
    </span>
  );
};

export default Loader;
