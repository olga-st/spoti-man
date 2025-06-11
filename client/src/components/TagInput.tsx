import React, { useState } from 'react';

interface TagInputProps {
    initialTags: string[];
    onTagsChange: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ initialTags, onTagsChange }) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                const newTags = [...tags, newTag];
                setTags(newTags);
                onTagsChange(newTags);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            const newTags = tags.slice(0, -1);
            setTags(newTags);
            onTagsChange(newTags);
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        onTagsChange(newTags);
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-700 rounded border border-gray-600">
            {tags.map(tag => (
                <div key={tag} className="flex items-center bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)} className="ml-2 text-blue-200 hover:text-white">
                        &times;
                    </button>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-white flex-grow p-1 outline-none"
                placeholder="Add a tag..."
            />
        </div>
    );
}; 