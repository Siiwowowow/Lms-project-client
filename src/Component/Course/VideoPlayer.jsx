import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Fullscreen, 
  Minimize2,
  ChevronRight,
  CheckCircle,
  Clock,
  List,
  SkipForward,
  Rewind
} from 'lucide-react';
import { RiForward10Line, RiReplay10Line } from 'react-icons/ri';

const VideoPlayer = () => {
    const course = useLoaderData();
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentVideo, setCurrentVideo] = useState(0);
    const [activeModule, setActiveModule] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const containerRef = useRef(null);
    const hideTimeoutRef = useRef(null);
    const playerRef = useRef(null);
    const animationRef = useRef(null);
    const volumeSliderRef = useRef(null);
    const progressBarRef = useRef(null);
    const controlsRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(80);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
    const [isSeeking, setIsSeeking] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    const [showTouchFeedback, setShowTouchFeedback] = useState(false);
    const [touchFeedbackTime, setTouchFeedbackTime] = useState(0);

    // Flatten all videos for easy navigation
    const allVideos = course.curriculum?.flatMap((module, moduleIndex) =>
        module.videos?.map((video, videoIndex) => ({
            ...video,
            moduleTitle: module.title,
            moduleIndex,
            videoIndex,
            globalIndex: course.curriculum.slice(0, moduleIndex).reduce((acc, m) => acc + (m.videos?.length || 0), 0) + videoIndex
        })) || []
    ) || [];

    const currentVideoData = allVideos[currentVideo];
    const currentVideoUrl = currentVideoData?.video_url || currentVideoData?.youtube_url;

    // Get YouTube video ID
    const getVideoId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&?\n]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(currentVideoUrl);

    // Responsive detection
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 768);
            setIsTablet(width <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fullscreen handling
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Enhanced Keyboard event listeners
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!playerRef.current) return;

            // Don't trigger if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    if (e.shiftKey) {
                        handlePreviousVideo();
                    } else {
                        skip(-10);
                        showSkipFeedback(-10);
                    }
                    break;
                case 'arrowright':
                case 'l':
                    e.preventDefault();
                    if (e.shiftKey) {
                        handleNextVideo();
                    } else {
                        skip(10);
                        showSkipFeedback(10);
                    }
                    break;
                case 'arrowup':
                    e.preventDefault();
                    handleVolumeChange(Math.min(100, volume + 10));
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    handleVolumeChange(Math.max(0, volume - 10));
                    break;
                case '>':
                case '.':
                    e.preventDefault();
                    handleNextVideo();
                    break;
                case '<':
                case ',':
                    e.preventDefault();
                    handlePreviousVideo();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    const percentage = parseInt(e.key) * 10;
                    seekToPercentage(percentage);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [volume, currentVideo, allVideos.length]);

    // Touch gestures for mobile
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Horizontal swipe (seek)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            e.preventDefault();
            const seekAmount = diffX > 0 ? -10 : 10;
            skip(seekAmount);
            showSkipFeedback(seekAmount);
            setTouchStartX(touchEndX);
            setTouchStartY(touchEndY);
        }
        
        // Vertical swipe on right side (volume)
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50 && touchStartX > window.innerWidth * 0.7) {
            e.preventDefault();
            const volumeChange = diffY > 0 ? -10 : 10;
            handleVolumeChange(Math.max(0, Math.min(100, volume + volumeChange)));
            setTouchStartX(touchEndX);
            setTouchStartY(touchEndY);
        }
    };

    const handleTouchEnd = () => {
        setTouchStartX(null);
        setTouchStartY(null);
    };

    // Show skip feedback
    const showSkipFeedback = (seconds) => {
        setTouchFeedbackTime(seconds);
        setShowTouchFeedback(true);
        setTimeout(() => setShowTouchFeedback(false), 1000);
    };

    // Click outside to close volume slider and speed menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
                setShowVolumeSlider(false);
            }
            if (!event.target.closest('.speed-control')) {
                setShowSpeedMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Reset hide timeout for controls
    const resetHideTimeout = useCallback(() => {
        setShowControls(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (isPlaying) {
            hideTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
                setShowSpeedMenu(false);
                setShowVolumeSlider(false);
            }, 3000);
        }
    }, [isPlaying]);

    // Auto-hide controls for mobile
    useEffect(() => {
        if (isMobile && isPlaying) {
            resetHideTimeout();
        }
    }, [isMobile, isPlaying, resetHideTimeout]);

    // YouTube Player creation
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
                            // Mark as completed and auto-play next video
                            setCompletedVideos(prev => new Set([...prev, currentVideo]));
                            if (currentVideo < allVideos.length - 1) {
                                setTimeout(() => handleNextVideo(), 2000);
                            }
                            break;
                    }
                },
            },
        });
    };

    // Initialize YouTube player
    useEffect(() => {
        if (!currentVideoUrl) return;
        
        if (playerRef.current && playerRef.current.destroy) {
            playerRef.current.destroy();
        }

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

    // Animation frame for time updates
    const startAnimation = () => {
        const update = () => {
            if (playerRef.current && playerRef.current.getCurrentTime && !isSeeking) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
            animationRef.current = requestAnimationFrame(update);
        };
        animationRef.current = requestAnimationFrame(update);
    };

    const stopAnimation = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    // Utility functions
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

    const skip = (seconds) => {
        if (!playerRef.current) return;
        const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
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
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        resetHideTimeout();
    };

    const handleSpeedChange = (speed) => {
        if (!playerRef.current) return;
        playerRef.current.setPlaybackRate(speed);
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
        resetHideTimeout();
    };

    const handleVideoSelect = (globalIndex) => {
        setCurrentVideo(globalIndex);
        resetHideTimeout();
    };

    const handleNextVideo = () => {
        if (currentVideo < allVideos.length - 1) {
            setCurrentVideo(prev => prev + 1);
        }
    };

    const handlePreviousVideo = () => {
        if (currentVideo > 0) {
            setCurrentVideo(prev => prev - 1);
        }
    };

    // Progress bar click handler
    const handleProgressClick = (e) => {
        if (!progressBarRef.current || !playerRef.current) return;
        
        const rect = progressBarRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;
        
        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
        resetHideTimeout();
    };

    // Seek to percentage (0-100)
    const seekToPercentage = (percentage) => {
        if (!playerRef.current) return;
        const newTime = (percentage / 100) * duration;
        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
        resetHideTimeout();
    };

    // Volume up/down functions
    const volumeUp = () => {
        handleVolumeChange(Math.min(100, volume + 10));
    };

    const volumeDown = () => {
        handleVolumeChange(Math.max(0, volume - 10));
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // No curriculum fallback
    if (!course.curriculum || course.curriculum.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">No Curriculum Available</h2>
                    <button
                        onClick={() => navigate(`/courses/${id}`)}
                        className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header - Hidden on mobile in fullscreen */}
            {(!isFullscreen || !isMobile) && (
                <div className="bg-gray-800 border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold truncate">{course.title}</h1>
                                <p className="text-gray-400 text-sm truncate">
                                    {currentVideoData?.moduleTitle} • {currentVideoData?.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors flex-shrink-0 ml-4"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Video Player - Main Content */}
                    <div className={`${sidebarOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                        <div
                            ref={containerRef}
                            className={`bg-black rounded-xl overflow-hidden relative ${
                                isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'
                            }`}
                            onMouseMove={resetHideTimeout}
                            onTouchStart={(e) => {
                                resetHideTimeout();
                                handleTouchStart(e);
                            }}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={togglePlay}
                        >
                            {/* YouTube Player */}
                            <div id="youtube-player" className="w-full h-full" />

                            {/* Touch Feedback Overlay */}
                            {showTouchFeedback && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                    <div className="bg-black/70 rounded-full p-4 sm:p-6">
                                        <div className="text-white text-2xl sm:text-4xl font-bold text-center">
                                            {touchFeedbackTime > 0 ? '+' : ''}{touchFeedbackTime}s
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Overlay Controls */}
                            {showControls && (
                                <div 
                                    ref={controlsRef}
                                    className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent"
                                >
                                    {/* Progress Bar */}
                                    <div className="px-3 sm:px-4 mb-3 sm:mb-4">
                                        <div className="flex items-center space-x-2 sm:space-x-3 text-sm text-gray-300">
                                            <span className="w-10 sm:w-12 text-right text-xs sm:text-sm">
                                                {formatTime(currentTime)}
                                            </span>
                                            <div
                                                ref={progressBarRef}
                                                className="flex-1 bg-white/30 rounded-full h-1.5 sm:h-2 cursor-pointer group relative"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProgressClick(e);
                                                }}
                                            >
                                                <div 
                                                    className="bg-red-600 h-1.5 sm:h-2 rounded-full relative transition-all duration-150 group-hover:bg-red-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                >
                                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg transition-opacity" />
                                                </div>
                                            </div>
                                            <span className="w-10 sm:w-12 text-xs sm:text-sm">{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                                        <div className="flex items-center justify-between">
                                            {/* Left Controls */}
                                            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                                                {/* Previous Video - Hidden on mobile */}
                                                {!isMobile && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handlePreviousVideo(); }}
                                                        disabled={currentVideo === 0}
                                                        className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Previous video"
                                                    >
                                                        <Rewind className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                    </button>
                                                )}

                                                {/* Skip Backward 10s */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); skip(-10); }}
                                                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                                                    title="Rewind 10s"
                                                >
                                                    <RiReplay10Line className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                                </button>

                                                {/* Play/Pause */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                                    className="p-2 sm:p-3 hover:bg-white/10 rounded-full transition-colors"
                                                    title={isPlaying ? "Pause" : "Play"}
                                                >
                                                    {isPlaying ? (
                                                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                                    ) : (
                                                        <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                                    )}
                                                </button>

                                                {/* Skip Forward 10s */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); skip(10); }}
                                                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                                                    title="Forward 10s"
                                                >
                                                    <RiForward10Line className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                                </button>

                                                {/* Next Video - Hidden on mobile */}
                                                {!isMobile && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleNextVideo(); }}
                                                        disabled={currentVideo === allVideos.length - 1}
                                                        className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Next video"
                                                    >
                                                        <SkipForward className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                    </button>
                                                )}

                                                {/* Volume Control */}
                                                <div ref={volumeSliderRef} className="relative flex items-center space-x-0.5 sm:space-x-1">
                                                    {/* Volume Down Button */}
                                                    <button
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            volumeDown();
                                                        }}
                                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                                        title="Volume Down"
                                                    >
                                                        <span className="text-xs font-bold">−</span>
                                                    </button>

                                                    {/* Volume Button with Slider */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setShowVolumeSlider(!showVolumeSlider);
                                                            }}
                                                            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                                                            title={volume > 0 ? "Mute" : "Unmute"}
                                                        >
                                                            {volume > 0 ? (
                                                                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                            ) : (
                                                                <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                            )}
                                                        </button>
                                                        
                                                        {/* Volume Slider */}
                                                        {showVolumeSlider && (
                                                            <div 
                                                                className={`absolute bg-black/90 rounded-lg p-2 sm:p-3 ${
                                                                    isMobile 
                                                                        ? 'bottom-full left-0 mb-2' 
                                                                        : 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    value={volume}
                                                                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                                                    className={`bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white ${
                                                                        isMobile 
                                                                            ? 'w-20 h-1 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3' 
                                                                            : 'w-16 h-1 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5'
                                                                    }`}
                                                                    orient={isMobile ? "vertical" : "horizontal"}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Volume Up Button */}
                                                    <button
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            volumeUp();
                                                        }}
                                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                                        title="Volume Up"
                                                    >
                                                        <span className="text-xs font-bold">+</span>
                                                    </button>
                                                </div>

                                                {/* Time Display for Mobile */}
                                                {isMobile && (
                                                    <div className="text-xs text-gray-300 px-1">
                                                        {formatTime(currentTime)} / {formatTime(duration)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Controls */}
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                {/* Current Video Info for Desktop */}
                                                {!isMobile && (
                                                    <div className="text-xs sm:text-sm text-gray-300 hidden md:block">
                                                        {currentVideo + 1} / {allVideos.length}
                                                    </div>
                                                )}

                                                {/* Speed Control */}
                                                <div className="relative speed-control">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                                                        className={`bg-white/10 rounded hover:bg-white/20 transition-colors ${
                                                            isMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1'
                                                        }`}
                                                        title="Playback speed"
                                                    >
                                                        {playbackSpeed}x
                                                    </button>
                                                    {showSpeedMenu && (
                                                        <div className={`absolute bottom-full mb-2 bg-black/90 rounded-lg shadow-lg overflow-hidden z-10 ${
                                                            isMobile ? 'right-0 w-14' : 'left-0 w-16 sm:w-20'
                                                        }`}>
                                                            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                                                                <button
                                                                    key={speed}
                                                                    onClick={(e) => { e.stopPropagation(); handleSpeedChange(speed); }}
                                                                    className={`w-full hover:bg-white/10 transition-colors ${
                                                                        speed === playbackSpeed ? 'bg-blue-600 text-white' : 'text-gray-300'
                                                                    } ${isMobile ? 'text-xs text-center px-2 py-2' : 'text-sm px-3 py-2 text-left'}`}
                                                                >
                                                                    {speed}x
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Fullscreen */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                                                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                                >
                                                    {isFullscreen ? (
                                                        <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                    ) : (
                                                        <Fullscreen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Play/Pause Center Button */}
                            {!isPlaying && showControls && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                        className="p-3 sm:p-4 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-white" />
                                    </button>
                                </div>
                            )}

                            {/* Mobile Top Controls in Fullscreen */}
                            {isMobile && isFullscreen && showControls && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                        >
                                            <Minimize2 className="w-4 h-4" />
                                        </button>
                                        <div className="text-sm text-white truncate max-w-[70%]">
                                            {currentVideoData?.title}
                                        </div>
                                        <div className="w-8"></div> {/* Spacer for balance */}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Info Section - Hidden on mobile in fullscreen */}
                        {(!isFullscreen || !isMobile) && (
                            <div className="mt-4 sm:mt-6 bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 truncate">{currentVideoData?.title}</h2>
                                        <div className="flex items-center space-x-2 sm:space-x-4 text-gray-300 text-xs sm:text-sm flex-wrap">
                                            <span className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>{formatTime(duration)}</span>
                                            </span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="text-blue-400 font-medium truncate">{currentVideoData?.moduleTitle}</span>
                                        </div>
                                        {currentVideoData?.description && (
                                            <p className="mt-2 sm:mt-3 text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base line-clamp-3">
                                                {currentVideoData.description}
                                            </p>
                                        )}
                                    </div>
                                    {completedVideos.has(currentVideo) && (
                                        <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg ml-2 sm:ml-4 flex-shrink-0">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Completed</span>
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                                    <button
                                        onClick={handlePreviousVideo}
                                        disabled={currentVideo === 0}
                                        className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm"
                                    >
                                        <Rewind className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Previous</span>
                                    </button>
                                    
                                    <button
                                        onClick={handleNextVideo}
                                        disabled={currentVideo === allVideos.length - 1}
                                        className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm"
                                    >
                                        <span>Next Lesson</span>
                                        <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Course Curriculum */}
                    {sidebarOpen && (
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800 rounded-xl p-3 sm:p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="font-bold text-base sm:text-lg">Course Content</h3>
                                    <span className="text-xs sm:text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                        {allVideos.length} {allVideos.length === 1 ? 'lesson' : 'lessons'}
                                    </span>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto">
                                    <div className="space-y-2 sm:space-y-3">
                                        {course.curriculum.map((module, moduleIndex) => {
                                            const moduleVideos = module.videos || [];
                                            const completedCount = moduleVideos.filter((_, videoIndex) => {
                                                const globalIndex = course.curriculum
                                                    .slice(0, moduleIndex)
                                                    .reduce((acc, m) => acc + (m.videos?.length || 0), 0) + videoIndex;
                                                return completedVideos.has(globalIndex);
                                            }).length;

                                            return (
                                                <div key={moduleIndex} className="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600/50">
                                                    <button
                                                        onClick={() => setActiveModule(activeModule === moduleIndex ? -1 : moduleIndex)}
                                                        className="w-full flex items-center justify-between p-2 sm:p-3 text-left hover:bg-gray-600/30 transition-colors"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm truncate">{module.title}</div>
                                                            <div className="text-xs text-gray-400 mt-0.5 flex items-center space-x-1 sm:space-x-2">
                                                                <span>{moduleVideos.length} lessons</span>
                                                                {completedCount > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="text-green-400">
                                                                            {completedCount} completed
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ChevronRight 
                                                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${
                                                                activeModule === moduleIndex ? 'rotate-90' : ''
                                                            }`} 
                                                        />
                                                    </button>
                                                    
                                                    {activeModule === moduleIndex && (
                                                        <div className="border-t border-gray-600/50">
                                                            {moduleVideos.map((video, videoIndex) => {
                                                                const globalIndex = course.curriculum
                                                                    .slice(0, moduleIndex)
                                                                    .reduce((acc, m) => acc + (m.videos?.length || 0), 0) + videoIndex;
                                                                
                                                                return (
                                                                    <button
                                                                        key={videoIndex}
                                                                        onClick={() => handleVideoSelect(globalIndex)}
                                                                        className={`w-full text-left p-2 sm:p-3 text-xs sm:text-sm border-l-2 transition-all group ${
                                                                            currentVideo === globalIndex
                                                                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                                                                : 'border-transparent text-gray-300 hover:bg-gray-600/20'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                                                                                completedVideos.has(globalIndex)
                                                                                    ? 'bg-green-500 text-white'
                                                                                    : currentVideo === globalIndex
                                                                                    ? 'bg-blue-500 text-white'
                                                                                    : 'bg-gray-600 text-gray-300 group-hover:bg-gray-500'
                                                                            }`}>
                                                                                {completedVideos.has(globalIndex) ? (
                                                                                    <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                                                                ) : (
                                                                                    videoIndex + 1
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="font-medium truncate text-left">{video.title}</div>
                                                                                {video.duration && (
                                                                                    <div className="text-xs text-gray-400 mt-0.5 flex items-center space-x-1 sm:space-x-2">
                                                                                        <span>{video.duration}</span>
                                                                                        {completedVideos.has(globalIndex) && (
                                                                                            <span className="text-green-400 flex items-center space-x-1">
                                                                                                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                                                                                <span>Completed</span>
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;