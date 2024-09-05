"use client";

import React, { useEffect, useState } from 'react';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";

export default function CommentValidate({ comment }) {
    const { user, content, sound } = comment;
    const [isVisible, setIsVisible] = useState(true); // State to hide the comment after validation or deletion

    const validateComment = async () => {
        try {
            const response = await fetch(`/api/comments/${comment.id}/publish`, {
                method: 'PATCH',
            });

            if (response.ok) {
                console.log('The comment has been validated successfully');
                setIsVisible(false); // Hide comment after validation
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
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Comment deleted successfully');
                setIsVisible(false); // Hide comment after deletion
            } else {
                const errorData = await response.json();
                alert(`Failed to delete comment: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert(`An error occurred while deleting the comment.`);
        }
    };

    // Return nothing if the comment is hidden
    if (!isVisible) return null;

    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#9732C2] rounded-2xl p-4">
            <div className="flex items-center">

                {/* Section of the profile picture  */}
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

                {/* Content of comment */}
                <div className="flex-grow max-w-[70%] break-words px-2">
                    <p className="font-bold mb-4">{user.name}</p>
                    <p className="mb-4">{content}</p>

                    { /* If the comment contains a sound, display the custom music player */}
                    {sound && sound.audioPath && (
                        <CustomMusicPlayer postOrComment={comment} />
                    )}
                </div>

                {/* Button to validate and delete */}
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
