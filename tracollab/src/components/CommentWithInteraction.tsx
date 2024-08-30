"use client";

import React, {useEffect} from 'react';
import LikeReport from "@/components/LikeReport";

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

export default function CommentWithInteraction({ comment }: CommentProps) {
    const { user, content, sound } = comment;

    useEffect(() => {
        console.log("test: ", comment);
    }, []);

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
                                <source src={sound.audioPath} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>

                <div className="w-2/12 pt-2 pl-2">
                    <LikeReport likesCount={0} />
                </div>
            </div>
        </div>
    );
}