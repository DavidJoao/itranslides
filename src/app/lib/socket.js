
import io from 'socket.io-client'

export const socket = io('https://itranslides-websocket.onrender.com/',{
    transports: ['websockets', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, 
});