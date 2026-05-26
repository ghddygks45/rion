type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  className = "",
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-white hover:opacity-90",
    secondary: "bg-surface border border-border text-text hover:bg-border",
  };
  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
