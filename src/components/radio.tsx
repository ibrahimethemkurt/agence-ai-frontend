import React, { createContext, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const RadioGroupContext = createContext<{
  value: string | undefined | null;
  onChange: (value: string) => void;
  disabled: boolean;
  required: boolean;
} | null>(null);

interface RadioGroupProps {
  label?: string;
  value: string | undefined | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;
}

export const RadioGroup = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  children
}: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled, required }}>
      {label && <span className="sr-only">{label}</span>}
      {children}
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps {
  value?: string;
  children?: React.ReactNode;
}

const RadioGroupItem = ({ value, children }: RadioGroupItemProps) => {
  const context = useContext(RadioGroupContext);
  const isSelected = context?.value === value;

  return (
    <label className={twMerge(clsx(
      "flex items-center gap-2 cursor-pointer font-body text-[13px] text-[var(--color-fg)] leading-3 group",
      context?.disabled && "cursor-not-allowed opacity-50"
    ))}>
      <input
        type="radio"
        className="absolute w-4 h-4 opacity-0"
        checked={isSelected}
        onChange={(event) => context?.onChange(event.target.value)}
        disabled={context?.disabled}
        required={context?.required}
        name="radio-group"
        value={value}
      />
      <span
        className={twMerge(clsx(
          "w-4 h-4 relative border rounded-full duration-200 flex items-center justify-center transition-colors",
          isSelected ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "bg-transparent border-[var(--color-muted)] group-hover:border-[var(--color-fg)]"
        ))}
        aria-hidden="true"
      >
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 text-white">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </span>
      {children}
    </label>
  );
};

RadioGroup.Item = RadioGroupItem;

interface RadioProps {
  disabled?: boolean;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
  value?: string;
}

export const Radio = ({ disabled, checked, required, onChange, value }: RadioProps) => {
  const [_checked, set_checked] = useState<boolean>(checked || false);

  useEffect(() => {
    if (typeof checked === "boolean") {
      set_checked(checked);
    }
  }, [checked]);

  const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <label className={twMerge(clsx(
      "flex items-center gap-2 cursor-pointer font-body text-[13px] text-[var(--color-fg)] leading-3 group",
      disabled && "cursor-not-allowed opacity-50"
    ))}>
      <input
        type="radio"
        className="absolute w-4 h-4 opacity-0"
        checked={checked}
        onChange={_onChange}
        disabled={disabled}
        required={required}
        value={value}
      />
      <span
        className={twMerge(clsx(
          "w-4 h-4 relative border rounded-full duration-200 flex items-center justify-center transition-colors",
          checked ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "bg-transparent border-[var(--color-muted)] group-hover:border-[var(--color-fg)]"
        ))}
        aria-hidden="true"
      >
        {checked && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 text-white">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </span>
    </label>
  );
};


export const useRadio = (props: RadioProps) => {
  return { component: (<RadioGroupItem {...props} />) };
};