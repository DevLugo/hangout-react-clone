// React Core
import React, { useState, useEffect, useRef } from 'react';

// Libraries
import io from 'socket.io-client';

import { ShareScreenIcon, CamOnIcon, CamOffIcon, MicOffIcon, MicOnIcon } from './icons';
import { getDisplayStream } from '../helpers/media-access.ts';
import VideoCall from '../helpers/simple-peer.ts';

interface Navigator {
  getUserMedia(
    options: { video?: bool; audio?: bool },
    success: (stream) => void,
    error?: (error: string) => void
  ): void;
}

export const Video = ({ match }) => {
  const [localStream, setLocalStream] = useState({});
  const [camState, setCamState] = useState(false);
  const [micState, setMicState] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [full, setFull] = useState(false);
  const [initiator, setInitiator] = useState(false);

  
  const [peer, setPeer] = useState({});

  let videoCall;

  const [socket, setSocket] = useState(null);
  const refCurrentVideo = useRef(null);
  const refRemoteVideo = useRef(null);


  useEffect(() => {
    const socket = io('http://localhost:3333')
    console.log(process.env.REACT_APP_SIGNALING_SERVER)
    videoCall = new VideoCall();
    const { roomId } = match.params;
    console.log(roomId)
    getUserMedia().then(() => {
      socket.emit('join', { roomId: roomId });
    });

    socket.on('ready', () => {
      enter(roomId);
    setAudioLocal()

    });

    socket.on('desc', data => {
      if (data.type === 'offer' && initiator) return;
      if (data.type === 'answer' && !initiator) return;
      call(data)
    });

    socket.on('disconnected', () => {
      setInitiator(true);
    });

    socket.on('full', () => {
      setFull(true);
    })
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
          refCurrentVideo.current.srcObject = stream;
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
      refCurrentVideo.current.srcObject = stream;
    });
  };

  const enter = roomId => {
    console.log("SSSAAAS")
    setConnecting(true);
    const peer = videoCall.init(
      localStream,
      initiator
    )
    setPeer(peer);
    console.log("zzz")

    peer.on('signal', data => {
      const signal = {
        room: roomId,
        desc: data
      };
      socket.emit('signal', signal);
    });

    peer.on('stream', stream => {
      refRemoteVideo.srcObject = stream;
      setConnecting(false);
      setWaiting(false);
    });

    peer.on('error', err => {
      console.log(err);
    });
  }

  const call = otherId => {
    videoCall.connect(otherId);
  }

  const renderFull = () => {
    if (full) return 'The room is full';
  }

  return (
    <div className="video-wrapper">
      <div className="local-video-wrapper">
        <video autoPlay id="localVideo" muted ref={refCurrentVideo} width="400px" />
        <video autoPlay id='remoteVideo' ref={refRemoteVideo} width="400px" />
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
