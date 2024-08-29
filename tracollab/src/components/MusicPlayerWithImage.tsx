import MusicPlayer from "@/components/MusicPlayer";
import React from 'react';

export default function MusicPlayerWithImage({post}) {
    const hasSoundData = post?.sound;
    const hasPicture = hasSoundData?.picture

    return (
        <div className="flex-1 p-4 flex items-center">
            <div className="w-32 flex items-center justify-center rounded-lg">
                {hasSoundData && hasPicture ? (
                    <div
                        className="w-32 h-32 bg-[#8ACE00] flex items-center justify-center text-white rounded-full overflow-hidden text-center">
                        <img
                            src={post.sound.picture}
                            alt={post.description}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-[#8ACE00] flex items-center justify-center text-white rounded-full">
                        <span>🎵</span>
                    </div>
                )}
            </div>
            <div className="flex-1 pl-4">
                <MusicPlayer post={post}/>
            </div>
        </div>
    );
}
