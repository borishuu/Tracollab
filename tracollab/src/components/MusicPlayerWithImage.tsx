import React from 'react';
import MusicPlayer from "@/components/MusicPlayer";
import { useRouter } from "next/navigation";

export default function MusicPlayerWithImage({ post }) {
    const hasSoundData = post?.sound;
    const hasPicture = hasSoundData?.picture;

    const router = useRouter();

    const handlePostClick = (postId: string) => {
        router.push(`/posts/${postId}`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center p-4 w-full">
            {/* Image */}
            <div
                className="flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0 hover:cursor-pointer transition-all duration-300"
                onClick={() => handlePostClick(post.id)}
            >
                {hasSoundData && hasPicture ? (
                    <div
                        className="w-32 h-32 bg-[#8ACE01] rounded-full overflow-hidden flex items-center justify-center hover:border-4 hover:border-white"
                    >
                        <img
                            src={post.sound.picture}
                            alt="Sound picture"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 bg-[#8ACE00] flex items-center justify-center text-white rounded-full hover:border-4 hover:border-white">
                        <span>🎵</span>
                    </div>
                )}
            </div>

            {/* Lecteur audio */}
            <div className="flex-1 pl-4">
                <div className="w-full">
                    <MusicPlayer post={post} handlePostClick={handlePostClick} />
                </div>
            </div>
        </div>
    );
}