'use client'
import videos, { Video } from './data/video';
//alt + shift + f (para formatar)

import { useContext } from "react";
import { HomeContext } from "./context/HomeContext";
import { FaExpandAlt, FaPause, FaPlay } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
import { FaVolumeHigh } from "react-icons/fa6";
import { convertTimeToString } from './utils/Utils';

export default function Home() {
  const {
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
    changeIconMute,
    mute,
    fullScreen,
    toggleFullScreen,
    volume,
    configFilter,
    changeVideo,
    hideVideo
  } = useContext(HomeContext);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    changeVolume(volume);
  }

  return (
    <main>
      <div className="mx-auto w-[80%] mt-20 flex">
        <div className="w-[70%] mr-5" >
          <video className="w-full" ref={videoRef} src={videoURL} hidden={!hideVideo}></video>
          <canvas className="w-full h-[420px]" ref={canvasRef} hidden={hideVideo}></canvas>
          <div className="bg-black">
            <div>
              <input 
                type="range" 
                min={0} 
                max={totalTime} 
                value={currentTime} 
                onChange={(e) => configCurrentTime(Number(e.target.value))}
                className="ml-5 w-[95%]">
              </input>
            </div>
            <div className="flex justify-between">
              <div>
                <button className="text-white ml-7 mt-1 mb-3 mr-5" onClick={playPause}>{playing ? <FaPause/> : <FaPlay />}</button>
                {convertTimeToString(currentTime)} / {convertTimeToString(totalTime)}
                <button className="text-white ml-5 mr-2" onClick={changeIconMute}>{mute ? <FaVolumeMute /> : <FaVolumeHigh />}
                </button>
                <input
                  type="range"
                  defaultValue={1}
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={change} />
              </div>
              <button className="text-white mr-5" onClick={toggleFullScreen}> <FaExpandAlt /> </button>
            </div>
          </div>
          <div className="mt-5 p-2 flex justify-center">
            <button className="w-[20%] ml-5 mr-5 p-2 bg-black" onClick={changeVideo}>{hideVideo ? "Esconder" : "Mostrar"} Video </button>
            <select className="bg-black text-white text-center" onChange={(e) => configFilter(Number(e.target.value))} hidden={hideVideo}>
              <option selected value={0}> Verde </option>
              <option value={1}> Azul </option>
              <option value={2}> Vermelho </option>
              <option value={3}> Preto e Branco </option>
            </select>
          </div>
        </div>
        <div className="w-[30%] h-[100vh]">
          {
            videos.map((video:Video, index) => {
              return (
                <div className='mb-5'>
                  <div className='bg-black'>
                    <button className="w-full border border-black p-0.5" onClick={(e) => configVideo(index) } hidden={video.videoURL == videoURL}>
                      <img className="w-full h-[200px] mb-1" key={index} src={video.imageURL} alt="Imagem do vídeo"/>
                      <h3 className='mb-1'>{video.description}</h3>
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </main>
  );
}
