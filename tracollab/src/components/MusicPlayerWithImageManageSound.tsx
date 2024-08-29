import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";
import React from 'react';

export default function MusicPlayerWithImageManageSound() {
    return (
        <div className="flex items-center justify-between mt-4">
            <MusicPlayerWithImage/>
            <div className="flex flex-col space-y-2">
                <a href={"/commentsManagement/[soundId]"} className="inline-block">
                    <img
                        src="/assets/bell.png"
                        alt="Notification"
                        className="w-8 h-8 object-cover rounded-lg shadow-md"
                    />
                </a>
                <img
                    src="/assets/remove.png"
                    alt="Remove"
                    className="w-8 h-8 object-cover rounded-lg shadow-md"
                />
            </div>
        </div>
    );
}
