import { AuthData } from '../models';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface FetchOptions extends RequestInit {
    body?: string | FormData | null;
}

/**
 * Retrieve auth data from localStorage
 */
const getStoredAuthData = (): AuthData | null => {
    const stored = localStorage.getItem('auth');
    try {
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error parsing stored auth data:', error);
        return null;
    }
};

/**
 * Store auth data to localStorage
 */
const saveAuthDataToStorage = (data: AuthData): void => {
    localStorage.setItem('auth', JSON.stringify(data));
};

/**
 * Clear auth data from localStorage
 */
const clearStoredAuthData = (): void => {
    localStorage.removeItem('auth');
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
    const authData = getStoredAuthData();
    if (!authData || !authData.refresh) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetch(`${API_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: authData.refresh }),
        });

        const data: Partial<AuthData> = await response.json();

        if (!response.ok) {
            throw data;
        }

        const newAuthData: AuthData = {
            access: data.access || '',
            refresh: data.refresh || authData.refresh,
            tipo_usuario: authData.tipo_usuario,
        };

        saveAuthDataToStorage(newAuthData);
        return newAuthData.access;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        clearStoredAuthData();
        window.location.href = '/';
        throw error;
    }
};

/**
 * Make API request with automatic token refresh on 401
 * @param endpoint - API endpoint path
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns - Parsed JSON response
 */
export const apiRequest = async <T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {
    const authData = getStoredAuthData();
    let token = authData?.access || null;

    const headers: Record<string, string> = { ...options.headers } as Record<string, string>;

    // Set Content-Type for JSON requests (not for FormData)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: FetchOptions = {
        ...options,
        headers,
    };

    let url = endpoint;
    if (!endpoint.startsWith('http')) {
        url = `${API_URL}${endpoint}`;
    }

    let response = await fetch(url, config);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
        const isAuthEndpoint = endpoint.includes('auth/token/refresh') || endpoint.includes('auth/token/login');
        if (!isAuthEndpoint) {
            try {
                token = await refreshAccessToken();
                headers['Authorization'] = `Bearer ${token}`;
                response = await fetch(url, config);
            } catch (refreshError) {
                throw refreshError;
            }
        }
    }

    // Handle non-2xx responses
    if (!response.ok) {
        let errorResult: unknown;
        try {
            errorResult = await response.json();
        } catch {
            errorResult = {
                message: response.statusText,
                status: response.status,
            };
        }
        throw errorResult;
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null as T;
    }

    // Parse and return response
    try {
        const result: T = await response.json();
        return result;
    } catch {
        return null as T;
    }
};
