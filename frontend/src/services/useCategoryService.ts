import { useState, useCallback } from 'react';
import { apiRequest } from './api';
import { Category, PaginatedResponse } from '../models';

/**
 * Category Services Hook
 * Manages all category-related API operations
 */
interface UseCategoryServicesReturn {
    loadingCategories: boolean;
    categories: Category[];
    fetchCategories: () => Promise<Category[]>;
}

export default function useCategoryServices(): UseCategoryServicesReturn {
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    /**
     * Fetch all service categories with included services
     */
    const fetchCategories = useCallback(async (): Promise<Category[]> => {
        setLoadingCategories(true);
        try {
            const result = await apiRequest<PaginatedResponse<Category>>(
                '/servicos/categorias/?include_servicos=true',
                { method: 'GET' }
            );
            const categoriesList = result?.results || result || [];
            const validCategories = Array.isArray(categoriesList) ? categoriesList : [];
            setCategories(validCategories);
            return validCategories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    return {
        loadingCategories,
        categories,
        fetchCategories,
    };
}
