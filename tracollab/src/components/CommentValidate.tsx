"use client";

import React, {useEffect} from 'react';

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
    const {user, content, sound} = comment;

    useEffect(() => {
        console.log("test: ", comment);
    }, []);

    const validateComment = async () => {
        try {
            const response = await fetch(`/api/comments/${comment.id}/publish`, {
                method: 'PATCH',
            });

            if (response.ok) {
                alert('The comment has been validate successfully');
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
    <div className="flex flex-col items-stretch mt-4 bg-[#C162EA] rounded-2xl">
        <div className="flex">
            <div className="w-2/12 rounded-tl-2xl relative">
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

            <div className="w-8/12 break-words pt-2 pr-2 pb-2">
                <p className="font-bold">{user.name || 'Anonymous'}</p>
                <p>{content || 'No content'}</p>

                {sound && sound.audioPath && (
                    <div>
                        <audio controls>
                            <source src={sound.audioPath} type="audio/mpeg"/>
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2 self-center ml-5 mr-5">
                <button onClick={validateComment}>
                    <img
                    src="/assets/validate.png"
                    alt="Notification icon"
                    className="w-8 h-8 object-cover rounded-lg shadow-md"
                    />
                </button>

                <button onClick={deleteComment}>
                    <img
                        src="/assets/remove.png"
                        alt="Delete icon"
                        className="w-8 h-8 object-cover rounded-lg shadow-md"
                    />
                </button>
            </div>
        </div>
    </div>
    );
}
