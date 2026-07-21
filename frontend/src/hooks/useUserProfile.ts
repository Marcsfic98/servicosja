import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import useUserServices from '../services/useUserService';
import { User, ClientProfile, Solicitation } from '../models';

/**
 * useUserProfile Hook
 * Manages client user profile data and operations
 */
interface UseUserProfileReturn {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    solicitations: Solicitation[];
    updateProfile: (data: Record<string, unknown> | FormData) => Promise<void>;
    fetchProfile: () => Promise<void>;
    refreshSolicitations: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [solicitations, setSolicitations] = useState<Solicitation[]>([]);

    const { isAuthenticated } = useAuth();
    const { fetchCurrentUser, updateCurrentUser, fetchClientSolicitations } = useUserServices();

    /**
     * Fetch current user profile
     */
    const handleFetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await fetchCurrentUser();
            setUser(userData);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to load user profile');
            setError(error);
            console.error('Error fetching user profile:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCurrentUser]);

    /**
     * Update user profile
     */
    const handleUpdateProfile = useCallback(
        async (data: Record<string, unknown> | FormData) => {
            setIsLoading(true);
            setError(null);
            try {
                const updatedUser = await updateCurrentUser(data);
                setUser(updatedUser);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to update profile');
                setError(error);
                console.error('Error updating profile:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [updateCurrentUser]
    );

    /**
     * Refresh user's solicitations
     */
    const handleRefreshSolicitations = useCallback(async () => {
        try {
            const userSolicitations = await fetchClientSolicitations();
            setSolicitations(userSolicitations);
        } catch (err) {
            console.error('Error fetching solicitations:', err);
        }
    }, [fetchClientSolicitations]);

    // Load user profile and solicitations on mount
    useEffect(() => {
        if (isAuthenticated) {
            handleFetchProfile();
            handleRefreshSolicitations();
        }
    }, [isAuthenticated]);

    return {
        user,
        isLoading,
        error,
        solicitations,
        updateProfile: handleUpdateProfile,
        fetchProfile: handleFetchProfile,
        refreshSolicitations: handleRefreshSolicitations,
    };
}
