import React, {useEffect, useState} from 'react';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";

export default function MusicPlayer({post, handlePostClick, handleUserClick}) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        calculateTimeAgo(post.date);
    }, [post.date]);


    const calculateTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diff = now.getTime() - postDate.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            setTimeAgo(`${years} year${years > 1 ? 's' : ''} ago`);
        } else if (months > 0) {
            setTimeAgo(`${months} month${months > 1 ? 's' : ''} ago`);
        } else if (days > 0) {
            setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`);
        } else if (hours > 0) {
            setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
        } else {
            setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
        }
    };

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

            <CustomMusicPlayer postOrComment={post}></CustomMusicPlayer>
        </div>
    );
}
