import MusicPlayer from "@/components/MusicPlayer";
import React from 'react';

export default function MusicPlayerWithImage() {
    return (
        <div className="flex-1 p-4 flex items-center">
            <div className="w-24 flex items-center justify-center rounded-lg">
                <div
                    className="w-24 h-24 bg-[#8ACE00] flex items-center justify-center text-white rounded-full">
                    <span className="text-sm bg-[#8ACE00]">Image</span>
                </div>
            </div>
            <div className="flex-1 pl-4">
                <MusicPlayer/>
            </div>
        </div>
    );
}
