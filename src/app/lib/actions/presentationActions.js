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

export const getMyPresentations = async (userId) => {
    try {
        const response = await axios.get(`/pages/api/presentations?userId=${userId}`)
        return response;
    } catch (error) {
        return console.error({ message: error })
    }
}

export const getPresentationById = async (presentationId) => {
    try {
        const response = await axios.get(`/pages/api/presentations/getById?presentationId=${presentationId}`)
        return response;
    } catch (error) {
        return console.error({ message: error })
    }
}

export const deletePresentationById = async (presentationId) => {
    try {
        const response = await axios.get(`/pages/api/presentations/delete?presentationId=${presentationId}`)
        return response;
    } catch (error) {
        return console.error({ message: error })
    }
}

export const createSlide = async (presentationId) => {
    try { 
        const response = await axios.post(`/pages/api/presentations/addNewSlide?presentationId=${presentationId}`)
        return response;
    } catch (error) {
        return console.error({ message: error })
    }
}

export const deleteSlide = async (presentationId, slideId) => {
    try {
        const response = await axios.post(`/pages/api/presentations/deleteSlide?presentationId=${presentationId}&slideId=${slideId}`)
        return response
    } catch (error) {
        return console.error({ message: error })
    }
}