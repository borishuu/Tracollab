import React from 'react';

export default function LikeReport() {
    return (
        <div className="space-y-2"> {/* Reduced vertical spacing */}
            <div className="flex">
                <div className="w-1/4">
                    <img
                        src="/assets/notLiked.png"
                        className="h-6 object-contain"
                    />
                </div>
                <label className="w-3/4 text-white">
                    0 likes
                </label>
            </div>

            <div className="flex">
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
