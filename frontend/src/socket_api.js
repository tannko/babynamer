import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:3003/');
export { socket };
