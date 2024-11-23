import axios from "axios"

export const createUser = async (user) => {
    try {
        const res = await axios.post(`/pages/api/user/create?nickname=${user}`)
        return res
    } catch (error) {
        return error
    }
}

export const checkSession = async () => {
    try {
        const response = await axios.get("/pages/api/user/session");
        return response;
    } catch (error) {
        return error;
    }
}

export const getAndSetSession = async () => {
    try {
        const session = await checkSession();
        if (session?.status === 200) {
            const userId = session?.data?.userId?.value;
            if (userId) {
                const res = await axios.get(`/pages/api/user?userId=${userId}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                return res.data;
            } else {
                console.log("No userId found in session.");
            }
        }
    } catch (error) {
        console.error(error);
    }
}
