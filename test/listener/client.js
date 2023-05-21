const express = require('express');
const io = require('socket.io-client');
const app = express();
const port = 3000;
let socketId = null;

// cross origin version
const socket = io(`ws://${process.env.WS_HOST}:${process.env.WS_PORT}/nsp1#`);
// // same origin version
// const socket = io('/nsp1#');

const reconnect = () => {
  setTimeout(() => {
    socket.connect();
  }, 1000);
};

socket.on('room1#time', (message) => {
  console.log(`[ID: ${socketId}] Received message via "time":`, message);
});

// client-side
socket.on('connect', () => {
  isConnected = true;

  if (socketId) {
    console.log(
      `[!] Renew socket ID from old-socket ID "${socketId}" to the new-one "${socket.id}"`,
    );
  }

  socketId = socket.id;

  console.log(`[ID: ${socketId}] Connected`);
});

socket.io.on('reconnect_attempt', () => {
  console.log(`[ID: ${socketId}] Try to reconnect...`);
});

socket.io.on('reconnect', () => {
  console.log(`[ID: ${socketId}] Reconnecting...`);
  reconnect();
});

socket.on('connect_error', () => {
  isConnected = false;
  reconnect();
});

socket.on('disconnect', (reason) => {
  isConnected = false;
  console.log(`[ID: ${socketId}] Disconnected...`); // undefined
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    reconnect();
  }
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
