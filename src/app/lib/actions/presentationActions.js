import axios from "axios"

export const createPresentation = async (presentationName, userId) => {
    try {
        const response = await axios.post(`/pages/api/presentations/create?presentationName=${presentationName}&userId=${userId}`)
        return response;
    } catch (error) {
        return console.error({ message: error })
    }
}

export const getPresentations = async () => {
    try {
        const response = await axios.get("/pages/api/presentations/all")
        return response;
    } catch (error) {
        return console.error({ message: error })
    }
}