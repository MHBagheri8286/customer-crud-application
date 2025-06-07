import { cn } from "@utils/Util";
import type { UseFormRegister, FieldError, Path, FieldValues } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date';
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    register: UseFormRegister<T>;
    error?: FieldError;
    className?: string;
    inputClassName?: string;
}

export function Input<T extends FieldValues>({
    name,
    label,
    type = 'text',
    placeholder,
    disabled = false,
    required = false,
    register,
    error,
    className,
    inputClassName,
}: InputProps<T>) {
    return (
        <div className={cn('space-y-1', className)}>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
                {...register(name)}
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    'w-full px-3 py-2 border rounded-md transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                    error
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300',
                    inputClassName
                )}
            />

            {error && (
                <p className="text-sm text-red-600" role="alert">
                    {error.message}
                </p>
            )}
        </div>
    );
}