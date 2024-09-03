import React from 'react';

interface PostButtonProps {
    handleClick: () => void;
}

export default function PostButton({ handleClick }: PostButtonProps) {
    return (
        <button
            className="px-4 py-2 ml-2 bg-[#C162EA] text-white rounded-full hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={handleClick}
        >
            Post
        </button>
    );
}
