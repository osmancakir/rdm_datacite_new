import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps = React.ComponentProps<typeof Textarea> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | null;
  srOnlyLabel?: boolean;
  containerClassName?: string;
  /** keep a fixed message area height to avoid layout shift between siblings */
  reserveMessageSpace?: boolean;
  /** height for the reserved message area; tweak if your errors wrap */
  // messageMinHeightClass?: string; // e.g., "min-h-4" (1 line) or "min-h-8" (2 lines)
};

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      id,
      name,
      label,
      description,
      error,
      srOnlyLabel,
      className,
      containerClassName,
      reserveMessageSpace = true,
      // messageMinHeightClass = "min-h-4",
      ...props
    },
    ref
  ) => {
    const uid = React.useId();
    const fieldId = id ?? `${name ?? "textarea"}-${uid}`;
    const descId = description ? `${fieldId}-desc` : undefined;
    const errId = error ? `${fieldId}-error` : undefined;
    const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label ? (
          <label
            htmlFor={fieldId}
            className={cn(
              "block text-sm font-medium text-foreground",
              srOnlyLabel && "sr-only"
            )}
          >
            {label}
          </label>
        ) : null}

        <Textarea
          id={fieldId}
          name={name}
          ref={ref}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={className}
          {...props}
        />

        <div>
          {/* className={reserveMessageSpace ? messageMinHeightClass : undefined} */}
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
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";
