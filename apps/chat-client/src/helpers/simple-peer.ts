import Peer from "simple-peer";

export default class VideoCall {
    
    private peer: Peer.Instance;

    init = (stream, initiator) => {
        console.log("==========================")
        console.log(stream)
        this.peer = new Peer({
            initiator: initiator,
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
            stream: stream,
            });
        return this.peer
    }
}