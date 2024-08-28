'use client';

import React, { useEffect, useState, createContext, useContext } from "react";

interface AuthContextType {
    user: Object;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    fetchData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<Object>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();

            if (data && data.name) {
                setUser(data.name);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchData }}>
            {!loading ? (children) : (
                <div className="w-full min-h-screen pt-[10vh] bg-gray-900 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
