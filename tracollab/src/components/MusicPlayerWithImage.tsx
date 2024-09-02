import MusicPlayer from "@/components/MusicPlayer";
import React from 'react';

export default function MusicPlayerWithImage({ post }) {
    const hasSoundData = post?.sound;
    const hasPicture = hasSoundData?.picture;

    return (
        <div className="flex flex-col sm:flex-row items-center p-4 w-full">
            {/* Image */}
            <div className="flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0">
                {hasSoundData && hasPicture ? (
                    <div className="w-32 h-32 bg-[#8ACE01] rounded-full overflow-hidden flex items-center justify-center">
                        <img
                            src={post.sound.picture}
                            alt="Sound picture"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 bg-[#8ACE00] flex items-center justify-center text-white rounded-full">
                        <span>🎵</span>
                    </div>
                )}
            </div>

            {/* Lecteur audio */}
            <div className="flex-1 pl-4">
                <div className="w-full">
                    <MusicPlayer post={post} />
                </div>
            </div>
        </div>
    );
}