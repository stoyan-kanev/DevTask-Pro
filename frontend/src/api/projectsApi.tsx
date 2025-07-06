import axiosInstance from "../interceptors/authInterceptors.ts";
import type {AxiosError} from "axios";

const API_URL = "http://localhost:8000/projects";

export const getProjects = async() => {

    try{
        const response = await axiosInstance.get(API_URL);
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

export async function createProject(data: { name: string }) {

    try{
        const response = await axiosInstance.post(`${API_URL}/`,data);
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