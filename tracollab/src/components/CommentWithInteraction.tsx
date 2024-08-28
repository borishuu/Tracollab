import React from 'react';
import LikeReport from "@/components/LikeReport";
import LikeReportDownload from "@/components/LikeReportDownload";
import MusicPlayer from "@/components/MusicPlayer";

interface CommentProps {
    hasMusic?: boolean;
}

export default function Comment({ hasMusic = false }: CommentProps) {
    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#C162EA] rounded-2xl">
            <div className="flex">
                <div className="w-2/12 rounded-tl-2xl relative">
                    <div className="w-24 h-24 rounded-bl-2xl bg-blue-500 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl">
                    </div>
                </div>

                <div className="w-8/12 break-words">
                    <a href="/profile" className="text-xl font-bold">Suzie20</a>
                    <p>Bonjour, test
                        testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttteeeeeeeeeeeeeeeeeeeeeeeeeet</p>
                    {hasMusic && (
                        <MusicPlayer/>
                    )}
                </div>

                {hasMusic && (
                <div className="w-2/12 rounded-tr-2xl pt-4">
                    <LikeReportDownload />
                </div>
                )}

                {!hasMusic && (
                    <div className="w-2/12 rounded-tr-2xl pt-4">
                        <LikeReport/>
                    </div>
                )}

            </div>
        </div>
    );
}
