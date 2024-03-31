import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward, faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const songArr = [
    {
        artist: "Honey Singh",
        title: "Jingle Bell",
        music: "src/assets/audio/song-1-Jingle-Bell.mp3",
        image: "src/assets/images/144700-jingle-bell-yo-yo-honey-singh-mp3-song-300.jpg",
        backgroundColor: '#fd1d1d'
    },
    {
        artist: "Alan Walker",
        title: "Faded",
        music: "src/assets/audio/song-2-Faded.mp3",
        image: "src/assets/images/1716_4.jpg",
        backgroundColor: '#090979'

    },
    {
        artist: "Diljit Dosanjh",
        title: "Born to shine",
        music: "src/assets/audio/song-3-Born-To-Shine.mp3",
        image: "src/assets/images/thumb-goat-2020-diljit-dosanjh-mp3-songs-300.jpg",
        backgroundColor: "#fdbb2d"
    },
    {
        artist: "Ayushmann",
        title: "Jeda Nasha",
        music: "src/assets/audio/song-4-Jeda-Nasha.mp3",
        image: "src/assets/images/150674-jehda-nasha-an-action-hero-mp3-song-300.jpg",
        backgroundColor: "#eeaeca"
    },
];

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [totalDuration, setTotalDuration] = useState('3:16');
    const [progressWidth, setProgressWidth] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const audioRef = useRef(new Audio(songArr[currentSongIndex].music));
    const progressContainerRef = useRef(null);
    const imageRef = useRef(null);
    const [isRotating, setIsRotating] = useState(false);

    const togglePlayPause = () => {
        setIsPlaying(prevState => !prevState);
    };

    const setVolume = (volume) => {
        audioRef.current.volume = volume / 100;
    };

    const handleNextSong = () => {
        const nextIndex = (currentSongIndex + 1) % songArr.length;
        setCurrentSongIndex(nextIndex);
        playAudio(nextIndex);
    };

    const handlePrevSong = () => {
        const prevIndex = (currentSongIndex - 1 + songArr.length) % songArr.length;
        setCurrentSongIndex(prevIndex);
        playAudio(prevIndex);
    };

    const playAudio = (index) => {
        audioRef.current.src = songArr[index].music;
        audioRef.current.play();
        setIsPlaying(true);
    };

    const handleProgressBarClick = (e) => {
        const clickedPositionX = e.clientX;
        const progressBarRect = progressContainerRef.current.getBoundingClientRect();
        const progressBarWidth = progressBarRect.width;
        const clickedProgressPercentage = (clickedPositionX - progressBarRect.left) / progressBarWidth;
        const newCurrentTime = clickedProgressPercentage * audioRef.current.duration;
        audioRef.current.currentTime = newCurrentTime;
    };

    useEffect(() => {
        const music = audioRef.current;

        const updateProgress = () => {
            const { currentTime, duration } = music;
            const progressTime = (currentTime / duration) * 100;
            setProgressWidth(progressTime);

            const min_currentTime = Math.floor(currentTime / 60);
            const sec_currentTime = Math.floor(currentTime % 60);
            const formattedTime = `${min_currentTime}:${sec_currentTime < 10 ? `0${sec_currentTime}` : sec_currentTime}`;
            setCurrentTime(formattedTime);
        };

        music.addEventListener('timeupdate', updateProgress);

        return () => {
            music.removeEventListener('timeupdate', updateProgress);
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            setIsRotating(true);
        } else {
            audioRef.current.pause();
            setIsRotating(false);
        }
    }, [isPlaying]);

    return (
        <div className="main_div" style={{ background: `linear-gradient(90deg, ${songArr[currentSongIndex].backgroundColor} 0%, #FFFFFF 100%)` }}>
            <div className="music_container">
                <h2 id="title">{songArr[currentSongIndex].title}</h2>
                <h3 id="artist">{songArr[currentSongIndex].artist}</h3>
                <div className="img_container">
                    <img
                        ref={imageRef}
                        src={songArr[currentSongIndex].image}
                        alt="Album Art"
                        className={isRotating ? 'anime' : ''}
                    />
                </div>
                <div className="progressbar_container" ref={progressContainerRef} id="progress_container" onClick={handleProgressBarClick}>
                    <div className="progress_duration_meter">
                        <div id="current_time">{currentTime}</div>
                        <div id="duration">{totalDuration}</div>
                    </div>
                    <div className="progress_div" id="progress_div">
                        <div className="progress" id="progress" style={{ width: `${progressWidth}%` }}></div>
                    </div>
                </div>
                <div className="music_controls">
                    <FontAwesomeIcon icon={faBackward} onClick={handlePrevSong} title="Previous" />
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} onClick={togglePlayPause} className="main_button" title={isPlaying ? 'Pause' : 'Play'} />
                    <FontAwesomeIcon icon={faForward} onClick={handleNextSong} title="Next" />
                </div>
                <div className="slider_container">
                    <FontAwesomeIcon icon={faVolumeDown} />
                    <input type="range" min="1" max="100" defaultValue="51" className="volume_slider" onChange={(e) => setVolume(e.target.value)} />
                    <FontAwesomeIcon icon={faVolumeUp} />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
