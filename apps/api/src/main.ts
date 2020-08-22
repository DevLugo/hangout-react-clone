/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { v4 as uuid } from 'uuid';
import * as express from 'express';
import ioserver, { Socket } from 'socket.io';

const app = express();
const server = require('http').Server(app);
const io = ioserver(server);
const { uuid: uuidV4 } = uuid('uuid')

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.get('/api/:room', (req, res) => {
  res.send({'room':uuid() })
});

io.on('connection', socket =>{
  socket.on('join', function (data) { 
    socket.join(data.roomId);
    socket.room = data.roomId;
    const sockets = io.of('/').in().adapter.rooms[data.roomId];
    if(sockets.length===1){
        socket.emit('init')
    }else{
        if (sockets.length===2){
            io.to(data.roomId).emit('ready')
        }else{
            socket.room = null
            socket.leave(data.roomId)
            socket.emit('full')
        }
    }
  });

  socket.on('signal', (data) => {
      io.to(data.room).emit('desc', data.desc)        
  })
  socket.on('disconnect', () => {
      const roomId = Object.keys(socket.adapter.rooms)[0]
      if (socket.room){
          io.to(socket.room).emit('disconnected')
      }
      
  })
})

const port = process.env.port || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
