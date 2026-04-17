import { createContext, useState, useEffect } from "react";
import {API} from "../api/axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 🔥 ADD THIS

    function login(data) {
        localStorage.setItem("token", data.token);
        setUser(data);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        async function loadUser() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await API.get("/me");
                setUser(res.data);
            } catch (e) {
                logout();
            } finally {
                setLoading(false); // 🔥 IMPORTANT
            }
        }

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };