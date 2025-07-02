import axiosInstance from "../interceptors/authInterceptors.ts";
import type {AxiosError} from "axios";

const API_URL = "http://localhost:8000/users";


export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/users/me/");
        return response.data;
    } catch (err) {
        const error = err as AxiosError;

        if (!error.response) {
            console.error("Unknown error:", error);
            return null;
        }

        if (error.response.status === 401) {
            return null;
        }

        throw error;
    }
};


export async function loginApi(email: string, password: string) {
    const response = await axiosInstance.post(`${API_URL}/login/`, {
        email,
        password,

    }, {withCredentials: true});
    return response.data;
}

export async function logoutApi() {
    const response = await axiosInstance.post(`${API_URL}/logout/`, {}, {withCredentials: true});
    return response.data;
}