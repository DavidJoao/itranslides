
import io from 'socket.io-client'

export const socket = io('https://itranslides-websocket.onrender.com/',{
    transports: ['websockets'],
    reconnection: true
});