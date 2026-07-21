import { useState, useEffect } from 'react';
import useProviderServices from '../services/useProviderService';
import { Provider, Review } from '../models';

/**
 * useHomeData Hook
 * Manages home page data: best rated providers and top reviews
 */
interface UseHomeDataReturn {
    bestProviders: Provider[];
    topReviews: Review[];
    isLoading: boolean;
    error: Error | null;
    retryFetch: () => Promise<void>;
}

export function useHomeData(): UseHomeDataReturn {
    const [bestProviders, setBestProviders] = useState<Provider[]>([]);
    const [topReviews, setTopReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { fetchBestRatedProviders, fetchReviews } = useProviderServices();

    const loadHomeData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [providers, reviews] = await Promise.all([
                fetchBestRatedProviders(),
                fetchReviews(),
            ]);

            // Limit to 6 items
            setBestProviders(providers.slice(0, 6));

            // Sort reviews by rating and limit to 6
            const sortedReviews = reviews.sort((a, b) => b.nota - a.nota);
            setTopReviews(sortedReviews.slice(0, 6));
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to load home data');
            setError(error);
            console.error('Error loading home data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHomeData();
    }, []);

    return {
        bestProviders,
        topReviews,
        isLoading,
        error,
        retryFetch: loadHomeData,
    };
}
