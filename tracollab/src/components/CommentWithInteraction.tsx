import {useEffect, useState} from 'react';
import LikeComments from '@/components/LikeComments';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";
import {handleUserClick} from "@/app/lib/handleClicks";

export default function CommentWithInteraction({comment}) {
    const [audioReady, setAudioReady] = useState(false);

    useEffect(() => {
        // Check if there is a sound associated with the comment
        if (comment.sound && comment.sound.audioPath) {
            // Create a new audio object and check if it can load properly
            const audio = new Audio(comment.sound.audioPath);

            // Add an event listener to handle the loaded data event
            audio.addEventListener('loadeddata', () => {
                // When the audio is fully loaded, set the audioReady state to true
                setAudioReady(true);
            });

            // Handle potential errors in loading the audio
            audio.addEventListener('error', () => {
                console.error("Failed to load audio.");
                setAudioReady(false);
            });
            // Trigger loading the audio
            audio.load();
        } else {
            // If no audio, consider it as ready
            setAudioReady(true);
        }
    }, [comment.sound]);

    if (!audioReady) {
        // Display a loading indicator or simply return null to hide the component
        return <div className={"loader"}></div>;  // or return null;
    }

    return (
        <div className="flex flex-col items-stretch mt-4 bg-[#C162EA] rounded-2xl">
            <div className="flex">
                <div className="w-2/12 rounded-tl-2xl relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden">
                        <img
                            src={comment.user.profilePicture}
                            alt={comment.user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="w-8/12 break-words pt-2 pr-2 pb-2">
                    <p
                        className="text-sm font-semibold underline cursor-pointer hover:text-blue-400 transition-colors duration-300"
                        onClick={() => handleUserClick(comment.user.name)}>
                        {comment.user.name}
                    </p>
                    <p>{comment.content}</p>

                    {comment.sound && comment.sound.audioPath && (
                        <CustomMusicPlayer postOrComment={comment}></CustomMusicPlayer>
                    )}
                </div>

                <div className="w-2/12 pt-2 pl-2">
                    <LikeComments comment={comment}/>
                </div>
            </div>
        </div>
    );
}