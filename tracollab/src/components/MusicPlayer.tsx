import React, {useState} from 'react';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";

export default function MusicPlayer({post, handlePostClick, handleUserClick}) {
    const [timeAgo, setTimeAgo] = useState('');

    return (
        <div className="text-white bg-[#9732C2] rounded-3xl shadow-md p-4">
            <div>
                <div className="w-full overflow-hidden whitespace-nowrap mb-2">
                    <div
                        className="scrolling-title text-xl font-bold rounded-xl hover:cursor-pointer hover:bg-[#5A1980] transition-colors duration-300"
                        onClick={() => handlePostClick(post.id)}>
                        <span className="inline-block animate-scroll max-w-48">{post.sound.title}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="font-medium">
                        <span
                            className="underline hover:cursor-pointer hover:text-blue-400 transition-colors duration-300"
                            onClick={() => handleUserClick(post.user?.name)}>
                            {post.user?.name}
                        </span>
                        <span className="hidden sm:inline">
                            {' '} - {timeAgo}
                        </span>
                    </div>
                    <span className="font-medium">
                        {post.sound.genre.name}
                    </span>
                </div>
            </div>

            <CustomMusicPlayer post={post} setTimeAgo={setTimeAgo}></CustomMusicPlayer>
        </div>
    );
}
