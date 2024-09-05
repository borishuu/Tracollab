import React from 'react';
import MusicPlayer from "@/components/MusicPlayer";
import {useRouter} from "next/navigation";

export default function MusicPlayerWithImage({post}) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row items-center p-4 w-full">
            {/* Image */}
            <div
                className="flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0 hover:cursor-pointer transition-all duration-300"
                onClick={() => router.push(`/TrackPage/${post.id}`)}
            >

                <div
                    className="w-32 h-32 bg-gray-400 rounded-full overflow-hidden flex items-center justify-center hover:border-4 hover:border-white"
                >
                    <img
                        src={post.sound.picture}
                        alt="Sound picture"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Lecteur audio */}
            <div className="flex-1 pl-4">
                <div className="w-full">
                    <MusicPlayer post={post}/>
                </div>
            </div>
        </div>
    );
}