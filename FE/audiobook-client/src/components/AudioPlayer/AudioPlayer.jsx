import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward, faRedo } from '@fortawesome/free-solid-svg-icons';

const AudiobookPlayer = ({audioFiles = []}) => {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isLooping, setIsLooping] = useState(false);
    const audioRef = useRef(null);
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        if (audioFiles.length === 0) return;

        const audio = audioRef.current;
        audio.src = audioFiles[currentTrack].fileUrl; // ✅ Sử dụng fileUrl thay vì src

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
        };
    }, [currentTrack, audioFiles]);
    useEffect(() => {
        if (audioFiles.length > 0) {
            setPlaylist(audioFiles);  // ✅ Cập nhật playlist từ audioFiles
        }
    }, [audioFiles]);
    

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const changeTrack = (index) => {
        setCurrentTrack(index);
        setIsPlaying(false);
        audioRef.current.src = playlist[index].src;
        audioRef.current.load();
        audioRef.current.play();
        setIsPlaying(true);
    };

    const seekAudio = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const rewind = () => {
        audioRef.current.currentTime = Math.max(0, currentTime - 30);
    };

    const forward = () => {
        audioRef.current.currentTime = Math.min(duration, currentTime + 30);
    };

    const toggleRepeat = () => {
        setIsLooping(!isLooping);
        audioRef.current.loop = !isLooping;
    };

    const changeSpeed = () => {
        const newRate = playbackRate === 1 ? 2 : 1;
        setPlaybackRate(newRate);
        audioRef.current.playbackRate = newRate;
    };

    

    return (
        <div className="player">
            <div className="audio-info">
                <div className="details">
                    <button onClick={togglePlay} className="btn">
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                    </button>
                    <span>{`Phần ${currentTrack + 1}`}</span>

                </div>
            </div>
            <div className="time-info">
                <span>{formatTime(currentTime)}</span>
                <input type="range" id="progress" value={(currentTime / duration) * 100 || 0} onChange={seekAudio} />
                <span>{formatTime(duration)}</span>
            </div>
            <div className="controls">
                <button className="btn" onClick={rewind}>-30s</button>
                <button className="btn" onClick={forward}>+30s</button>
                <button className="btn" onClick={changeSpeed}>x{playbackRate}</button>
            </div>
            <ul id="playlist">
                {playlist.map((track, index) => (
                    <li key={index} onClick={() => changeTrack(index)} className={index === currentTrack ? "active" : ""}>
                        {`Phần ${index + 1}`}
                    </li>
                ))}
            </ul>
            <audio ref={audioRef} src={playlist[currentTrack]?.fileUrls} loop={isLooping}></audio>
        </div>
    );
};

export default AudiobookPlayer;