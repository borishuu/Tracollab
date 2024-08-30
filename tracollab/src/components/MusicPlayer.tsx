import React, { useEffect, useState } from 'react';
import Crunker from 'crunker';

export default function MusicPlayer({ post }) {
    // État pour stocker l'URL de l'audio traité
    const [audioUrl, setAudioUrl] = useState<string | undefined>(post.sound.audioPath);

    useEffect(() => {
        const crunker = new Crunker();

        async function processAudio() {
            try {
                // Charger le fichier audio
                const audioBuffer = await crunker.fetchAudio(post.sound.audioPath);

                // Effectuer une opération sur l'audio (par exemple, un simple mixage avec lui-même)
                const mixedAudio = crunker.mergeAudio(audioBuffer);

                // Exporter le résultat
                const output = await crunker.export(mixedAudio, 'audio/mp3');

                // Mettre à jour l'URL de l'audio dans l'état
                setAudioUrl(output.url);
            } catch (error) {
                console.error("Error processing audio with Crunker: ", error);
            }
        }

        processAudio();

        // Cleanup pour libérer les ressources
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
                    <source src={audioUrl} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}