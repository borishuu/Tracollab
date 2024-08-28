import React from 'react';

export default function MusicPlayer({ post }) {
    return (
        <div className="relative text-white rounded-3xl overflow-hidden bg-[#9732C2] max-w-sm">
            <div className="flex">
                <div className="w-3/4 h-20 z-10 pl-5 pt-3">
                    <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-sm">
                        <span className="inline-block animate-scroll">{post.sound.title}</span>
                    </p>
                    <p className="text-sm mt-4">by {post.user?.name}</p>
                </div>
                <div className="w-1/4 h-20 z-10 pt-3 flex justify-center">
                    <p className="text-sm">{post.sound.genre.name}</p>
                </div>
            </div>
            <div className="w-full pl-6 pb-1 flex justify-center">
                <audio controls className="w-full max-w-xs">
                    <source src={post.sound.audioPath} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}