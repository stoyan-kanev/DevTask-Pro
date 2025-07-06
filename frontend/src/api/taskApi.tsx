import axiosInstance from "../interceptors/authInterceptors.ts";
import type {AxiosError} from "axios";

const API_URL = "http://localhost:8000/tasks";

export const getTasks = async (projectId: string) => {


    try{
        const response = await axiosInstance.get(`${API_URL}/project/${projectId}`);
        return response.data;
    }catch(err){
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
}