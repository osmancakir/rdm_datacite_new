import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = string | { value: string; label: React.ReactNode };

type SelectFieldProps = React.ComponentProps<typeof Select> & {
  /** Text or node shown above the field */
  label?: React.ReactNode;
  /** Helper/description text shown under the field (above error) */
  description?: React.ReactNode;
  /** Error message shown under the field; sets aria-invalid automatically */
  error?: string | null;
  /** Visually hide label but keep for screen readers */
  srOnlyLabel?: boolean;
  /** Placeholder shown when nothing is selected */
  placeholder?: React.ReactNode;
  /** Options to render as items (strings or {value,label}) */
  options?: Option[];
  /** Width/extra classes for the trigger button */
  triggerClassName?: string;
  /** Wrapper div classes */
  containerClassName?: string;
  /** Trigger size passthrough: "sm" | "default" */
  triggerSize?: "sm" | "default";
  /** Optional custom render for each option’s label */
  renderOptionLabel?: (opt: Option) => React.ReactNode;
};

export const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      description,
      error,
      srOnlyLabel,
      placeholder = "Select…",
      options,
      triggerClassName,
      containerClassName,
      triggerSize = "default",
      renderOptionLabel,
      name,
      id,
      ...rootProps
    },
    _ref
  ) => {
    const reactId = React.useId();
    const fieldId = id ?? `${name ?? "select"}-${reactId}`;
    const labelId = label ? `${fieldId}-label` : undefined;
    const descId = description ? `${fieldId}-desc` : undefined;
    const errId = error ? `${fieldId}-error` : undefined;
    const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label ? (
          <label
            id={labelId}
            htmlFor={fieldId}
            className={cn("block text-sm font-medium text-foreground", srOnlyLabel && "sr-only")}
          >
            {label}
          </label>
        ) : null}

        {/* Radix Select Root (v2 supports `name` and form submission) */}
        <Select name={name} {...rootProps}>
          <SelectTrigger
            id={fieldId}
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            aria-invalid={!!error || undefined}
            data-error={!!error || undefined}
            size={triggerSize}
            className={cn("w-full", triggerClassName)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          {options ? (
            <SelectContent>
              {options.map((opt) => {
                const value = typeof opt === "string" ? opt : opt.value;
                const labelNode =
                  renderOptionLabel?.(opt) ??
                  (typeof opt === "string" ? opt : opt.label ?? opt.value);
                return (
                  <SelectItem key={value} value={value}>
                    {labelNode}
                  </SelectItem>
                );
              })}
            </SelectContent>
          ) : (
            // If you prefer to pass custom children (Groups, Separators...), render nothing here.
            // Consumers can still provide their own <SelectContent> as children via rootProps.
            null
          )}
        </Select>

        {description ? (
          <p id={descId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}

        {error ? (
          <p id={errId} role="alert" className="text-destructive text-xs mt-1">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
