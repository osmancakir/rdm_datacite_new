import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type InputFieldProps = React.ComponentProps<typeof Input> & {
  /** Optional label text or node shown above the input */
  label?: React.ReactNode;
  /** Error message shown under the input; sets aria-invalid automatically */
  error?: string | null;
  /** Optional helper/description text shown under the input (above error) */
  description?: React.ReactNode;
  /** Class for the outer wrapper */
  containerClassName?: string;
  /** Visually hide the label but keep it for screen readers */
  srOnlyLabel?: boolean;
};

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      name,
      label,
      description,
      error,
      className,
      containerClassName,
      srOnlyLabel,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? `${name ?? "input"}-${reactId}`;
    const descId = description ? `${inputId}-desc` : undefined;
    const errId = error ? `${inputId}-error` : undefined;

    // Build aria-describedby correctly when one or both are present
    const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-foreground",
              srOnlyLabel && "sr-only"
            )}
          >
            {label}
          </label>
        ) : null}

        <Input
          id={inputId}
          name={name}
          ref={ref}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={className}
          {...props}
        />

        {description ? (
          <p id={descId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}

        {error ? (
          <p
            id={errId}
            role="alert"
            className="text-destructive text-xs mt-1"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
