import React, { useState, useEffect, useRef } from 'react';
import { getDisplayStream } from '../helpers/media-access';
import { ShareScreenIcon, CamOnIcon, CamOffIcon } from './icons';

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
  const refVideo = useRef(null);

  useEffect(() => {
    console.log('useeefect');
    getUserMedia().then(() => {
      console.log('inicializado');
    });
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

  const setVideoLocal = () => {
    if (localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
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
        <video autoPlay id="localVideo" muted ref={refVideo} />
      </div>
      <div className="controls">
        <button
          className="control-btn"
          onClick={() => {
            getDisplay();
          }}
        >
          <ShareScreenIcon />
        </button>
        <button
          className="control-btn"
          onClick={() => {
            setVideoLocal();
          }}
        >
          {camState ? <CamOnIcon /> : <CamOffIcon />}
        </button>
      </div>
    </div>
  );
};
