import React, { useState } from 'react';

export default function LikeReport({ likesCount }) {

    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <div className="md:space-y-2 lg:space-y-0 sm:space-y-2 space-x-2 flex flex-col">
            <div className="flex space-x-2">
                <div className="w-1/4">
                    <img
                        src={liked ? "/assets/liked.png" : "/assets/notLiked.png"}
                        className="h-6 object-contain cursor-pointer"
                        onClick={toggleLike}
                    />
                </div>
                <label className="w-3/4 text-white">
                    {likesCount} likes
                </label>
            </div>

            <div className="flex space-x-2">
                <div className="w-1/4">
                    <img
                        src="/assets/report.png"
                        className="h-6 object-contain"
                    />
                </div>
                <label className="w-3/4 text-white">
                    report
                </label>
            </div>
        </div>
    );
}
