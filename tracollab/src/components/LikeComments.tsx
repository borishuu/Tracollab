import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';

interface LikeCommentsProps {
    commentId: string;
    initialLikesCount: number;
}

export default function LikeComments({ commentId, initialLikesCount }: LikeCommentsProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!user || !commentId) {
            console.log('User or commentId is missing:', { user, commentId });
            return;
        }

        const checkIfCommentLiked = async () => {
            try {
                const response = await fetch(`/api/comments/${commentId}/likes/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLiked(data.liked ?? false);
            } catch (error) {
                console.error('Error checking if liked:', error);
            } finally {
                setLoading(false);  // Ensure loading is set to false here
            }
        };

        checkIfCommentLiked();
    }, [commentId, user]);

    const handleLikeToggle = async () => {
        if (!user) return;

        setLoading(true);  // Set loading to true while toggling like
        try {
            const method = liked ? 'DELETE' : 'POST';
            const response = await fetch(`/api/comments/${commentId}/likes`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update liked state and likes count based on the current liked state
            setLiked(prevLiked => {
                const newLiked = !prevLiked;
                setLikesCount(prevLikesCount => prevLikesCount + (newLiked ? 1 : -1));
                return newLiked;
            });
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);  // Ensure loading is set to false here
        }
    };

    const imageSrc = liked
        ? "/assets/liked.png"
        : "/assets/notLiked.png";

    return (
        <div className="md:space-y-2 lg:space-y-0 sm:space-y-2 flex flex-col">
            <div className="flex space-x-2">
                <div className="w-1/4">
                    <img
                        src={imageSrc}
                        className="h-6 object-contain cursor-pointer"
                        onClick={handleLikeToggle}
                        alt="Like button"
                    />
                </div>
                <label className="w-3/4 text-white">
                    {loading ? 'Loading...' : `${likesCount} likes`}
                </label>
            </div>
        </div>
    );
}
