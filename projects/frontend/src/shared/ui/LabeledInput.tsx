interface LabeledInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  error?: string;
}

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  error,
}: LabeledInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full h-10 px-3 py-2.5 border rounded-lg text-[var(--color-text-primary)] font-secondary text-sm placeholder-[var(--color-text-secondary)] transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)] bg-[var(--color-error)]/10'
            : 'border-[var(--color-border-hover)] hover:border-[var(--color-text-primary)] bg-transparent focus:ring-[var(--color-primary)]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && <p className="font-secondary text-xs text-[var(--color-error)] mt-1">{error}</p>}
    </div>
  );
}
