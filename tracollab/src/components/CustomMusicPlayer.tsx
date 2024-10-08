import React, {useRef, useState} from "react";

export default function CustomMusicPlayer({postOrComment}) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Gère la mise à jour du temps écoulé et de la barre de progression
    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setElapsedTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    // Gère le chargement de l'audio et le lancement de la lecture
    const handleCanPlayThrough = () => {
        const audio = audioRef.current;
        if (audio) {
            setIsAudioReady(true);
            setTotalDuration(audio.duration);
            audio.play();
            setIsPlaying(true);
        }
    };

    // Gère le lancement et l'arrêt de la lecture
    const togglePlayPause = async () => {
        const audio = audioRef.current;
        if (audio) {
            if (!audioUrl) {
                setAudioUrl(postOrComment.sound.audioPath);
            }

            if (isAudioReady) {
                if (!isPlaying) {
                    await audio.play();
                    setIsPlaying(true);
                } else {
                    audio.pause();
                    setIsPlaying(false);
                }
            }
        }
    };

    // Formate le temps en minutes et secondes
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Gère le déplacement de la barre de progression
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * audio.duration;
            audio.currentTime = newTime;
            setProgress((newTime / audio.duration) * 100);
        }
    };

    // Gère le changement du volume
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setVolume(newVolume);
    };

    // Gère le téléchargement du fichier audio
    const handleDownloadClick = async () => {
        if (!audioUrl) {
            setAudioUrl(postOrComment.sound.audioPath);
        }
        window.open(postOrComment.sound.audioPath, '_self');
    };

    return (
        <div className="w-full flex flex-col items-center mb-2">
            <div className="w-full">
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onCanPlayThrough={handleCanPlayThrough}
                    className="hidden"
                />

                <div className="flex justify-between items-center mb-2 w-full">
                    <button
                        onClick={togglePlayPause}
                        className="text-white text-2xl focus:outline-none"
                    >
                        {isPlaying ? '⏸' : '▶️'}
                    </button>

                    <span className="text-sm text-[#8ACE01] font-bold ml-2"
                          style={{width: '50px', textAlign: 'center'}}>
                            {isAudioReady ? formatTime(elapsedTime) : '--:--'}
                    </span>

                    <div
                        className="flex-1 h-2 bg-gray-300 rounded-lg mx-2 cursor-pointer"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="bg-[#8ACE01] h-full rounded-lg"
                            style={{width: `${progress}%`}}
                        />
                    </div>

                    <span className="text-sm text-[#8ACE01] font-bold mr-2 hidden sm:inline"
                          style={{width: '50px', textAlign: 'center'}}>
                            {isAudioReady ? formatTime(totalDuration) : '--:--'}
                    </span>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 hidden sm:block cursor-pointer"
                    />
                </div>

                <div
                    className="flex justify-center mt-4 rounded-xl bg-purple-800 p-2 cursor-pointer hover:bg-[#005cc8] transition-colors duration-300"
                    onClick={handleDownloadClick}
                >
                    <img
                        src={"/assets/download.svg"}
                        alt={"Download"}
                        className="w-8 h-8 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
