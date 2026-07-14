import { useState, useCallback } from 'react';
import { apiRequest } from './api';
import {
    User,
    ClientProfile,
    Review,
    CreateReviewPayload,
    CreateSolicitationPayload,
    Solicitation,
    PaginatedResponse,
    Favorite,
} from '../models';

/**
 * User Services Hook
 * Manages all client/user-related API operations
 */
interface UseUserServicesReturn {
    loading: boolean;

    // Registration and profile
    registerClient: (formData: Record<string, unknown>) => Promise<unknown>;
    fetchCurrentUser: () => Promise<User>;
    updateCurrentUser: (data: Record<string, unknown> | FormData) => Promise<User>;
    updateClientProfile: (formData: FormData) => Promise<ClientProfile>;

    // Contact and solicitation
    initiateContactWithProvider: (providerId: number, serviceId: number) => Promise<unknown>;
    fetchClientSolicitations: () => Promise<Solicitation[]>;

    // Review operations
    submitReview: (reviewData: CreateReviewPayload) => Promise<Review>;
    fetchUserReviews: () => Promise<Review[]>;

    // Favorite operations
    toggleFavoriteProvider: (providerId: number) => Promise<Favorite>;
    fetchFavoriteProviders: () => Promise<Favorite[]>;
}

export default function useUserServices(): UseUserServicesReturn {
    const [loading, setLoading] = useState(false);

    /**
     * Register new client account
     */
    const registerClient = useCallback(
        async (formData: Record<string, unknown>): Promise<unknown> => {
            setLoading(true);
            try {
                const result = await apiRequest<unknown>('/accounts/registro/cliente/', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
                return result;
            } catch (error) {
                console.error('Client registration error:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch current authenticated user profile
     */
    const fetchCurrentUser = useCallback(async (): Promise<User> => {
        setLoading(true);
        try {
            const result = await apiRequest<User>('/accounts/me/', {
                method: 'GET',
            });
            return result;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Initiate contact with provider for service
     */
    const initiateContactWithProvider = useCallback(
        async (providerId: number, serviceId: number): Promise<unknown> => {
            setLoading(true);
            try {
                const payload: CreateSolicitationPayload = {
                    prestador_id: providerId,
                    servico: serviceId,
                };

                const result = await apiRequest<unknown>('/contratacoes/iniciar/', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                return result;
            } catch (error) {
                console.error('Error initiating contact with provider:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Update current user profile
     */
    const updateCurrentUser = useCallback(
        async (data: Record<string, unknown> | FormData): Promise<User> => {
            setLoading(true);
            try {
                const isFormData = data instanceof FormData;
                const result = await apiRequest<User>('/accounts/me/', {
                    method: 'PATCH',
                    body: isFormData ? data : JSON.stringify(data),
                });
                return result;
            } catch (error) {
                console.error('Error updating user:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch client solicitations
     */
    const fetchClientSolicitations = useCallback(
        async (): Promise<Solicitation[]> => {
            setLoading(true);
            try {
                const result = await apiRequest<PaginatedResponse<Solicitation>>(
                    '/contratacoes/cliente/solicitacoes/',
                    { method: 'GET' }
                );
                return result?.results || result || [];
            } catch (error) {
                console.error('Error fetching client solicitations:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Submit review for provider
     */
    const submitReview = useCallback(
        async (reviewData: CreateReviewPayload): Promise<Review> => {
            setLoading(true);
            try {
                const result = await apiRequest<Review>('/avaliacoes/', {
                    method: 'POST',
                    body: JSON.stringify(reviewData),
                });
                return result;
            } catch (error) {
                console.error('Error creating review:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Update client profile
     */
    const updateClientProfile = useCallback(
        async (formData: FormData): Promise<ClientProfile> => {
            setLoading(true);
            try {
                const result = await apiRequest<ClientProfile>(
                    '/accounts/perfil/cliente/editar/',
                    { method: 'PATCH', body: formData }
                );
                return result;
            } catch (error) {
                console.error('Error updating client profile:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch reviews written by user
     */
    const fetchUserReviews = useCallback(async (): Promise<Review[]> => {
        setLoading(true);
        try {
            const result = await apiRequest<PaginatedResponse<Review>>(
                '/avaliacoes/listar/?minhas=true',
                { method: 'GET' }
            );
            return result?.results || result || [];
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Toggle provider as favorite
     */
    const toggleFavoriteProvider = useCallback(
        async (providerId: number): Promise<Favorite> => {
            setLoading(true);
            try {
                const result = await apiRequest<Favorite>('/accounts/favoritos/', {
                    method: 'POST',
                    body: JSON.stringify({ prestador_id: providerId }),
                });
                return result;
            } catch (error) {
                console.error('Error toggling favorite:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch user's favorite providers
     */
    const fetchFavoriteProviders = useCallback(async (): Promise<Favorite[]> => {
        setLoading(true);
        try {
            const result = await apiRequest<PaginatedResponse<Favorite>>(
                '/accounts/favoritos/',
                { method: 'GET' }
            );
            return result?.results || result || [];
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        registerClient,
        fetchCurrentUser,
        updateCurrentUser,
        updateClientProfile,
        initiateContactWithProvider,
        fetchClientSolicitations,
        submitReview,
        fetchUserReviews,
        toggleFavoriteProvider,
        fetchFavoriteProviders,
    };
}
