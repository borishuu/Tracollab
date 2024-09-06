"use client";

import React, {useState} from 'react';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";

export default function CommentValidate({comment}) {
    // Déstructurer les données du commentaire
    const {user, content, sound} = comment;

    // Etat pour savoir si le commentaire est visible ou non
    const [isVisible, setIsVisible] = useState(true);

    // Fonction pour valider un commentaire
    const validateComment = async () => {
        try {
            // Requête pour valider le commentaire
            const response = await fetch(`/api/comments/${comment.id}/publish`, {
                method: 'PATCH',
            });

            if (response.ok)
                // Cache le commentaire
                setIsVisible(false);
            else {
                const errorData = await response.json();
                alert(`Failed to validate comment: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error validating comment:', error);
            alert('An error occurred while validating the comment.');
        }
    };

    // Fonction pour supprimer un commentaire
    const deleteComment = async () => {
        try {
            // Requête pour supprimer le commentaire
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Cache le commentaire après suppression
                setIsVisible(false)
            } else {
                const errorData = await response.json();
                alert(`Failed to delete comment: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert(`An error occurred while deleting the comment.`);
        }
    };

    // Si le commentaire n'est pas visible, on ne le rend pas
    if (!isVisible)
        return null;

    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#9732C2] rounded-2xl p-4">
            <div className="flex items-center">

                {/* Photo de profil */}
                <div className="hidden md:flex w-24 rounded-tl-2xl relative mr-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name || 'Profile picture'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <p className="text-white">No profile picture</p>
                        )}
                    </div>
                </div>

                {/* Contenu du commentaire */}
                <div className="flex-grow max-w-[70%] break-words px-2">
                    <p className="font-bold mb-4">{user.name}</p>
                    <p className="mb-4">{content}</p>

                    { /* Si le commentaire contient un son, on affiche le lecteur audio */}
                    {sound && sound.audioPath && (
                        <CustomMusicPlayer postOrComment={comment}/>
                    )}
                </div>

                {/* Boutons de validation et suppression */}
                <div className="flex flex-col space-y-2 ml-auto h-full justify-center items-center">
                    <button onClick={validateComment} className="bg-transparent border-none">
                        <img
                            src="/assets/validate.png"
                            alt="Validate icon"
                            className="w-8 h-8 object-cover rounded-lg shadow-md"
                        />
                    </button>
                    <button onClick={deleteComment} className="bg-transparent border-none">
                        <img
                            src="/assets/remove.png"
                            alt="Remove icon"
                            className="w-8 h-8 object-cover rounded-lg shadow-md"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
