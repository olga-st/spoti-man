import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string;
    onChange: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    onChange,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`
                    w-full px-3 py-2 bg-gray-700 border rounded-md
                    text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    ${error ? 'border-red-500' : 'border-gray-600'}
                    ${className}
                `}
                onChange={(e) => onChange(e.target.value)}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}; 