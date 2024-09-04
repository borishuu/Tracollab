'use client';

import { useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    acceptedFileTypes?: string;
    buttonLabel?: string;
}

export default function UploadSection({ onFileSelect, acceptedFileTypes = "audio/mp3", buttonLabel = "Upload file" }: FileUploadProps) {
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file ? file.name : '');
        onFileSelect(file);
    }

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                readOnly
                value={fileName}
            />
            <label className="px-4 py-2 bg-[#E5D5D5] text-white rounded-md hover:bg-[#c9a7a7] focus:outline-none focus:ring-2 focus:ring-blue-300 text-center cursor-pointer">
                {buttonLabel}
                <input
                    type="file"
                    accept={acceptedFileTypes}
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </label>
        </div>
    );
}
