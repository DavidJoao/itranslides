import axios from "axios"
import { navigate } from "../redirect"
import { socket } from "../socket"

export const createUser = async (user) => {
    try {
        const response = await axios.post(`/pages/api/user/create?nickname=${user}`)
        return response
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

export const logoutUser = async () => {
    try {
        const response = await axios.get("/pages/api/user/logout");
        if (response.status === 200) {
            navigate('/')
        }
        return response;
    } catch (error) {
        console.error(error)
    }
}

export const updateUserRole = async (userId, presentationId, role) => {
    try {
        const response = await axios.post(`/pages/api/presentations/addUser?userId=${userId}&presentationId=${presentationId}&role=${role}`);

        if (response && response.data) {
            const roleData = response.data;
            console.log(roleData);

            socket.emit("update role", {
                presentationId: presentationId,
                roleData,
            });
        }
    } catch (error) {
        console.error("Error updating user role:", error);
    }
};
