import io from 'socket.io-client'
const socket = io('http://localhost:3001');

export const emitNewPresentation = async (user, presentationName, fetchPresentations) => {
    socket.emit("new presentation", presentationName)
    socket.on("New Presentation", async () => {
        await fetchPresentations(user)
    })
    return () => {
        socket.off("New Presentation")
    }
}

export const emitDeletePresentation = async (user, presentationName, fetchPresentations) => {
    socket.emit("delete presentation", presentationName)
    socket.on("delete presentation", async () => {
        await fetchPresentations(user)
    })
    return () => {
        socket.off("Deleted Presentation")
    }
}