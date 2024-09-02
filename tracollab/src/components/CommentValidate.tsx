"use client";

import React, { useEffect } from 'react';
import MusicPlayer from "@/components/MusicPlayer";

interface CommentProps {
    comment: {
        id: string;
        content: string;
        user: {
            name: string;
            profilePicture: string;
        };
        sound: {
            title: string;
            audioPath: string;
        } | null;
        soundId: string | null;
    };
}

export default function CommentValidate({ comment }: CommentProps) {
    const { user, content, sound } = comment;

    useEffect(() => {
        console.log("test: ", comment);
    }, []);

    const validateComment = async () => {
        try {
            const response = await fetch(`/api/comments/${comment.id}/publish`, {
                method: 'PATCH',
            });

            if (response.ok) {
                alert('The comment has been validated successfully');
            } else {
                const errorData = await response.json();
                alert(`Failed to validate comment: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error validating comment:', error);
            alert('An error occurred while validating the comment.');
        }
    };

    const deleteComment = async () => {
        try {
            const response = await fetch(`/api/comments/${comment.id}/delete`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Comment deleted successfully');
            } else {
                const errorData = await response.json();
                alert(`Failed to delete comment: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('An error occurred while deleting the comment.');
        }
    };

    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#9732C2] rounded-2xl p-4">
            <div className="flex items-center">
                {/* Section du profil - Masqué sur les petits écrans */}
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

                {/* Contenu du commentaire - Largeur dynamique */}
                <div className="flex-grow max-w-[85%] break-words px-2"> {/* Limitation de la largeur du contenu à 60% */}
                    <p className="font-bold">{user.name}</p>
                    <p>{content}</p>

                    {sound && sound.audioPath && (
                        <div className="mt-2">
                            <audio controls>
                                <source src={sound.audioPath} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>

                {/* Boutons */}
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
