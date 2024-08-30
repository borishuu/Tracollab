import React, { useEffect, useState } from 'react';
import Crunker from 'crunker';
import FormattedDate from "@/components/formatDate";



export default function MusicPlayer({ post }) {
    const [audioUrl, setAudioUrl] = useState<string | undefined>(post.sound.audioPath);

    useEffect(() => {
        const crunker = new Crunker();

        async function processAudio() {
            try {
                const audioBuffer = await crunker.fetchAudio(post.sound.audioPath);
                const mixedAudio = crunker.mergeAudio(audioBuffer);
                const output = await crunker.export(mixedAudio, 'audio/mp3');
                setAudioUrl(output.url);
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
        <div className="text-white bg-[#9732C2] rounded-3xl shadow-md p-4">
            <div className="w-full overflow-hidden whitespace-nowrap mb-2">
                <div className="scrolling-title text-xl font-bold">
                    <span className="inline-block animate-scroll max-w-48">{post.sound.title}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="font-medium">By {post.user?.name} - <FormattedDate dateString={post.date} /></span>
                <span className="font-medium">{post.sound.genre.name}</span>
            </div>


            <div className="w-full flex justify-center mb-2">
                <audio controls className="w-full max-w-full sm:max-w-xs md:max-w-sm">
                    <source src={audioUrl} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}
