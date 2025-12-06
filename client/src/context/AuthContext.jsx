/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }, []);

    const bootstrap = useCallback(async () => {
        const storedToken = localStorage.getItem('auth_token');
        if (!storedToken) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/me`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (!res.ok) {
                throw new Error('Token inválido');
            }
            const data = await res.json();
            setUser(data.user);
            setToken(storedToken);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
        } catch (err) {
            console.warn('Sesión inválida, cerrando sesión', err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    const login = async (username, password) => {
        let res;
        try {
            res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
        } catch {
            throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
        }

        let data = null;
        try {
            data = await res.json();
        } catch {
            // ignore json parse errors and fall back to generic messages
        }

        if (!res.ok) {
            throw new Error(data?.message || 'Credenciales inválidas');
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return data.user;
    };

    const value = {
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        logout,
        apiBase: API_BASE,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return ctx;
};
