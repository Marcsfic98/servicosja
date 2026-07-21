import { useState, useCallback } from 'react';
import { apiRequest } from './api';
import {
    Provider,
    ProviderProfile,
    ProviderFilters,
    PaginatedResponse,
    AuthCredentials,
    Review,
    Solicitation,
    PortfolioItem,
} from '../models';

/**
 * Provider Services Hook
 * Manages all provider-related API operations
 */
interface UseProviderServicesReturn {
    loading: boolean;
    loadingMore: boolean;
    providers: Provider[];
    providerAccount: ProviderProfile | null;
    refetchProviders: boolean;
    nextPageUrl: string | null;

    // Registration and authentication
    registerProvider: (formData: Record<string, unknown>) => Promise<unknown>;
    loginProvider: (credentials: AuthCredentials) => Promise<unknown>;

    // Fetch operations
    fetchAllProviders: () => void;
    fetchProviderProfile: (providerId: number) => Promise<ProviderProfile>;
    fetchProviderByUserId: (userId: number) => Promise<Provider | null>;
    fetchFilteredProviders: (filters: ProviderFilters) => Promise<void>;
    fetchBestRatedProviders: () => Promise<Provider[]>;
    fetchReviews: () => Promise<Review[]>;

    // Solicitation operations
    fetchProviderSolicitations: () => Promise<Solicitation[]>;
    markServiceAsCompleted: (solicitationId: number) => Promise<unknown>;
    markServiceAsNotRealized: (solicitationId: number) => Promise<unknown>;

    // Portfolio operations
    addPortfolioItem: (formData: FormData) => Promise<PortfolioItem>;
    removePortfolioItem: (portfolioItemId: number) => Promise<boolean>;

    // Profile operations
    updateProviderProfile: (formData: FormData) => Promise<ProviderProfile>;

    // Pagination
    loadMoreProviders: () => Promise<void>;

    // State management
    setRefetchProviders: (value: boolean) => void;
}

