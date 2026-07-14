import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import useProviderServices from '../services/useProviderService';
import { ProviderProfile, Solicitation, PortfolioItem } from '../models';

/**
 * useProviderProfile Hook
 * Manages provider profile data and operations
 */
interface UseProviderProfileReturn {
    provider: ProviderProfile | null;
    isLoading: boolean;
    error: Error | null;
    solicitations: Solicitation[];
    updateProfile: (formData: FormData) => Promise<void>;
    fetchProfile: () => Promise<void>;
    refreshSolicitations: () => Promise<void>;
    addPortfolioItem: (formData: FormData) => Promise<PortfolioItem>;
    removePortfolioItem: (itemId: number) => Promise<boolean>;
    markServiceAsCompleted: (solicitationId: number) => Promise<void>;
    markServiceAsNotRealized: (solicitationId: number) => Promise<void>;
}

export function useProviderProfile(): UseProviderProfileReturn {
    const [provider, setProvider] = useState<ProviderProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [solicitations, setSolicitations] = useState<Solicitation[]>([]);

    const { isAuthenticated, user } = useAuth();
    const {
        fetchProviderByUserId,
        fetchProviderSolicitations,
        updateProviderProfile,
        addPortfolioItem,
        removePortfolioItem,
        markServiceAsCompleted,
        markServiceAsNotRealized,
    } = useProviderServices();

    /**
     * Fetch provider profile by user ID
     */
    const handleFetchProfile = useCallback(async () => {
        if (!user?.user_id) return;

        setIsLoading(true);
        setError(null);
        try {
            const providerData = await fetchProviderByUserId(user.user_id);
            setProvider(providerData as ProviderProfile);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to load provider profile');
            setError(error);
            console.error('Error fetching provider profile:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.user_id, fetchProviderByUserId]);

    /**
     * Update provider profile
     */
    const handleUpdateProfile = useCallback(
        async (formData: FormData) => {
            setIsLoading(true);
            setError(null);
            try {
                const updatedProvider = await updateProviderProfile(formData);
                setProvider(updatedProvider as ProviderProfile);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to update profile');
                setError(error);
                console.error('Error updating provider profile:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [updateProviderProfile]
    );

    /**
     * Refresh provider's solicitations
     */
    const handleRefreshSolicitations = useCallback(async () => {
        try {
            const providerSolicitations = await fetchProviderSolicitations();
            setSolicitations(providerSolicitations);
        } catch (err) {
            console.error('Error fetching provider solicitations:', err);
        }
    }, [fetchProviderSolicitations]);

    /**
     * Handle adding portfolio item
     */
    const handleAddPortfolioItem = useCallback(
        async (formData: FormData): Promise<PortfolioItem> => {
            try {
                const item = await addPortfolioItem(formData);
                // Refresh profile to update portfolio
                await handleFetchProfile();
                return item;
            } catch (err) {
                console.error('Error adding portfolio item:', err);
                throw err;
            }
        },
        [addPortfolioItem, handleFetchProfile]
    );

    /**
     * Handle removing portfolio item
     */
    const handleRemovePortfolioItem = useCallback(
        async (itemId: number): Promise<boolean> => {
            try {
                const success = await removePortfolioItem(itemId);
                if (success) {
                    // Refresh profile to update portfolio
                    await handleFetchProfile();
                }
                return success;
            } catch (err) {
                console.error('Error removing portfolio item:', err);
                throw err;
            }
        },
        [removePortfolioItem, handleFetchProfile]
    );

    /**
     * Handle completing service
     */
    const handleMarkServiceAsCompleted = useCallback(
        async (solicitationId: number) => {
            try {
                await markServiceAsCompleted(solicitationId);
                await handleRefreshSolicitations();
            } catch (err) {
                console.error('Error completing service:', err);
                throw err;
            }
        },
        [markServiceAsCompleted, handleRefreshSolicitations]
    );

    /**
     * Handle marking service as not realized
     */
    const handleMarkServiceAsNotRealized = useCallback(
        async (solicitationId: number) => {
            try {
                await markServiceAsNotRealized(solicitationId);
                await handleRefreshSolicitations();
            } catch (err) {
                console.error('Error marking service as not realized:', err);
                throw err;
            }
        },
        [markServiceAsNotRealized, handleRefreshSolicitations]
    );

    // Load provider profile and solicitations on mount
    useEffect(() => {
        if (isAuthenticated) {
            handleFetchProfile();
            handleRefreshSolicitations();
        }
    }, [isAuthenticated]);

    return {
        provider,
        isLoading,
        error,
        solicitations,
        updateProfile: handleUpdateProfile,
        fetchProfile: handleFetchProfile,
        refreshSolicitations: handleRefreshSolicitations,
        addPortfolioItem: handleAddPortfolioItem,
        removePortfolioItem: handleRemovePortfolioItem,
        markServiceAsCompleted: handleMarkServiceAsCompleted,
        markServiceAsNotRealized: handleMarkServiceAsNotRealized,
    };
}
