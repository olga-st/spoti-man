import React from 'react';

interface TagProps {
    label: string;
    onRemove?: () => void;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, onRemove, className = '' }) => {
    return (
        <span className={`inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs ${className}`}>
            {label}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="hover:text-gray-200 focus:outline-none"
                    aria-label={`Remove ${label} tag`}
                >
                    ×
                </button>
            )}
        </span>
    );
}; 