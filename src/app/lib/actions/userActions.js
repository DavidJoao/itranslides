import axios from "axios"

export const createUser = async (user) => {
    try {
        const res = await axios.post(`/pages/api/user/create?nickname=${user}`)
        return res
    } catch (error) {
        return error
    }

}