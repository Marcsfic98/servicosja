import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { AuthData, AuthCredentials, AuthResponse, User, UserType } from '../models';

/**
 * Auth Context
 * Manages user authentication state and operations
 */

interface AuthContextType {
    user: AuthData | null;
    loading: boolean;
    isAuthenticating: boolean;
    isAuthenticated: boolean;
    login: (credentials: AuthCredentials) => Promise<AuthResponse>;
    logout: () => void;
    setAuthData: (data: AuthData) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access auth context
 * @throws {Error} if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * Auth Provider Component
 * Provides authentication state and operations to entire app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Load user from localStorage on app initialization
     */
    useEffect(() => {
        const loadStoredAuthData = () => {
            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
                try {
                    const parsedAuth: AuthData = JSON.parse(storedAuth);
                    if (parsedAuth.access) {
                        setUser(parsedAuth);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Error parsing auth from localStorage:', error);
                    localStorage.removeItem('auth');
                }
            }
            setLoading(false);
        };

        loadStoredAuthData();
    }, []);

    /**
     * Handle user login
     */
    const handleLogin = async (credentials: AuthCredentials): Promise<AuthResponse> => {
        setIsAuthenticating(true);
        try {
            const response: AuthResponse = await apiRequest('/auth/token/login/', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            const authData: AuthData = {
                access: response.access,
                refresh: response.refresh,
                tipo_usuario: response.tipo_usuario,
            };

            localStorage.setItem('auth', JSON.stringify(authData));
            setUser(authData);
            setIsAuthenticated(true);

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };

    /**
     * Handle user logout
     */
    const handleLogout = () => {
        localStorage.removeItem('auth');
        setUser(null);
        setIsAuthenticated(false);
    };

    /**
     * Set auth data directly
     */
    const setAuthDataHandler = (data: AuthData) => {
        localStorage.setItem('auth', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
    };

    const contextValue: AuthContextType = {
        user,
        loading,
        isAuthenticating,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        setAuthData: setAuthDataHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
