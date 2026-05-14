import React, { useEffect, useRef, useState } from "react";
import { Error } from "@/components/ui/error";
import clsx from "clsx";

const sizes = {
  xSmall: "h-6 text-xs rounded-md",
  small: "h-8 text-sm rounded-md",
  mediumSmall: "h-10 text-sm rounded-md",
  medium: "h-10 text-sm rounded-md",
  large: "h-12 text-base rounded-lg"
};

interface InputProps {
  placeholder?: string;
  size?: keyof typeof sizes;
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  prefixStyling?: boolean | string;
  suffixStyling?: boolean | string;
  disabled?: boolean;
  error?: string | boolean;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  ref?: React.RefObject<HTMLInputElement | null>;
  className?: string;
  wrapperClassName?: string;
}

export const Input = ({
  placeholder,
  size = "medium",
  prefix,
  suffix,
  prefixStyling = true,
  suffixStyling = true,
  disabled = false,
  error,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  ref,
  className,
  wrapperClassName,
  ...rest
}: InputProps) => {
  const [_value, set_value] = useState(value || "");
  const _ref = ref ? ref : useRef<HTMLInputElement>(null);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_value(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      set_value(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2" onClick={() => _ref.current?.focus()}>
      {label && (
        <div className="capitalize text-[13px] text-gray-900">
          {label}
        </div>
      )}
      <div className={clsx(
        "flex items-center duration-150 font-sans transition-colors rounded-md",
        error ? "border border-red-500" : "border border-[var(--color-border)] hover:border-[var(--color-accent)] focus-within:border-[var(--color-accent)]",
        sizes[size],
        disabled ? "cursor-not-allowed opacity-50" : "bg-[var(--color-surface)]",
        wrapperClassName
      )}>
        {prefix && (
          <div
            className={clsx(
              "text-[var(--color-fg)] opacity-50 fill-current h-full flex items-center justify-center transition-opacity focus-within:opacity-100",
              prefixStyling === true ? "border-r border-[var(--color-border)] px-4" : "pl-4 pr-2",
              size === "large" ? "rounded-l-lg" : "rounded-l-md"
            )}>
            {prefix}
          </div>
        )}
        <input
          className={clsx(
            "w-full bg-transparent inline-flex appearance-none placeholder:text-[var(--color-fg)] placeholder:opacity-40 text-[var(--color-fg)] outline-none font-body",
            (size === "xSmall" || size === "mediumSmall") ? "px-2" : "px-3",
            disabled ? "cursor-not-allowed" : "",
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          value={_value}
          onChange={_onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={_ref}
          {...rest}
        />
        {suffix && (
          <div className={clsx(
            "text-[var(--color-fg)] opacity-50 fill-current h-full flex items-center justify-center hover:opacity-100 transition-opacity",
            suffixStyling === true ? "border-l border-[var(--color-border)] px-4" : `pr-4 ${!suffixStyling ? "" : ` ${suffixStyling}`}`,
            size === "large" ? "rounded-r-lg" : "rounded-r-md"
          )}>
            {suffix}
          </div>
        )}
      </div>
      {typeof error === "string" && <Error size={size === "large" ? "large" : "small"}>{error}</Error>}
    </div>
  );
};