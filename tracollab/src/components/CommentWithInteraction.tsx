import {useEffect, useState} from 'react';
import LikeComments from '@/components/LikeComments';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";

export default function CommentWithInteraction({comment}) {
    const [likesCount, setLikesCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchLikesCount = async () => {
            try {
                const response = await fetch(`/api/comments/${comment.id}/likes/count`);
                const data = await response.json();
                if (response.ok) {
                    setLikesCount(data.likesCount);
                } else {
                    console.error('Failed to fetch likes count:', data.error);
                }
            } catch (error) {
                console.error('Error fetching likes count:', error);
            }
        };

        fetchLikesCount();
    }, [comment.id]);

    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#C162EA] rounded-2xl">
            <div className="flex">
                <div className="w-2/12 rounded-tl-2xl relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden">
                        <img
                            src={comment.user.profilePicture}
                            alt={comment.user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="w-8/12 break-words pt-2 pr-2 pb-2">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p>{comment.content}</p>

                    {comment.sound && comment.sound.audioPath && (
                        <CustomMusicPlayer postOrComment={comment}></CustomMusicPlayer>
                    )}
                </div>
                <div className="w-2/12 pt-2 pl-2">
                    {likesCount === null ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <LikeComments commentId={comment.id} initialLikesCount={likesCount}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}