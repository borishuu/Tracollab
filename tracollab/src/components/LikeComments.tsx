import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';

interface LikeCommentsProps {
    comment: any;
}

export default function LikeComments({ comment }: LikeCommentsProps) {
    // Référence à l'utilisateur connecté
    const { user } = useAuth();

    const [likesCount, setLikesCount] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [imgSrc, setImgSrc] = useState<string>("/assets/notLiked.png");

    useEffect(() => {
        // Si le commentaire n'existe pas, on ne fait rien
        if (!comment)
            return;

        const fetchLikesData = async () => {
            try {
                // Récupération des données de likes
                const response = await fetch(`/api/comments/${comment.id}/likes`);
                if (!response.ok)
                    throw new Error('Network response was not ok');

                const data = await response.json();
                setLikesCount(data.likesCount);
                setHasLiked(data.userHasLiked);
            } catch (error) {
                console.error('Error fetching likes data:', error);
            }
        };

        fetchLikesData();
    }, [comment.id]);

    useEffect(() => {
        changeImage();
    }, [hasLiked]);

    // Fonction pour changer la couleur du coeur en fonction de l'état du like
    const changeImage = () => {
        const imageSrc = hasLiked ? "/assets/liked.png" : "/assets/notLiked.png";
        setImgSrc(imageSrc);
    };

    // Fonction pour gérer le like
    const handleLikeToggle = async () => {
        if (!user)
            return;

        // Déterminer la méthode à utiliser
        const newHasLiked = !hasLiked;
        const method = newHasLiked ? 'POST' : 'DELETE';

        try {
            // Envoi de la requête pour le like
            const response = await fetch(`/api/comments/${comment.id}/likes`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok)
                throw new Error('Network response was not ok');

            setHasLiked(newHasLiked);
            setLikesCount(prevCount => prevCount + (newHasLiked ? 1 : -1));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="md:space-y-2 lg:space-y-0 sm:space-y-2 flex flex-col">
            <div className="flex space-x-2 mt-2">
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
        </div>
    );
}
