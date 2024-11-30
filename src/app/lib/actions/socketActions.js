import { socket } from "../socket";

export const emitNewPresentation = async (presentationName, activeUser) => {
    console.log(activeUser)
    socket.emit("new presentation", presentationName);
}

export const emitDeletePresentation = async (presentationName, activeUser) => {
    console.log(activeUser)
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

export const emitJoinPresentation = async (user, presentationId, presentation) => {
    socket.emit("join presentation", { user, presentationId, presentation })
}

export const emitLeavePresentation = async (user, presentationId) => {
    socket.emit("leave presentation", { user, presentationId })
}