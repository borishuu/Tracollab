import React, {useState, useEffect} from 'react';
import {useAuth} from '@/context/authContext';

interface LikeReportProps {
    post: any;
    userLiked: any;
}

export default function LikeReport({post, userLiked}: LikeReportProps) {
    // Référence à l'utilisateur connecté
    const {user} = useAuth();

    const [likesCount, setLikesCount] = useState<number>(0);
    const [reporting, setReporting] = useState<boolean>(false);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [imgSrc, setImgSrc] = useState<string>("/assets/notLiked.png");

    // Fonction pour changer la couleur du coeur en fonction de l'état du like
    const changeImage = () => {
        const imageSrc = hasLiked ? "/assets/liked.png" : "/assets/notLiked.png";

        setImgSrc(imageSrc);
    }

    useEffect(() => {
        setLikesCount(post.likes.length);
        setHasLiked(userLiked);
        changeImage();
    }, [post, user]);

    const handleLikeToggle = async () => {
        if (!user)
            return;

        // Déterminer la méthode à utiliser
        const newHasLiked = !hasLiked;
        const method = hasLiked ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`/api/posts/${post.id}/likes`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: user.id}),
            });
            if (!response.ok)
                throw new Error('Network response was not ok');

            // Mettre à jour les états de manière synchrone
            setHasLiked(newHasLiked);
            setImgSrc(newHasLiked ? "/assets/liked.png" : "/assets/notLiked.png");
            setLikesCount(prevCount => prevCount + (newHasLiked ? 1 : -1));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Fonction pour signaler un post
    const handleReport = async () => {
        if (!user)
            return;

        try {
            const response = await fetch(`/api/report/${post.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok)
                throw new Error('Network response was not ok');

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Post already reported.');
        } finally {
            setReporting(false);
        }
    };

    return (
        <div className="md:space-y-2 lg:space-y-0 sm:space-y-2 flex flex-col rounded bg-[#C162EA] p-3">
            <div className="flex space-x-2">
                <div className="w-1/4">
                    <img
                        src={imgSrc}
                        className="h-6 object-contain cursor-pointer hover:scale-125 transition duration-300 ease-in-out whitespace-nowrap"
                        onClick={handleLikeToggle}
                        alt="Like button"
                    />
                </div>
                <label className="w-3/4 text-white">
                    {likesCount ? `${likesCount} likes` : `0 like`}
                </label>
            </div>

            <div className="flex space-x-2 pt-2">
                <div className="w-1/4">
                    <img
                        src="/assets/report.png"
                        className="h-6 object-contain cursor-pointer hover:scale-125 transition duration-300 ease-in-out whitespace-nowrap"
                        onClick={handleReport}
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
