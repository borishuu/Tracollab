import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";
import React from 'react';

export default function MusicPlayerWithImageManageSound({ post, onPostDeleted, userName }) {
    const handleRemoveClick = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this music?');
        if (confirmDelete) {
            try {
                const response = await fetch(`/api/posts/delete/${post.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Music deleted successfully');
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
            <MusicPlayerWithImage post={post} />
            <div className="flex flex-col space-y-2 mt-4 sm:mt-0">
                <a href={`/commentsManagement/${userName}/${post.id}`} className="inline-block">
                    <img
                        src="/assets/bell.png"
                        alt="Notification"
                        className="w-8 h-8 object-cover rounded-lg shadow-md"
                    />
                </a>
                <img
                    src="/assets/remove.png"
                    alt="Remove"
                    className="w-8 h-8 object-cover rounded-lg shadow-md cursor-pointer"
                    onClick={handleRemoveClick}
                />
            </div>
        </div>
    );
}
