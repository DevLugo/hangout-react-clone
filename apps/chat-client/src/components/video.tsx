// React Core
import React, { useState, useEffect, useRef } from 'react';

// Libraries
import io from 'socket.io-client';

import { ShareScreenIcon, CamOnIcon, CamOffIcon, MicOffIcon, MicOnIcon } from './icons';
import { getDisplayStream } from '../helpers/media-access';
import VideoCall from '../helpers/simple-peer';

interface Navigator {
  getUserMedia(
    options: { video?: bool; audio?: bool },
    success: (stream) => void,
    error?: (error: string) => void
  ): void;
}

export const Video = () => {
  const [localStream, setLocalStream] = useState({});
  const [camState, setCamState] = useState(false);
  const [micState, setMicState] = useState(false);
  const [socket, setSocket] = useState(null);
  const refVideo = useRef(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SIGNALING_SERVER)
    //const videoCall = new VideoCall();
    setSocket(socket);

    getUserMedia()
  }, []);

  const getUserMedia = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 },
        },
        audio: true,
      };

      navigator.getUserMedia(
        op,
        (stream) => {
          setLocalStream(stream);
          refVideo.current.srcObject = stream;
          resolve();
        },
        (err) => {
          console.log('Ocurrió el siguiente error: ' + err);
        }
      );
    });
  };

  const setAudioLocal = () => {
    if (localStream.getAudioTracks().length > 0)
      localStream.getAudioTracks().forEach(track => {
        track.enabled=!track.enabled
      })
    setMicState((prevState) => !prevState);
    }

  const setVideoLocal = () => {
    if (localStream.getVideoTracks().length > 0)
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    setCamState((prevState) => !prevState);
  };

  const getDisplay = () => {
    getDisplayStream().then((stream) => {
      setLocalStream(stream);
      refVideo.current.srcObject = stream;
    });
  };

  return (
    <div className="video-wrapper">
      <div className="local-video-wrapper">
        <video autoPlay id="localVideo" muted ref={refVideo} width="100%" />
      </div>
      <div className="controls">
        <button
          className="control-btn"
          onClick={() => getDisplay()}
        >
          <ShareScreenIcon />
        </button>
        <button
        className='control-btn'
          onClick={() => setAudioLocal()}
        >
          {
            micState?(
              <MicOnIcon/>
            ):(
              <MicOffIcon/>
            )
          }
        </button>

        <button
          className="control-btn"
          onClick={() => setVideoLocal()}
        >
          {camState ? <CamOnIcon /> : <CamOffIcon />}
        </button>
      </div>
    </div>
  );
};
