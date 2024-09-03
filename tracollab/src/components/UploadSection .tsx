import React from 'react';

export default function UploadSection() {
    return (
        <div className="flex">
            <input
                type="text"
                className="flex-grow px-3 py-2 border rounded-bl-full rounded-tl-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
                className="px-6 py-2 bg-[#E5D5D5] text-white rounded-tr-full rounded-br-full hover:bg-[#c9a7a7] focus:outline-none focus:ring-2 focus:ring-blue-300">
                <img
                    src="/assets/upload.png"
                    alt="Upload file"
                    className="h-6 w-6 object-contain"
                />
            </button>
        </div>


    )
        ;
}
