import React, { useEffect, useState } from 'react';
import Crunker from 'crunker';

export default function MusicPlayer({ post }) {
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const crunker = new Crunker();

        async function processAudio() {
            try {
                const audioBuffer = await crunker.fetchAudio(post.sound.audioPath, "https://storage.googleapis.com/tracollab-storage/instrumentals/REGGAE%20INSTRUMENTAL%20-%20Roots%20Yard.mp3");

                const mixedAudio = await crunker.mergeAudio(audioBuffer);

                const output = await crunker.export(mixedAudio, 'audio/mp3');

                setAudioUrl(output.url);

                const formData = new FormData();
                formData.append('file', output.blob, 'merged-audio.mp3');

                const requestOptions = {
                    method: 'POST',
                    body: formData,
                };

                const response = await fetch('/api/crunker', requestOptions as any);
            } catch (error) {
                console.error("Error processing audio with Crunker: ", error);
            }
        }

        processAudio();

        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl, post.sound.audioPath]);

    return (
        <div className="relative text-white rounded-3xl overflow-hidden bg-[#9732C2] max-w-sm">
            <div className="flex">
                <div className="w-3/4 h-20 z-10 pl-5 pt-3">
                    <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-sm">
                        <span className="inline-block animate-scroll">{post.sound.title}</span>
                    </p>
                    <p className="text-sm mt-4">by {post.user?.name}</p>
                </div>
                <div className="w-1/4 h-20 z-10 pt-3 flex justify-center">
                    <p className="text-sm">{post.sound.genre.name}</p>
                </div>
            </div>
            <div className="w-full pl-6 pb-1 flex justify-center">
                <audio controls className="w-full max-w-xs">
                    {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}
