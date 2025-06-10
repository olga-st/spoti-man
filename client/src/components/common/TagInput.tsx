import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';
import { Tag } from './Tag';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    maxTags?: number;
    className?: string;
    onClose?: () => void;
}

export const TagInput: React.FC<TagInputProps> = ({
    tags,
    onChange,
    maxTags = 10,
    className = '',
    onClose
}) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const newTag = inputValue.trim();
        
        if (!newTag) {
            return;
        }

        if (tags.includes(newTag)) {
            setError('This tag already exists');
            return;
        }

        if (tags.length >= maxTags) {
            setError(`Maximum ${maxTags} tags allowed`);
            return;
        }

        onChange([...tags, newTag]);
        setInputValue('');
        setError(undefined);
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div ref={containerRef} className={className}>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <Tag
                        key={tag}
                        label={tag}
                        onRemove={() => removeTag(tag)}
                    />
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={setInputValue}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag (press Enter or comma)"
                error={error}
                autoFocus
            />
        </div>
    );
}; 