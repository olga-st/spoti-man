import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`inline-block ${sizes[size]} ${className}`}>
            <div className="w-full h-full border-4 border-gray-300 border-t-green-500 rounded-full animate-spin" />
        </div>
    );
}; 