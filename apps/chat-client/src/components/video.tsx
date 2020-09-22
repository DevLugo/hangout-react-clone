// React Core
import React, { useState, useEffect, useRef } from 'react';

// Libraries
import io from 'socket.io-client';
console.log("---------------HÑA MUNDO------------------")
import { ShareScreenIcon, CamOnIcon, CamOffIcon, MicOffIcon, MicOnIcon } from './icons';
import { getDisplayStream } from '../helpers/media-access';
import VideoCall from '../helpers/simple-peer';
//import { useDidUpdateEffect, useDidMount } from '../hooks/componentDidUpdate';
import Peer from "simple-peer";

/*interface Navigator {
  getUserMedia(
    options: { video?: bool; audio?: bool },
    success: (stream) => void,
    error?: (error: string) => void
  ): void;
}*/

export const Video = ({ match }) => {
  const [localStream, setLocalStream] = useState<MediaStream>(undefined);
  const [camState, setCamState] = useState(false);
  const [micState, setMicState] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [full, setFull] = useState(false);
  const [initiator, setInitiator] = useState(false);
  const [loads, setloads] = useState(0);
  const [yourID, setYourID] = useState(null);
  const [users, setUsers] = useState({});
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const didMount  = useRef(false);
  const roomId = useRef(match.params);
  console.log("ANTESssss")

  const peerRef = useRef<any>(undefined) 
  //const [peer, setPeer] = useState<any>({});


  const refCurrentVideo = useRef(null);
  const refRemoteVideo = useRef(null);
  const socket  = useRef(null);

  useEffect(() => {
  console.log("DESPUS")
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setLocalStream(stream);
      if (refCurrentVideo.current) {
        refCurrentVideo.current.srcObject = stream;
      }
    })

      socket.current = io('http://18.223.152.29:3333/api');
      socket.current.emit('join', { room: roomId.current });
      socket.current.on('init', () => {
        console.log("+++++++++++TTTTTTTTTTTTTTTTT++++++++++++++")
        setInitiator(true);
      });
  
      socket.current.on("yourID", (id) => {
        console.log("DAAAS")
        console.log(id)
        setYourID(id);
      })
      socket.current.on("allUsers", (users) => {
        setUsers(users);
      })
  
      socket.current.on("hey", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      })
  }, []);


  useEffect(() => {
    if (!didMount.current){
      didMount.current = !didMount.current
    }else{
      refCurrentVideo.current.srcObject = localStream;
      console.log(refCurrentVideo.current.srcObject)
      setVideoLocal()
      setAudioLocal()

    
    }
  }, [localStream])

  
  function callPeer(id) {
    console.log("----callPeer----");
    peerRef.current = new Peer({
      initiator: true,
      trickle: false,
      config: {
          iceServers: [
              {
                  urls: "stun:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683"
              },
              {
                  urls: "turn:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683"
              }
          ]
      },
      stream: localStream,
      });

    peerRef.current.on("signal", data => {
      console.log("---signal---")
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peerRef.current.on("stream", stream => {
      console.log("---stream---")
      if (refRemoteVideo.current) {
        refRemoteVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      console.log("---callAccepted---")
      setCallAccepted(true);
      peerRef.current.signal(signal);
    })

  }

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
      stream.oninactive = () => {
        console.log("INACTIVO")
        //peer.removeStream(localStream);
        /*getUserMedia().then(() => {
          peer.addStream(localStream);
        });*/
      }

      setLocalStream(stream);
      refCurrentVideo.current.srcObject = stream;
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer: any = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      refRemoteVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
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
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)}>Call {key}</button>
          );
        })}
        { receivingCall && 
        <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
        </div>
        }
      </div>
    </div>
  );
};
