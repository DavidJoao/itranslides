import io from 'socket.io-client'
const socket = io('http://localhost:3001');

export const emitNewPresentation = async (presentationName) => {
    socket.emit("new presentation", presentationName);
}

export const emitDeletePresentation = async (user, presentationName, fetchPresentations) => {
    socket.emit("delete presentation", presentationName);
}

export const emitNewSlide = async (presentationName) => {
    socket.emit("new slide", presentationName);
}

export const emitDeleteSlide = async (presentationName) => {
    socket.emit("delete slide", presentationName);
}

export const emitChange = async (presentationId) => {
    socket.emit("slide change", { presentationId })
}

export const emitJoinPresentation = async (user, presentationId) => {
    socket.emit("join presentation", { user, presentationId })
}

export const emitLeavePresentation = async (user, presentationId) => {
    socket.emit("leave presentation", { user, presentationId })
}