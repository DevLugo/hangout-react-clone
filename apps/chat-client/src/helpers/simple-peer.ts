import SimplePeer from "simple-peer";

export default class VideoCall {
    
    private peer: SimplePeer.Instance;


    init = (stream, initiator) => {
        this.peer = new SimplePeer({
            initiator: initiator,
            stream: stream,
            trickle: false,
            reconnectTimer: 1000,
            /*config: {
                iceServers: [
                    { urls: ['stun:stun4.l.google.com:19302','turn:numb.viagenie.ca'] },
                    {
                        urls: ['stun:stun4.l.google.com:19302','turn:numb.viagenie.ca'],
                        username: 'elugo.isi@gmail.com',
                        credential: 'ronaldo2'
                    },
                ]
            }*/
        })
        return this.peer

    }
    connect = (otherId) => {
        this.peer.signal(otherId)
    }
}