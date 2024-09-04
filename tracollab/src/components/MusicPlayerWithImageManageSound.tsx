import React from 'react';
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function MusicPlayerWithImageManageSound({ post, onPostDeleted, userName, commentsCount }) {
    const handleRemoveClick = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this music?');
        if (confirmDelete) {
            try {
                const response = await fetch(`/api/posts/delete/${post.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    console.log('Music deleted successfully');
                    if (onPostDeleted) {
                        onPostDeleted(post.id);
                    }
                } else {
                    alert('Failed to delete music: ' + response.statusText);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('An error occurred while deleting the music');
            }
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
            <div className="flex-1">
                <MusicPlayerWithImage post={post} />
            </div>
            <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                <a href={`/commentsManagement/${userName}/${post.id}`} className="inline-block">
                    <img
                        src={commentsCount > 0 ? "/assets/bellWithNotif.png" : "/assets/bell.png"}
                        alt="Notification"
                        className="w-8 h-8 object-cover rounded-lg"
                    />
                </a>
                <img
                    src="/assets/remove.png"
                    alt="Remove"
                    className="w-8 h-8 object-cover rounded-lg cursor-pointer"
                    onClick={handleRemoveClick}
                />
            </div>
        </div>
    );
}
