import { createContext, useContext, useEffect, useState } from "react";
import {getCurrentUser, logoutApi} from "../api/authApi.tsx";

export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    register: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async () => {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch {
            setUser(null);
        }
    };

    const register = async () => {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch {
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            console.warn("Logout failed:", e);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;