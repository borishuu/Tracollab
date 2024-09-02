import React, {useEffect, useRef, useState} from "react";


export default function CustomMusicPlayer({post, setTimeAgo}) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        calculateTimeAgo(post.date);
    }, [post.date]);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        setElapsedTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleCanPlayThrough = () => {
        setIsAudioReady(true);
        setTotalDuration(audioRef.current.duration);
        audioRef.current.play(); // Lancer la lecture une fois que l'audio est prêt
        setIsPlaying(true);
    };

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

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const audio = audioRef.current;
        const newTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * audio.duration;
        audio.currentTime = newTime;
        setProgress((newTime / audio.duration) * 100);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const calculateTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diff = now.getTime() - postDate.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            setTimeAgo(`${years} year${years > 1 ? 's' : ''} ago`);
        } else if (months > 0) {
            setTimeAgo(`${months} month${months > 1 ? 's' : ''} ago`);
        } else if (days > 0) {
            setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`);
        } else if (hours > 0) {
            setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
        } else {
            setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
        }
    };

    const handleDownloadClick = async () => {
        if (!audioUrl) {
            setAudioUrl(post.sound.audioPath);
        }
        window.open(post.sound.audioPath, '_self');
    };

    return (
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
                        className="w-16 hidden sm:block"
                    />
                </div>

                <div
                    className="flex justify-center mt-4 rounded-xl bg-[#9732C2] p-2 cursor-pointer hover:bg-[#8ACE01] transition-colors duration-300"
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
    )
}