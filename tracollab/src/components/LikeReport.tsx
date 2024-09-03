import React, {useState, useEffect} from 'react';
import {useAuth} from '@/context/authContext';

interface LikeReportProps {
    postId: string;
    initialLikesCount: number;
}

export default function LikeReport({postId, initialLikesCount}: LikeReportProps) {
    const {user} = useAuth();
    const [liked, setLiked] = useState<boolean>(false); // Initial state is false
    const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading state
    const [reporting, setReporting] = useState<boolean>(false); // Track reporting state

    useEffect(() => {
        if (!user || !postId) return;

        const checkIfLiked = async () => {
            try {
                console.log('postid:', postId);
                const response = await fetch(`/api/posts/${postId}/likes/check`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Like check response:', data);
                if (data.liked !== undefined) {
                    setLiked(data.liked); // Update liked state based on server data
                }
            } catch (error) {
                console.error('Error checking if liked:', error);
            } finally {
                setLoading(false); // Stop loading once the check is complete
            }
        };

        checkIfLiked();
    }, [postId, user]);


const handleLikeToggle = async () => {
    if (!user) return;

    setLoading(true); // Start loading when toggling
    try {
        const method = liked ? 'DELETE' : 'POST';
        const response = await fetch(`/api/posts/${postId}/likes`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: user.id}),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        setLiked(prevLiked => !prevLiked);
        setLikesCount(prevLikesCount => prevLikesCount + (liked ? -1 : 1));
    } catch (error) {
        console.error('Error toggling like:', error);
    } finally {
        setLoading(false); // Stop loading once the toggle is complete
    }
};


const handleReport = async () => {
    if (!user) return;

        try {
            const response = await fetch(`/api/report/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Report response:', data);
            alert(data.message); // Show server message to user
        } catch (error) {
            console.error('Error reporting post:', error);
            alert('Post already reported.');
        } finally {
            setReporting(false); // Reset reporting state
        }
};

// While loading, show a placeholder or a default image
const imageSrc = loading
    ? "/assets/loading.png" // Placeholder image during loading
    : liked
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

        <div className="flex space-x-2">
            <div className="w-1/4">
                <img
                    src="/assets/report.png"
                    className="h-6 object-contain cursor-pointer"
                    onClick={handleReport} // Add onClick handler here
                    alt="Report button"
                />
            </div>
            <label className="w-3/4 text-white">
                {reporting ? 'Reporting...' : 'Report'}
            </label>
        </div>
    </div>
);
}
