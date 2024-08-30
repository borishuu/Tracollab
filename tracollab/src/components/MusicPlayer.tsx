import React, { useRef, useState } from 'react';
import FormattedDate from "@/components/formatDate";

export default function MusicPlayer({ post, handlePostClick }) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = async () => {
        const audio = audioRef.current;

        if (!audioUrl) {
            setAudioUrl(post.sound.audioPath);
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
    };

    const handleCanPlayThrough = () => {
        setIsAudioReady(true);
        setTotalDuration(audioRef.current.duration);
        audioRef.current.play(); // Lancer la lecture une fois que l'audio est prêt
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        setElapsedTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const audio = audioRef.current;
        const newTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * audio.duration;
        audio.currentTime = newTime;
        setProgress((newTime / audio.duration) * 100);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="text-white bg-[#9732C2] rounded-3xl shadow-md p-4">
            <div className={"rounded-xl hover:cursor-pointer hover:bg-[#5A1980] transition-colors duration-300"} onClick={() => handlePostClick(post.id)}>
                <div className="w-full overflow-hidden whitespace-nowrap mb-2">
                    <div className="scrolling-title text-xl font-bold">
                        <span className="inline-block animate-scroll max-w-48">{post.sound.title}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">By {post.user?.name} - <FormattedDate dateString={post.date}/></span>
                    <span className="font-medium">{post.sound.genre.name}</span>
                </div>
            </div>

            <div className="w-full flex flex-col items-center mb-2">
                <div className="w-full">
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onCanPlayThrough={handleCanPlayThrough} // Appelé lorsque l'audio est prêt à être lu
                        className="hidden"
                    />

                    <div className="flex justify-between items-center mb-2 w-full">
                        <button
                            onClick={togglePlayPause}
                            className="text-white text-2xl focus:outline-none"
                        >
                            {isPlaying ? '⏸' : '▶️'}
                        </button>

                        <span className="text-sm text-[#8ACE01] font-bold ml-2" style={{ width: '50px', textAlign: 'center' }}>
                            {isAudioReady ? formatTime(elapsedTime) : '--:--'}
                        </span>

                        <div
                            className="flex-1 h-2 bg-gray-300 rounded-lg mx-2 cursor-pointer"
                            onClick={handleProgressClick}
                        >
                            <div
                                className="bg-[#8ACE01] h-full rounded-lg"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <span className="text-sm text-[#8ACE01] font-bold mr-2" style={{ width: '50px', textAlign: 'center' }}>
                            {isAudioReady ? formatTime(totalDuration) : '--:--'}
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-16"
                        />
                    </div>

                    {audioUrl && isAudioReady && (
                        <div className="flex justify-center mt-4">
                            <a
                                href={audioUrl}
                                download={`${post.sound.title}.mp3`}
                                className="bg-[#8ACE01] text-white px-4 py-2 rounded-full"
                                onClick={(e) => e.stopPropagation()}  // Empêcher le déclenchement du son lors du clic sur le téléchargement
                            >
                                Download
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}