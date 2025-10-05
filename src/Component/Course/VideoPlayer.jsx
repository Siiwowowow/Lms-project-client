import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { IoPauseCircleOutline, IoPlayCircleOutline } from "react-icons/io5";
import { MdFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { RiForward10Line, RiReplay10Fill } from "react-icons/ri";

const VideoPlayer = () => {
    const course = useLoaderData();
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentVideo, setCurrentVideo] = useState(0);
    const [activeModule, setActiveModule] = useState(0);

    const containerRef = useRef(null);
    const hideTimeoutRef = useRef(null);
    const playerRef = useRef(null);
    const animationRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(80);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.2);

    const allVideos = course.curriculum?.flatMap((module) =>
        module.videos?.map(video => ({
            ...video,
            moduleTitle: module.title,
            moduleWeek: module.week
        })) || []
    ) || [];

    const currentVideoData = allVideos[currentVideo];
    const currentVideoUrl = currentVideoData?.video_url || currentVideoData?.youtube_url;

    const getVideoId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&?\n]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(currentVideoUrl);

    // Mobile / tablet redirect to YouTube
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                if (currentVideoData?.youtube_url) {
                    window.location.href = currentVideoData.youtube_url;
                }
            } else {
                setIsFullscreen(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [currentVideoData]);

    const resetHideTimeout = useCallback(() => {
        setShowControls(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (isPlaying) {
            hideTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
                setShowSpeedMenu(false);
            }, 3000);
        }
    }, [isPlaying]);

    const createPlayer = () => {
        if (!videoId) return;
        playerRef.current = new window.YT.Player('youtube-player', {
            videoId,
            height: '100%',
            width: '100%',
            playerVars: {
                playsinline: 1,
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                rel: 0,
                enablejsapi: 1,
                origin: window.location.origin,
            },
            events: {
                onReady: (event) => {
                    event.target.setVolume(volume);
                    setDuration(event.target.getDuration());
                },
                onStateChange: (event) => {
                    switch (event.data) {
                        case window.YT.PlayerState.PLAYING:
                            setIsPlaying(true);
                            startAnimation();
                            break;
                        case window.YT.PlayerState.PAUSED:
                            setIsPlaying(false);
                            stopAnimation();
                            break;
                        case window.YT.PlayerState.ENDED:
                            setIsPlaying(false);
                            stopAnimation();
                            if (currentVideo < allVideos.length - 1) setCurrentVideo(currentVideo + 1);
                            break;
                    }
                },
            },
        });
    };

    useEffect(() => {
        if (!currentVideoUrl) return;
        if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = createPlayer;
        } else {
            createPlayer();
        }
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        return () => stopAnimation();
    }, [currentVideo, videoId]);

    const startAnimation = () => {
        const update = () => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
            animationRef.current = requestAnimationFrame(update);
        };
        animationRef.current = requestAnimationFrame(update);
    };

    const stopAnimation = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlay = () => {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
        resetHideTimeout();
    };

    const skipForward = () => {
        if (!playerRef.current) return;
        const newTime = Math.min(currentTime + 10, duration);
        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
        resetHideTimeout();
    };

    const skipBackward = () => {
        if (!playerRef.current) return;
        const newTime = Math.max(currentTime - 10, 0);
        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
        resetHideTimeout();
    };

    const handleVolumeChange = (val) => {
        if (!playerRef.current) return;
        playerRef.current.setVolume(val);
        setVolume(val);
        resetHideTimeout();
    };

    const toggleMute = () => handleVolumeChange(volume > 0 ? 0 : 80);
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) containerRef.current.requestFullscreen();
        else document.exitFullscreen();
        resetHideTimeout();
    };

    const handleSpeedChange = (speed) => {
        if (!playerRef.current) return;
        playerRef.current.setPlaybackRate(speed);
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
        resetHideTimeout();
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (!course.curriculum || course.curriculum.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">No Curriculum Available</h2>
                    <button
                        onClick={() => navigate(`/courses/${id}`)}
                        className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Video Player */}
                    <div className="lg:col-span-3">
                        <div
                            ref={containerRef}
                            className={`bg-black rounded-2xl relative ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'}`}
                            onMouseMove={resetHideTimeout}
                            onTouchStart={resetHideTimeout}
                        >
                            <div className={`relative bg-black ${isFullscreen ? 'h-screen' : 'h-64 sm:h-80 md:h-96 lg:h-[500px]'}`} onClick={togglePlay}>
                                <div id="youtube-player" className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                                    {!playerRef.current && <span>Loading video...</span>}
                                </div>

                                {/* Controls */}
                                {showControls && (
                                    <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        {/* Progress Bar */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <span className="text-xs font-mono">{formatTime(currentTime)}</span>
                                            <div
                                                className="flex-1 bg-white/30 rounded-full h-2 cursor-pointer"
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const percent = (e.clientX - rect.left) / rect.width;
                                                    const newTime = percent * duration;
                                                    playerRef.current.seekTo(newTime, true);
                                                    setCurrentTime(newTime);
                                                }}
                                            >
                                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-150" style={{ width: `${progressPercentage}%` }}></div>
                                            </div>
                                            <span className="text-xs font-mono">{formatTime(duration)}</span>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-between items-center relative">
                                            <div className="flex space-x-3 items-center">
                                                <button onClick={togglePlay}>{isPlaying ? <IoPauseCircleOutline /> : <IoPlayCircleOutline />}</button>
                                                <button onClick={skipBackward}><RiReplay10Fill /></button>
                                                <button onClick={skipForward}><RiForward10Line /></button>
                                                <button onClick={toggleMute}>{volume > 0 ? '🔊' : '🔇'}</button>

                                                {/* Volume Slider */}
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={volume}
                                                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                                    className="w-20"
                                                />

                                                {/* Speed */}
                                                <div className="relative">
                                                    <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="px-2 py-1 bg-white/10 rounded">{playbackSpeed}x</button>
                                                    {showSpeedMenu && (
                                                        <div className="absolute bottom-10 left-0 w-20 p-2 bg-white/10 backdrop-blur-sm rounded shadow-lg flex flex-col space-y-1">
                                                            {[1, 1.2, 1.5, 2].map((speed) => (
                                                                <button
                                                                    key={speed}
                                                                    className={`text-xs text-white hover:bg-white/20 rounded p-1 ${speed === playbackSpeed ? 'bg-white/20' : ''}`}
                                                                    onClick={() => handleSpeedChange(speed)}
                                                                >
                                                                    {speed}x
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={toggleFullscreen}>{isFullscreen ? <MdOutlineFullscreenExit /> : <MdFullscreen />}</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="mt-4 bg-gray-800 rounded-lg p-4">
                            <h3 className="text-xl font-bold">{currentVideoData?.title}</h3>
                            <p className="text-gray-300">{currentVideoData?.moduleTitle}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Modules</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {course.curriculum.map((module, moduleIndex) => (
                                    <div key={moduleIndex}>
                                        <div
                                            className={`p-2 cursor-pointer ${activeModule === moduleIndex ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}
                                            onClick={() => setActiveModule(moduleIndex)}
                                        >
                                            {module.title}
                                        </div>
                                        {activeModule === moduleIndex && module.videos?.map((video, videoIndex) => {
                                            const globalIndex = course.curriculum.slice(0, moduleIndex).reduce((acc, m) => acc + (m.videos?.length || 0), 0) + videoIndex;
                                            return (
                                                <button
                                                    key={videoIndex}
                                                    onClick={() => setCurrentVideo(globalIndex)}
                                                    className={`w-full text-left p-2 ${currentVideo === globalIndex ? 'bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
                                                >
                                                    {video.title}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
