'use client'

import { ReactNode, RefObject, createContext, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, GreenFilter, filters } from "../data/filter";

type HomeContextData = {
    videoURL: string;
    playing: boolean;
    totalTime: number;
    currentTime: number;
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    playPause: () => void;
    configCurrentTime: (time: number) => void;
    configVideo: (index: number) => void;
    changeVolume: (volume: number) => void;
    mute: boolean;
    fullScreen: boolean;
    changeIconMute: () => void;
    changeVideo: () => void;
    hideVideo: boolean;
    toggleFullScreen: () => void;
    volume: number;
    configFilter: (index: number) => void;
}

export const HomeContext =
   createContext({} as HomeContextData);

type ProviderProps = {
    children: ReactNode;    
}

const HomeContextProvider = ({children}: ProviderProps) => {
    const [videoURL, setVideoURL] = useState(""); //"video/video01.mp4"
    const [videoIndex, setVideoIndex] = useState(0);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(1000);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement> (null);
    const canvasRef = useRef<HTMLCanvasElement> (null);
    const [volume, setVolume] = useState(0);
    const [mute, setMute] = useState(false);
    const [hideVideo, setHideVideo] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    useEffect(()=>{
        configVideo(videoIndex);
    }, []);
    
    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;
        const currentVideo: Video = videos[currentIndex];
        const currentVideoURL = currentVideo.videoURL;
        setHideVideo(true);
        setVideoURL(currentVideoURL);
        setVideoIndex(currentIndex);
    }

    useEffect(()=>{
        const video = videoRef.current;
        if(video) {
            video.onloadeddata = () => {
                setTotalTime(video.duration);
                setCurrentTime(video.currentTime);

                if (playing) {
                    video.play();
                }

            }

            video.onended = () => {
                configVideo(videoIndex + 1);
            }

            video.ontimeupdate = () => {
                const video = videoRef.current;
                if(!video) return;
                setCurrentTime(video.currentTime);
            }
        }

        draw();
    }, [videoURL, filterIndex])

    useEffect(() => {
        const exitHandler = () => {
          if (!document.fullscreenElement) {
            setFullScreen(false);
          }
        };
      
        document.addEventListener("fullscreenchange", exitHandler);
        document.addEventListener("webkitfullscreenchange", exitHandler);
        document.addEventListener("mozfullscreenchange", exitHandler);
        document.addEventListener("MSFullscreenChange", exitHandler);
      
        return () => {
          document.removeEventListener("fullscreenchange", exitHandler);
          document.removeEventListener("webkitfullscreenchange", exitHandler);
          document.removeEventListener("mozfullscreenchange", exitHandler);
          document.removeEventListener("MSFullscreenChange", exitHandler);
        };
      }, []);

    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if(!video) return;
        video.currentTime = time;
        setCurrentTime(time);
    }

    const playPause = () => {
        const video = videoRef.current;
        if(!video) return;

        if (playing) {
            video.pause();
        } else {
            video.play();
            draw();
        }
        setPlaying(!playing);
    }

    const changeVolume = (volume: number) => {
        const video = videoRef.current;
        if(!video) return;

        if(volume > 0){
            setMute(false);
            video.muted = false;
        } 
        if(volume == 0 && video.volume > 0){
            setMute(true);
            video.muted = true;
        }

        setVolume(volume);
        video.volume = volume;
    }

    const changeIconMute = () => {
        const video = videoRef.current;
        if(!video) return;

        video.muted = !mute;
        video.volume = 0;

        setVolume(0);
        setMute(!mute);
    }

    const changeVideo = () => {
        setHideVideo(!hideVideo);
    }

    const toggleFullScreen = () => {
        const video = videoRef.current;
        if (!video) return;
      
        if (!fullScreen) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } 
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } 
        }
      
        setFullScreen(!fullScreen);
    };

    const configFilter = (index: number) => {
        setFilterIndex(index);
    }

    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if(!video || !canvas) return;

        var context = canvas.getContext("2d");

        if(!context) return;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter: Filter = filters[filterIndex];

        for (let i = 0; i < data.length; i+=4) {
            const red = data[i + 0];
            const green = data[i + 1];
            const blue = data[i + 2];

            filter.calc(red, green, blue);

            data[i + 0] = filter.red;
            data[i + 1] = filter.green;
            data[i + 2] = filter.blue;
        }

        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(draw);
    }

    return (
        <HomeContext.Provider value={
            {
                videoURL,
                playing,
                totalTime,
                currentTime,
                videoRef,
                canvasRef,
                playPause,
                configCurrentTime,
                configVideo,
                changeVolume,
                mute,
                fullScreen,
                changeIconMute,
                toggleFullScreen,
                volume,
                configFilter,
                changeVideo,
                hideVideo
            }
        }>
         {children}
        </HomeContext.Provider>
    )
}

export default HomeContextProvider;