import { useState, useEffect } from 'react';
import useProviderServices from '../services/useProviderService';
import { Provider, Review } from '../models';

/**
 * useProviderDetails Hook
 * Manages provider profile details and reviews
 */
interface UseProviderDetailsReturn {
    provider: Provider | null;
    reviews: Review[];
    isLoading: boolean;
    error: Error | null;
    averageRating: number;
    totalReviews: number;
}

export function useProviderDetails(providerId: number): UseProviderDetailsReturn {
    const [provider, setProvider] = useState<Provider | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { fetchProviderProfile, fetchReviews } = useProviderServices();

    useEffect(() => {
        const loadProviderDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [providerData, allReviews] = await Promise.all([
                    fetchProviderProfile(providerId),
                    fetchReviews(),
                ]);

                setProvider(providerData);

                // Filter reviews for this provider
                const providerReviews = allReviews.filter(
                    (review) => review.prestador_id === providerId
                );
                setReviews(providerReviews);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to load provider details');
                setError(error);
                console.error('Error loading provider details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProviderDetails();
    }, [providerId, fetchProviderProfile, fetchReviews]);

    const averageRating = provider ? Number(provider.nota_media) || 0 : 0;
    const totalReviews = provider ? provider.total_avaliacoes : 0;

    return {
        provider,
        reviews,
        isLoading,
        error,
        averageRating,
        totalReviews,
    };
}
