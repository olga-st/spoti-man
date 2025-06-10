import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { TagInput } from './common/TagInput';
import { Button } from './common/Button';
import type { Track } from '../types';

interface EditTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    track: Track;
    onSave: (trackId: string, bpm: number, tags: string[]) => void;
}

export const EditTrackModal: React.FC<EditTrackModalProps> = ({
    isOpen,
    onClose,
    track,
    onSave
}) => {
    const [bpm, setBpm] = useState(track.bpm?.toString() || '');
    const [tags, setTags] = useState(track.tags);
    const [error, setError] = useState<string>();

    const handleSave = () => {
        const bpmNumber = parseInt(bpm);
        if (isNaN(bpmNumber) || bpmNumber < 0) {
            setError('Please enter a valid BPM');
            return;
        }

        onSave(track.id, bpmNumber, tags);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit ${track.name}`}
        >
            <div className="space-y-4">
                <Input
                    label="BPM"
                    type="number"
                    value={bpm}
                    onChange={setBpm}
                    error={error}
                    min="0"
                />
                
                <TagInput
                    tags={tags}
                    onChange={setTags}
                    maxTags={10}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
}; 