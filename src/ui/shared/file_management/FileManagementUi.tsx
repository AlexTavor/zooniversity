import React, { useRef } from 'react';

interface FileManagementUiProps {
    name: string;
    validExtensions: string[];
    save: (name: string) => void;
    onLoad: (e: ProgressEvent<FileReader>) => void;
    onNameChange: (newName: string) => void;
}

export function FileManagementUi({
                                     name,
                                     validExtensions,
                                     save,
                                     onLoad,
                                     onNameChange
                                 }: FileManagementUiProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLoadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.slice(file.name.lastIndexOf('.'));
        if (!validExtensions.includes(ext)) {
            alert(`Invalid file type: ${ext}`);
            return;
        }

        const reader = new FileReader();
        reader.onload = onLoad;
        reader.readAsText(file);
    };

    const handleSaveClick = () => {
        if (!name.trim()) {
            alert('Please enter a name.');
            return;
        }
        save(name.trim());
    };

    return (
        <div className="file-management-ui">
            <input
                type="text"
                placeholder="Name..."
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
            />
            <div className="file-actions">
                <button onClick={handleSaveClick}>💾 Save</button>
                <button onClick={handleLoadClick}>📂 Load</button>
                <input
                    type="file"
                    accept={validExtensions.join(',')}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
