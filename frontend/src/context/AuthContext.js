'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });

            // Adjust this part to match the backend response structure
            const userData = {
                _id: data._id,
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin
            };

            setUser(userData);
            setToken(data.token);

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);

            router.push('/');
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            router.push('/');
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}