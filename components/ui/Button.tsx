type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  variant = "primary",
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

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
