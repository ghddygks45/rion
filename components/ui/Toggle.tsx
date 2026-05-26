type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelLeft: string;
  labelRight: string;
};

export default function Toggle({
  checked,
  onChange,
  labelLeft,
  labelRight,
}: ToggleProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span
          className={`text-sm ${!checked ? "text-text" : "text-text-secondary"}`}
        >
          {labelLeft}
        </span>
        <button
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
            checked ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm ${checked ? "text-text" : "text-text-secondary"}`}
        >
          {labelRight}
        </span>
      </div>
    </>
  );
}
