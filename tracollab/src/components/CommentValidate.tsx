import React from 'react';
import LikeReport from "@/components/LikeReport";
import LikeReportDownload from "@/components/LikeReportDownload";
import MusicPlayer from "@/components/MusicPlayer";

interface CommentProps {
    hasMusic?: boolean;
}

export default function CommentValidate({ hasMusic = false }: CommentProps) {
    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#C162EA] rounded-2xl">
            <div className="flex justify-between mt-5 mb-5">
                <div className="w-24 h-24 rounded-full bg-blue-500 mr-5 ml-5">
                    </div>


                <div className="w-9/12 flex-grow break-words">
                    <a href="/profile" className="text-xl font-bold">Suzie20</a>
                    <p className="mb-5">Bonjour, test
                        testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttteeeeeeeeeeeeeeeeeeeeeeeeeet</p>
                    {hasMusic && (
                        <MusicPlayer/>
                    )}
                </div>

                <div className="flex flex-col space-y-2 self-center ml-5 mr-5">
                    <img
                        src="assets/validate.png"
                        alt="Notification icon"
                        className="w-8 h-8 object-cover rounded-lg shadow-md"
                    />
                    <img
                        src="assets/remove.png"
                        alt="Delete icon"
                        className="w-8 h-8 object-cover rounded-lg shadow-md"
                    />
                </div>
            </div>
        </div>
    );
}
