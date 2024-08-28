
import React from 'react';

export default function MusicPlayer() {
    return (
        <div className="relative text-white rounded-3xl overflow-hidden bg-[#9732C2]">
            <div className="flex">
                <div className="w-3/4  h-20 z-10 pl-5 pt-3 ">
                    <div>
                        <p className="text-xl">360</p>
                    </div>
                    <div>by Charli xcx</div>
                </div>
                <div
                    className="w-1/4 h-20 z-10 pt-3 flex justify-center">
                    <span>Pop</span>
                </div>
            </div>
            <div className="w-full pl-6 pb-1">
                <span>---------o--------------------------------------</span>
            </div>
        </div>


    );
}
