import { useState, useCallback, useEffect } from 'react';
import useProviderServices from '../services/useProviderService';
import useCategoryServices from '../services/useCategoryService';
import { Provider, ProviderFilters, Category, Location } from '../models';

/**
 * useServicesFilter Hook
 * Manages service page filtering and provider search
 */
interface UseServicesFilterReturn {
    // State
    providers: Provider[];
    categories: Category[];
    selectedCategoryId: number | null;
    selectedServiceId: string | null;
    selectedRating: number | null;
    searchQuery: string;
    userLocation: Location | null;
    isLoadingCategories: boolean;
    isLoadingProviders: boolean;
    hasMoreProviders: boolean;

    // Filter state
    filtersMaterial: boolean | null;
    filtersHours24: boolean | null;
    filtersWeekend: boolean | null;
    filtersOrderByDistance: boolean | null;
    filtersOrderByRating: boolean | null;

    // Actions
    selectCategory: (categoryId: number | null) => void;
    selectService: (serviceId: string | null) => void;
    setRatingFilter: (rating: number | null) => void;
    setSearchQuery: (query: string) => void;
    setMaterialFilter: (value: boolean | null) => void;
    setHours24Filter: (value: boolean | null) => void;
    setWeekendFilter: (value: boolean | null) => void;
    setProximityFilter: (enabled: boolean) => void;
    setRatingOrderFilter: (enabled: boolean) => void;
    clearAllFilters: () => void;
    loadMoreProviders: () => Promise<void>;
    applyFilters: () => Promise<void>;
}

export function useServicesFilter(): UseServicesFilterReturn {
    // State
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState<Location | null>(null);

    // Filter state
    const [filtersMaterial, setFiltersMaterial] = useState<boolean | null>(null);
    const [filtersHours24, setFiltersHours24] = useState<boolean | null>(null);
    const [filtersWeekend, setFiltersWeekend] = useState<boolean | null>(null);
    const [filtersOrderByDistance, setFiltersOrderByDistance] = useState<boolean | null>(null);
    const [filtersOrderByRating, setFiltersOrderByRating] = useState<boolean | null>(null);

    // Services
    const {
        providers,
        loadingMore: isLoadingProviders,
        nextPageUrl,
        fetchAllProviders,
        fetchFilteredProviders,
        loadMoreProviders,
    } = useProviderServices();

    const { categories, loadingCategories: isLoadingCategories, fetchCategories } =
        useCategoryServices();

    // Load categories and initial providers on mount
    useEffect(() => {
        fetchCategories();
        fetchAllProviders();
    }, []);

    /**
     * Select category and clear filters
     */
    const handleSelectCategory = useCallback((categoryId: number | null) => {
        setSelectedCategoryId(categoryId);
        setSelectedServiceId(null);
    }, []);

    /**
     * Select service
     */
    const handleSelectService = useCallback((serviceId: string | null) => {
        setSelectedServiceId(serviceId);
    }, []);

    /**
     * Set rating filter
     */
    const handleSetRatingFilter = useCallback((rating: number | null) => {
        setSelectedRating(rating);
    }, []);

    /**
     * Update search query
     */
    const handleSetSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    /**
     * Toggle material filter
     */
    const handleSetMaterialFilter = useCallback((value: boolean | null) => {
        setFiltersMaterial(value);
    }, []);

    /**
     * Toggle 24h availability filter
     */
    const handleSetHours24Filter = useCallback((value: boolean | null) => {
        setFiltersHours24(value);
    }, []);

    /**
     * Toggle weekend availability filter
     */
    const handleSetWeekendFilter = useCallback((value: boolean | null) => {
        setFiltersWeekend(value);
    }, []);

    /**
     * Request location and set proximity filter
     */
    const handleSetProximityFilter = useCallback((enabled: boolean) => {
        if (enabled) {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setFiltersOrderByDistance(true);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert(
                        'Unable to get your location. Please check browser geolocation permissions.'
                    );
                }
            );
        } else {
            setFiltersOrderByDistance(null);
            setUserLocation(null);
        }
    }, []);

    /**
     * Toggle rating order filter
     */
    const handleSetRatingOrderFilter = useCallback((enabled: boolean) => {
        setFiltersOrderByRating(enabled ? true : null);
    }, []);

    /**
     * Clear all filters and reset
     */
    const handleClearAllFilters = useCallback(() => {
        setSelectedCategoryId(null);
        setSelectedServiceId(null);
        setSelectedRating(null);
        setSearchQuery('');
        setFiltersMaterial(null);
        setFiltersHours24(null);
        setFiltersWeekend(null);
        setFiltersOrderByDistance(null);
        setFiltersOrderByRating(null);
        setUserLocation(null);
        fetchAllProviders();
    }, []);

    /**
     * Apply current filter configuration
     */
    const handleApplyFilters = useCallback(async () => {
        const filters: ProviderFilters = {
            material: filtersMaterial,
            hours24: filtersHours24,
            weekend: filtersWeekend,
            service: selectedServiceId,
            category: selectedCategoryId?.toString() || undefined,
            minRating: selectedRating,
            orderByDistance: filtersOrderByDistance,
            orderByRating: filtersOrderByRating,
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
            searchTerm: searchQuery || undefined,
        };

        await fetchFilteredProviders(filters);
    }, [
        filtersMaterial,
        filtersHours24,
        filtersWeekend,
        selectedServiceId,
        selectedCategoryId,
        selectedRating,
        filtersOrderByDistance,
        filtersOrderByRating,
        userLocation,
        searchQuery,
        fetchFilteredProviders,
    ]);

    return {
        // State
        providers,
        categories,
        selectedCategoryId,
        selectedServiceId,
        selectedRating,
        searchQuery,
        userLocation,
        isLoadingCategories,
        isLoadingProviders,
        hasMoreProviders: !!nextPageUrl,

        // Filter state
        filtersMaterial,
        filtersHours24,
        filtersWeekend,
        filtersOrderByDistance,
        filtersOrderByRating,

        // Actions
        selectCategory: handleSelectCategory,
        selectService: handleSelectService,
        setRatingFilter: handleSetRatingFilter,
        setSearchQuery: handleSetSearchQuery,
        setMaterialFilter: handleSetMaterialFilter,
        setHours24Filter: handleSetHours24Filter,
        setWeekendFilter: handleSetWeekendFilter,
        setProximityFilter: handleSetProximityFilter,
        setRatingOrderFilter: handleSetRatingOrderFilter,
        clearAllFilters: handleClearAllFilters,
        loadMoreProviders,
        applyFilters: handleApplyFilters,
    };
}