export default function useProviderServices(): UseProviderServicesReturn {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [refetchProviders, setRefetchProviders] = useState(true);
    const [providerAccount, setProviderAccount] = useState<ProviderProfile | null>(null);

    /**
     * Register a new provider
     */
    const registerProvider = useCallback(
        (formData: Record<string, unknown>) => {
            setLoading(true);
            return apiRequest<unknown>('/accounts/registro/prestador/', {
                method: 'POST',
                body: JSON.stringify(formData),
            }).finally(() => {
                setLoading(false);
            });
        },
        []
    );

    /**
     * Login provider with credentials
     */
    const loginProvider = useCallback(async (credentials: AuthCredentials) => {
        setLoading(true);
        try {
            const result = await apiRequest<unknown>('/auth/token/login/', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            return result;
        } catch (error) {
            console.error('Provider login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch all providers without filters
     */
    const fetchAllProviders = useCallback(() => {
        setLoading(true);
        apiRequest<PaginatedResponse<Provider>>('/accounts/prestadores/', {
            method: 'GET',
        })
            .then((result) => {
                const providersList = result?.results || result || [];
                setProviders(Array.isArray(providersList) ? providersList : []);
                setNextPageUrl(result?.next || null);
            })
            .catch((error) => {
                console.error('Error fetching providers:', error);
                setProviders([]);
            })
            .finally(() => {
                setLoading(false);
                setRefetchProviders(false);
            });
    }, []);

    /**
     * Fetch single provider profile by ID
     */
    const fetchProviderProfile = useCallback(
        async (providerId: number): Promise<ProviderProfile> => {
            setLoading(true);
            try {
                const result = await apiRequest<ProviderProfile>(
                    `/accounts/prestadores/${providerId}/`,
                    { method: 'GET' }
                );
                setProviderAccount(result);
                return result;
            } catch (error) {
                console.error('Error fetching provider profile:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch providers with filters applied
     */
    const fetchFilteredProviders = useCallback(
        async (filters: ProviderFilters): Promise<void> => {
            setLoading(true);
            const queryParams: string[] = [];

            // Build query parameters from filters
            if (filters.material !== null && filters.material !== undefined) {
                queryParams.push(`possui_material_proprio=${filters.material}`);
            }
            if (filters.hours24 !== null && filters.hours24 !== undefined) {
                queryParams.push(`disponibilidade=${filters.hours24}`);
            }
            if (filters.weekend !== null && filters.weekend !== undefined) {
                queryParams.push(`atende_fim_de_semana=${filters.weekend}`);
            }
            if (filters.service) {
                queryParams.push(`servico=${filters.service}`);
            }
            if (filters.category) {
                queryParams.push(`categoria=${filters.category}`);
            }
            if (filters.minRating) {
                queryParams.push(`nota_minima=${filters.minRating}`);
            }
            if (filters.orderByRating) {
                queryParams.push('melhor_avaliado=true');
            }
            if (filters.searchTerm) {
                queryParams.push(`nome_servico=${filters.searchTerm}`);
            }
            if (filters.orderByDistance && filters.latitude !== null && filters.longitude !== null) {
                queryParams.push('ordenar_por_distancia=true');
                queryParams.push(`latitude=${filters.latitude}`);
                queryParams.push(`longitude=${filters.longitude}`);
            }

            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

            try {
                const result = await apiRequest<PaginatedResponse<Provider>>(
                    `/accounts/prestadores/${queryString}`,
                    { method: 'GET' }
                );

                let providersList = result?.results || result || [];
                providersList = Array.isArray(providersList) ? providersList : [];

                // Apply client-side rating filter if needed
                if (filters.minRating) {
                    providersList = providersList.filter(
                        (provider) => (Number(provider.nota_media) || 0) >= filters.minRating!
                    );
                }

                setProviders(providersList);
                setNextPageUrl(result?.next || null);
            } catch (error) {
                console.error('Error fetching filtered providers:', error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch best rated providers
     */
    const fetchBestRatedProviders = useCallback(
        async (): Promise<Provider[]> => {
            setLoading(true);
            try {
                const result = await apiRequest<PaginatedResponse<Provider>>(
                    '/accounts/prestadores/?melhor_avaliado=true',
                    { method: 'GET' }
                );
                return result?.results || result || [];
            } catch (error) {
                console.error('Error fetching best rated providers:', error);
                return [];
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Fetch all reviews
     */
    const fetchReviews = useCallback(async (): Promise<Review[]> => {
        setLoading(true);
        try {
            const result = await apiRequest<
                PaginatedResponse<Review> | { avaliacoes: Review[] }
            >('/avaliacoes/listar/', { method: 'GET' });

            if (result && 'results' in result) {
                return result.results;
            }
            if (result && 'avaliacoes' in result) {
                return result.avaliacoes;
            }
            return [];
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch solicitations for provider
     */
    const fetchProviderSolicitations = useCallback(
        async (): Promise<Solicitation[]> => {
            setLoading(true);
            try {
                const result = await apiRequest<PaginatedResponse<Solicitation>>(
                    '/contratacoes/prestador/solicitacoes/',
                    { method: 'GET' }
                );
                return result?.results || result || [];
            } catch (error) {
                console.error('Error fetching provider solicitations:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Mark service as completed
     */
    const markServiceAsCompleted = useCallback(
        async (solicitationId: number): Promise<unknown> => {
            setLoading(true);
            try {
                const result = await apiRequest(
                    `/contratacoes/solicitacoes/${solicitationId}/concluir/`,
                    { method: 'POST' }
                );
                return result;
            } catch (error) {
                console.error('Error completing service:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Mark service as not realized
     */
    const markServiceAsNotRealized = useCallback(
        async (solicitationId: number): Promise<unknown> => {
            setLoading(true);
            try {
                const result = await apiRequest(
                    `/contratacoes/solicitacoes/${solicitationId}/nao-realizado/`,
                    { method: 'POST' }
                );
                return result;
            } catch (error) {
                console.error('Error marking service as not realized:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Add portfolio item
     */
    const addPortfolioItem = useCallback(
        async (formData: FormData): Promise<PortfolioItem> => {
            setLoading(true);
            try {
                const result = await apiRequest<PortfolioItem>(
                    '/portfolio/itens/',
                    { method: 'POST', body: formData }
                );
                return result;
            } catch (error) {
                console.error('Error adding portfolio item:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Remove portfolio item
     */
    const removePortfolioItem = useCallback(
        async (portfolioItemId: number): Promise<boolean> => {
            setLoading(true);
            try {
                await apiRequest(`/portfolio/itens/${portfolioItemId}/`, {
                    method: 'DELETE',
                });
                return true;
            } catch (error) {
                console.error('Error deleting portfolio item:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Update provider profile
     */
    const updateProviderProfile = useCallback(
        async (formData: FormData): Promise<ProviderProfile> => {
            setLoading(true);
            try {
                const result = await apiRequest<ProviderProfile>(
                    '/accounts/perfil/prestador/editar/',
                    { method: 'PATCH', body: formData }
                );
                return result;
            } catch (error) {
                console.error('Error updating provider profile:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Load more providers from pagination
     */
    const loadMoreProviders = useCallback(async (): Promise<void> => {
        if (!nextPageUrl) return;

        setLoadingMore(true);
        try {
            // Normalize URL for backend compatibility
            let fetchUrl = nextPageUrl;
            if (fetchUrl.startsWith('http://127.0.0.1:8000')) {
                fetchUrl = fetchUrl.replace(
                    'http://127.0.0.1:8000',
                    'https://back-end-servicosja-api.onrender.com'
                );
            } else if (fetchUrl.startsWith('http://localhost:8000')) {
                fetchUrl = fetchUrl.replace(
                    'http://localhost:8000',
                    'https://back-end-servicosja-api.onrender.com'
                );
            }

            const result = await apiRequest<PaginatedResponse<Provider>>(fetchUrl, {
                method: 'GET',
            });

            const newProviders = result?.results || result || [];
            const newProvidersList = Array.isArray(newProviders) ? newProviders : [];

            setProviders((prevProviders) => [...prevProviders, ...newProvidersList]);
            setNextPageUrl(result?.next || null);
        } catch (error) {
            console.error('Error loading more providers:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [nextPageUrl]);

    /**
     * Fetch provider by user ID
     */
    const fetchProviderByUserId = useCallback(
        async (userId: number): Promise<Provider | null> => {
            setLoading(true);
            try {
                const data = await apiRequest<PaginatedResponse<Provider>>(
                    '/accounts/prestadores/',
                    { method: 'GET' }
                );
                const providersList = data?.results || data || [];
                const foundProvider = (
                    Array.isArray(providersList) ? providersList : []
                ).find((provider) => provider.user_id === userId || provider.user_id == userId);

                if (foundProvider) {
                    return foundProvider;
                }

                // Try direct API call as fallback
                try {
                    const directResult = await apiRequest<Provider>(
                        `/accounts/prestadores/${userId}/`,
                        { method: 'GET' }
                    );
                    return directResult;
                } catch {
                    console.warn(`Provider with user_id ${userId} not found`);
                    return null;
                }
            } catch (error) {
                console.error('Error searching provider by user ID:', error);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        loading,
        loadingMore,
        providers,
        providerAccount,
        refetchProviders,
        nextPageUrl,
        registerProvider,
        loginProvider,
        fetchAllProviders,
        fetchProviderProfile,
        fetchProviderByUserId,
        fetchFilteredProviders,
        fetchBestRatedProviders,
        fetchReviews,
        fetchProviderSolicitations,
        markServiceAsCompleted,
        markServiceAsNotRealized,
        addPortfolioItem,
        removePortfolioItem,
        updateProviderProfile,
        loadMoreProviders,
        setRefetchProviders,
    };
}
