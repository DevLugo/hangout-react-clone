/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { v4 as uuid } from 'uuid';
import * as express from 'express';
import ioserver, { Socket } from 'socket.io';
import * as cors from 'cors';
 

const app = express();
const server = require('http').Server(app);
const io = ioserver(server);
const { uuid: uuidV4 } = uuid('uuid')

app.use(cors());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.get('/api/:room', (req, res) => {
  res.send({'room':uuid() })
});

const users = {};

io.on('connection', socket =>{
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on('disconnect', () => {
      delete users[socket.id];
  })
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  })

  socket.on("acceptCall", (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
  })
})

const port = process.env.port || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
