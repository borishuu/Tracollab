import React, {useEffect, useState} from 'react';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";
import {useRouter} from "next/navigation";

export default function MusicPlayer({post}) {
    const [timeAgo, setTimeAgo] = useState('');

    const router = useRouter();

    useEffect(() => {
        calculateTimeAgo(post.date);
    }, [post.date]);

    // Fonction pour calculer le temps écoulé depuis la publication
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

        switch (true) {
            case (years > 0):
                setTimeAgo(`${years} year${years > 1 ? 's' : ''} ago`);
                break;
            case (months > 0):
                setTimeAgo(`${months} month${months > 1 ? 's' : ''} ago`);
                break;
            case (days > 0):
                setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`);
                break;
            case (hours > 0):
                setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
                break;
            default:
                setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
                break;
        }
    };

    return (
        <div className="text-white bg-[#9732C2] rounded-3xl shadow-md p-4">
            <div>
                <div className="w-full overflow-hidden whitespace-nowrap mb-2">
                    <div
                        className="scrolling-title text-xl font-bold rounded-xl hover:cursor-pointer hover:bg-[#5A1980] transition-colors duration-300"
                        onClick={() => router.push(`/TrackPage/${post.id}`)}>
                        <span className="inline-block animate-scroll max-w-48">{post.sound.title}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="font-medium">
                        <span
                            className="underline hover:cursor-pointer hover:text-blue-400 transition-colors duration-300"
                            onClick={() => router.push(`/user/${post.user?.name}`)}>
                            {post.user?.name}
                        </span>
                        <span className="hidden sm:inline">
                            {' '} - {timeAgo}
                        </span>
                    </div>
                    <span className="font-medium bg-[#ED7F10] rounded-full px-2 py-1 text-sm">
                        {post.sound.genre.name}
                    </span>
                </div>
            </div>

            <CustomMusicPlayer postOrComment={post}></CustomMusicPlayer>
        </div>
    );
}
