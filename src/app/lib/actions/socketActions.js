import io from 'socket.io-client'
const socket = io('http://localhost:3001');

export const emitNewPresentation = async (presentationName) => {
    socket.emit("new presentation", presentationName);
}

export const emitDeletePresentation = async (user, presentationName, fetchPresentations) => {
    socket.emit("delete presentation", presentationName);
}