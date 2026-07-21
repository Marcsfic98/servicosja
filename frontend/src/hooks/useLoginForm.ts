import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import useProviderServices from '../services/useProviderService';
import { AuthCredentials } from '../models';

/**
 * useLoginForm Hook
 * Manages login form state and operations
 */
interface UseLoginFormReturn {
    email: string;
    password: string;
    isLoading: boolean;
    error: Error | null;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleLoginAsClient: () => Promise<void>;
    handleLoginAsProvider: () => Promise<void>;
    clearForm: () => void;
}

export function useLoginForm(): UseLoginFormReturn {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { login } = useAuth();
    const { loginProvider } = useProviderServices();

    /**
     * Handle client login
     */
    const handleLoginAsClient = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const credentials: AuthCredentials = { email, password };
            await login(credentials);
            clearForm();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Login failed');
            setError(error);
            console.error('Client login error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [email, password, login]);

    /**
     * Handle provider login
     */
    const handleLoginAsProvider = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const credentials: AuthCredentials = { email, password };
            await loginProvider(credentials);
            clearForm();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Provider login failed');
            setError(error);
            console.error('Provider login error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [email, password, loginProvider]);

    /**
     * Clear form fields
     */
    const clearForm = useCallback(() => {
        setEmail('');
        setPassword('');
        setError(null);
    }, []);

    return {
        email,
        password,
        isLoading,
        error,
        setEmail,
        setPassword,
        handleLoginAsClient,
        handleLoginAsProvider,
        clearForm,
    };
}
