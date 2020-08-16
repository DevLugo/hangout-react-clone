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
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    })
  });
});

const port = process.env.port || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
