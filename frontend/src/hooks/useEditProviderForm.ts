import { useState, useCallback } from 'react';
import useProviderServices from '../services/useProviderService';
import useCategoryServices from '../services/useCategoryService';
import { ProviderProfile, Service } from '../models';

/**
 * useEditProviderForm Hook
 * Manages provider profile edit form logic with portfolio
 */
interface UseEditProviderFormReturn {
    formData: Record<string, unknown>;
    previewImage: string | null;
    selectedServiceId: number | null;
    availableServices: Service[];
    isLoadingCategories: boolean;
    isLoading: boolean;
    error: Error | null;
    updateField: (field: string, value: unknown) => void;
    setPreviewImage: (image: string | null) => void;
    setSelectedServiceId: (serviceId: number | null) => void;
    handleSubmit: () => Promise<void>;
    handleAddPortfolioItem: (formData: FormData) => Promise<void>;
    handleRemovePortfolioItem: (itemId: number) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export function useEditProviderForm(
    currentProvider: ProviderProfile | null
): UseEditProviderFormReturn {
    const [formData, setFormData] = useState<Record<string, unknown>>({
        nome: currentProvider?.nome || '',
        email: currentProvider?.email || '',
        biografia: currentProvider?.biografia || '',
        telefone: currentProvider?.telefone || '',
        localizacao: currentProvider?.localizacao || '',
        bairro: currentProvider?.bairro || '',
        cidade: currentProvider?.cidade || '',
        estado: currentProvider?.estado || '',
        categoria: currentProvider?.categoria || '',
        servico: currentProvider?.servico?.id || '',
        foto: null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(
        currentProvider?.foto || null
    );
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        currentProvider?.servico?.id || null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { updateProviderProfile, addPortfolioItem, removePortfolioItem } =
        useProviderServices();
    const { categories, loadingCategories: isLoadingCategories } = useCategoryServices();

    // Get services from selected category
    const availableServices: Service[] = categories
        .find((cat) => cat.id === Number(formData.categoria))
        ?.servicos || [];

    /**
     * Update individual form field
     */
    const updateField = useCallback((field: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
    }, []);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const submitData = new FormData();

            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && key !== 'foto') {
                    submitData.append(key, String(value));
                }
            });

            // Add photo if changed
            if (formData.foto instanceof File) {
                submitData.append('foto', formData.foto);
            }

            await updateProviderProfile(submitData);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update profile');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [formData, updateProviderProfile]);

    /**
     * Handle adding portfolio item
     */
    const handleAddPortfolioItem = useCallback(
        async (portfolioFormData: FormData) => {
            setIsLoading(true);
            setError(null);
            try {
                await addPortfolioItem(portfolioFormData);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to add portfolio item');
                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [addPortfolioItem]
    );

    /**
     * Handle removing portfolio item
     */
    const handleRemovePortfolioItem = useCallback(
        async (itemId: number) => {
            setIsLoading(true);
            setError(null);
            try {
                await removePortfolioItem(itemId);
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error('Failed to remove portfolio item');
                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [removePortfolioItem]
    );

    /**
     * Clear error message
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Reset form to initial state
     */
    const reset = useCallback(() => {
        setFormData({
            nome: currentProvider?.nome || '',
            email: currentProvider?.email || '',
            biografia: currentProvider?.biografia || '',
            telefone: currentProvider?.telefone || '',
            localizacao: currentProvider?.localizacao || '',
            bairro: currentProvider?.bairro || '',
            cidade: currentProvider?.cidade || '',
            estado: currentProvider?.estado || '',
            categoria: currentProvider?.categoria || '',
            servico: currentProvider?.servico?.id || '',
            foto: null,
        });
        setPreviewImage(currentProvider?.foto || null);
        setSelectedServiceId(currentProvider?.servico?.id || null);
        setError(null);
    }, [currentProvider]);

    return {
        formData,
        previewImage,
        selectedServiceId,
        availableServices,
        isLoadingCategories,
        isLoading,
        error,
        updateField,
        setPreviewImage,
        setSelectedServiceId,
        handleSubmit,
        handleAddPortfolioItem,
        handleRemovePortfolioItem,
        clearError,
        reset,
    };
}
