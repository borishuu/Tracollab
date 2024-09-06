import {useEffect, useState} from 'react';
import LikeComments from '@/components/LikeComments';
import CustomMusicPlayer from "@/components/CustomMusicPlayer";
import {useRouter} from "next/navigation";

export default function CommentWithInteraction({comment}) {
    const [audioReady, setAudioReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Vérifier si le commentaire a un son et si le chemin du son est défini
        if (comment.sound && comment.sound.audioPath) {
            // Créer une nouvelle instance de l'objet Audio
            const audio = new Audio(comment.sound.audioPath);

            // Gérer l'événement de chargement de l'audio
            audio.addEventListener('loadeddata', () => {
                // Mettre à jour l'état pour indiquer que l'audio est prêt
                setAudioReady(true);
            });

            // Gérer l'événement d'erreur de chargement de l'audio
            audio.addEventListener('error', () => {
                console.error("Failed to load audio.");
                setAudioReady(false);
            });

            // Charger l'audio
            audio.load();
        } else {
            // Si le commentaire n'a pas de son ou si le chemin du son n'est pas défini, le considérer comme prêt
            setAudioReady(true);
        }
    }, [comment.sound]);

    if (!audioReady) {
        // Afficher un loader si l'audio n'est pas prêt
        return <div className={"loader"}></div>;
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
                        onClick={() => router.push(`/user/${comment.user.name}`)}>
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