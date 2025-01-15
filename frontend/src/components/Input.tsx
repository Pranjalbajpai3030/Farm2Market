import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { clsx } from "clsx";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              "block w-full rounded-lg border border-gray-300 px-4 py-2",
              "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500",
              "placeholder:text-gray-400",
              { "border-red-500": error },
              { "pl-10": prefix }, // Add padding if prefix is present
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
