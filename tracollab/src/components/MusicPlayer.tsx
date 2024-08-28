import React from 'react';

export default function MusicPlayer() {
    return (
        <div className="relative text-white rounded-3xl overflow-hidden bg-[#9732C2] w-full h-30 flex flex-col">
            <div className="flex flex-grow">
                <div className="w-3/4 pl-5 pt-3 flex flex-col justify-center">
                    <p className="text-xl">360</p>
                    <div>by Charli xcx</div>
                </div>
                <div className="w-1/4 pt-3 flex items-center justify-center">
                    <span>Pop</span>
                </div>
            </div>
            <div className="w-full pl-6">
                <span>---------o--------------------------------------</span>
            </div>
        </div>
    );
}
