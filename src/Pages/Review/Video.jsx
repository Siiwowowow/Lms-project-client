import React, { useRef, useEffect, useState, useCallback } from "react";

import { IoPauseCircleOutline, IoPlayCircleOutline, IoVolumeHighOutline } from "react-icons/io5";
import { MdFullscreen, MdOutlineFullscreenExit, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { RiForward10Line, RiReplay10Fill, RiReplay10Line } from "react-icons/ri";

const Video = () => {
  
  const youtubeUrl = "https://youtu.be/h7r5AdQfk4g?si=NlcCqUSignFNiteU";
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);

  const playbackRates = [2.0, 1.5, 1.25, 1.0];
  const availableQualities = ['highres', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'auto'];

  const getVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&?\n]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  // Check for mobile and handle fullscreen state change (Crucial for controls logic)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Reset timeout and show controls briefly when entering/exiting fullscreen
      resetHideTimeout(); 
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-hide controls logic
  const resetHideTimeout = useCallback(() => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Always show controls immediately on interaction
    setShowControls(true);
    
    // Set a new timeout to hide controls if the video is playing
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowVolumeSlider(false);
        setShowSpeedMenu(false);
        setShowResolutionMenu(false); // Hide resolution menu
      }, 3000);
    }
  }, [isPlaying]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      createPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = createPlayer;

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Create YouTube Player
  const createPlayer = () => {
    if (!videoId) return;

    const newPlayer = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        'playsinline': 1,
        'controls': 0,
        'disablekb': 1,
        'modestbranding': 1,
        'rel': 0,
        'enablejsapi': 1,
        'origin': window.location.origin,
        'vq': quality, 
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError,
        'onPlaybackQualityChange': onPlaybackQualityChange, 
      }
    });

    setPlayer(newPlayer);
  };

  const onPlayerReady = (event) => {
    console.log('YouTube Player Ready');
    setDuration(event.target.getDuration());
    event.target.setVolume(volume);
    setPlaybackRate(event.target.getPlaybackRate()); 
    setQuality(event.target.getPlaybackQuality()); 
    startTimeUpdate();
  };

  const onPlayerStateChange = (event) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        resetHideTimeout();
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        setShowControls(true);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        setShowControls(true);
        break;
      default:
        break;
    }
  };

  const onPlayerError = (event) => {
    console.error('YouTube Player Error:', event.data);
  };

  // Handle quality change event
  const onPlaybackQualityChange = (event) => {
      setQuality(event.data);
  };


  const startTimeUpdate = () => {
    const updateTime = () => {
      if (player && player.getCurrentTime) {
        const time = player.getCurrentTime();
        setCurrentTime(time);
      }
      if (isPlaying) {
        requestAnimationFrame(updateTime);
      }
    };
    updateTime();
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
        startTimeUpdate();
      }
    }
    resetHideTimeout();
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (player) {
      const newTime = Math.min(currentTime + 10, duration);
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
    resetHideTimeout();
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (player) {
      const newTime = Math.max(currentTime - 10, 0);
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
    resetHideTimeout();
  };

  // Handle playback rate change
  const handleRateChange = (rate) => {
    if (player) {
      player.setPlaybackRate(rate);
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
    }
    resetHideTimeout();
  };

  // Handle video quality change
  const handleQualityChange = (newQuality) => {
    if (player) {
      player.setPlaybackQuality(newQuality);
      setQuality(newQuality);
      setShowResolutionMenu(false);
    }
    resetHideTimeout();
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    if (player) {
      player.setVolume(newVolume);
      setVolume(newVolume);
    }
    resetHideTimeout();
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (player) {
      if (volume > 0) {
        player.setVolume(0);
        setVolume(0);
      } else {
        player.setVolume(80);
        setVolume(80);
      }
    }
    resetHideTimeout();
  };

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

  // Get display name for quality
  const getQualityDisplayName = (q) => {
    if (q === 'hd1080') return '1080p';
    if (q === 'hd720') return '720p';
    if (q === 'large') return '480p';
    if (q === 'medium') return '360p';
    if (q === 'small') return '240p';
    if (q === 'tiny') return '144p';
    if (q === 'highres') return '4K+';
    return 'Auto';
  };


  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    resetHideTimeout();
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    resetHideTimeout();
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle container interactions
  const handleContainerInteraction = () => {
    resetHideTimeout();
  };

  // Handle mouse leave specifically to hide controls
  const handleMouseLeave = () => {
    if (isPlaying && !isMobile) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      // Hide controls faster when the cursor leaves the video area
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowVolumeSlider(false);
        setShowSpeedMenu(false);
        setShowResolutionMenu(false);
      }, 500); 
    }
  }


  return (
    <div 
      ref={containerRef}
      className={`mx-auto w-full bg-black rounded-2xl shadow-2xl transition-all duration-300 select-none relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'max-w-4xl'
      }`}
      onMouseEnter={handleContainerInteraction}
      onMouseMove={handleContainerInteraction}
      onMouseLeave={handleMouseLeave} 
      onTouchStart={handleTouchStart}
    >
      {/* Video Player */}
      <div 
        className={`relative bg-black ${isFullscreen ? 'h-screen' : 'h-64 sm:h-80 md:h-96 lg:h-[500px]'}`}
        // Double-tap/Double-click to play/pause in the middle
        onClick={togglePlay} 
      >
        {/* YouTube Player Container */}
        <div id="youtube-player" className="w-full h-full">
          {!player && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">📺</div>
                <p className="text-lg sm:text-xl mb-2">ভিডিও লোড হচ্ছে...</p>
                <button 
                  onClick={createPlayer}
                  className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-lg"
                >
                  রিট্রাই
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Simple Controls Overlay */}
        <div 
          ref={controlsRef}
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onMouseEnter={resetHideTimeout}
          onTouchStart={handleTouchStart}
        >
          {/* Center Play/Pause Button - Show only when paused or when controls are visible */}
          {(!isPlaying || !showControls) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                // Use onMouseDown/onTouchStart to prevent the outer div's onClick (togglePlay) from firing twice
                onMouseDown={(e) => { e.stopPropagation(); togglePlay(); }}
                onTouchStart={(e) => { e.stopPropagation(); togglePlay(); }}
                className="p-4 sm:p-6 md:p-8 transition-all duration-300"
              >
                {isPlaying ? (
                  <span className="text-white text-2xl sm:text-4xl md:text-6xl opacity-80 hover:opacity-100"><IoPauseCircleOutline /></span>
                ) : (
                  <span className="text-white text-2xl sm:text-4xl md:text-6xl opacity-80 hover:opacity-100"><IoPlayCircleOutline /></span>
                )}
              </button>
            </div>
          )}

          {/* NO MORE CENTER SKIP BUTTONS - MOVED TO BOTTOM */}

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 pointer-events-auto">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
              <span className="text-white text-xs sm:text-sm font-mono min-w-10 sm:min-w-12">
                {formatTime(currentTime)}
              </span>
              <div 
                className="flex-1 bg-white/30 rounded-full h-2 sm:h-3 cursor-pointer relative"
                onClick={(e) => {
                  if (player) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * duration;
                    player.seekTo(newTime, true);
                    setCurrentTime(newTime);
                    resetHideTimeout();
                  }
                }}
              >
                <div 
                  className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-100"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-white text-xs sm:text-sm font-mono min-w-10 sm:min-w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
                
                {/* 1. Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-colors"
                >
                  {isPlaying ? <IoPauseCircleOutline /> : <IoPlayCircleOutline />}
                </button>

                {/* 2. Skip Backward 10s (REORGANIZED: Now visible on all devices) */}
                <button
                  onClick={skipBackward}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-colors"
                >
                  <RiReplay10Fill />
                </button>

                {/* 3. Skip Forward 10s (REORGANIZED: Now visible on all devices) */}
                <button
                  onClick={skipForward}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-colors"
                >
                  <RiForward10Line />
                </button>

                {/* 4. Volume Control */}
                <div className="flex items-center space-x-2 relative">
                  <button
                    onClick={toggleMute}
                    className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-colors"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onTouchStart={() => setShowVolumeSlider(!showVolumeSlider)}
                  >
                    {getVolumeIcon()}
                  </button>

                  {/* Volume Slider */}
                  {(showVolumeSlider || isMobile) && (
                    <div 
                      className={`absolute left-10 -top-2 bg-black/90 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-2xl border border-white/20 z-10 ${
                        isMobile ? 'bottom-10' : ''
                      }`}
                      onMouseLeave={() => !isMobile && setShowVolumeSlider(false)}
                    >
                      <div className="flex items-center space-x-2">
                        {!isMobile && (
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                            className="w-20 sm:w-24 h-1 sm:h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          />
                        )}
                        {isMobile && (
                          <div className="flex flex-col items-center space-y-2">
                            <button
                              onClick={() => handleVolumeChange(Math.min(volume + 25, 100))}
                              className="text-white text-lg"
                            >
                              <IoVolumeHighOutline />
                            </button>
                            <span className="text-white text-xs font-bold">
                              {volume}%
                            </span>
                            <button
                              onClick={() => handleVolumeChange(Math.max(volume - 25, 0))}
                              className="text-white text-lg"
                            >
                              🔈
                            </button>
                          </div>
                        )}
                        {!isMobile && (
                          <span className="text-white text-xs sm:text-sm font-bold min-w-8">
                            {volume}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side controls: Playback Speed, Quality, and Fullscreen */}
              <div className="flex items-center space-x-3 sm:space-x-4 relative">
                
                {/* Playback Rate Control Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSpeedMenu(!showSpeedMenu);
                      setShowResolutionMenu(false); 
                      resetHideTimeout();
                    }}
                    className="text-white text-sm sm:text-base font-bold px-2 py-1 rounded hover:bg-white/20 transition-colors"
                  >
                    {playbackRate.toFixed(2)}x
                  </button>

                  {/* Speed Menu Dropdown */}
                  {showSpeedMenu && (
                    <div 
                      className="absolute bottom-full right-0 mb-2 w-28 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 overflow-hidden z-10"
                      onMouseLeave={() => setShowSpeedMenu(false)}
                    >
                      {playbackRates.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleRateChange(rate)}
                          className={`block w-full py-2 px-3 text-left text-sm transition-colors ${
                            rate === playbackRate 
                              ? 'bg-blue-600 text-white font-bold' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {rate.toFixed(2)}x {rate === 1.0 && '(Normal)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Resolution Control Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowResolutionMenu(!showResolutionMenu);
                      setShowSpeedMenu(false); 
                      resetHideTimeout();
                    }}
                    className="text-white text-sm sm:text-base font-bold px-2 py-1 rounded hover:bg-white/20 transition-colors"
                  >
                    {getQualityDisplayName(quality)}
                  </button>

                  {/* Resolution Menu Dropdown */}
                  {showResolutionMenu && (
                    <div 
                      className="absolute bottom-full right-0 mb-2 w-28 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 overflow-hidden z-10"
                      onMouseLeave={() => setShowResolutionMenu(false)}
                    >
                      {availableQualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQualityChange(q)}
                          className={`block w-full py-2 px-3 text-left text-sm transition-colors ${
                            q === quality 
                              ? 'bg-blue-600 text-white font-bold' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {getQualityDisplayName(q)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>


                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-colors"
                >
                  {isFullscreen ? <MdOutlineFullscreenExit /> : <MdFullscreen />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tap Area - For showing controls on tap */}
        {isMobile && (
          <div 
            className="absolute inset-0"
            onTouchStart={handleTouchStart}
          />
        )}
      </div>
    </div>
  );
};

export default Video;