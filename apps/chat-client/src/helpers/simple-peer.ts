import SimplePeer from "simple-peer";

export default class VideoCall {
    
    private peer: SimplePeer.Instance;


    init = (stream, initiator) => {
        console.log("==========================")
        console.log(stream)
        this.peer = new SimplePeer({
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
            stream: stream,
            });
        return this.peer

    }
    connect = (otherId) => {
        this.peer.signal(otherId)
    }
}