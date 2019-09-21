import socketIOClient from 'socket.io-client';
import { baseUrl } from './config';
const socket = socketIOClient(baseUrl);
export { socket };
