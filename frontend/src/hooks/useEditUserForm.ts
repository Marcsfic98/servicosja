import { useState, useCallback } from 'react';
import useUserServices from '../services/useUserService';
import { User } from '../models';

/**
 * useEditUserForm Hook
 * Manages user profile edit form logic
 */
interface UseEditUserFormReturn {
    formData: Record<string, unknown>;
    previewImage: string | null;
    isLoading: boolean;
    error: Error | null;
    setFormData: (data: Record<string, unknown>) => void;
    setPreviewImage: (image: string | null) => void;
    updateField: (field: string, value: unknown) => void;
    handleSubmit: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export function useEditUserForm(currentUser: User | null): UseEditUserFormReturn {
    const [formData, setFormData] = useState<Record<string, unknown>>({
        nome: currentUser?.nome || '',
        email: currentUser?.email || '',
        telefone: currentUser?.telefone || '',
        localizacao: currentUser?.localizacao || '',
        foto: null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(
        currentUser?.foto || null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { updateCurrentUser } = useUserServices();

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

            await updateCurrentUser(submitData);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update profile');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [formData, updateCurrentUser]);

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
            nome: currentUser?.nome || '',
            email: currentUser?.email || '',
            telefone: currentUser?.telefone || '',
            localizacao: currentUser?.localizacao || '',
            foto: null,
        });
        setPreviewImage(currentUser?.foto || null);
        setError(null);
    }, [currentUser]);

    return {
        formData,
        previewImage,
        isLoading,
        error,
        setFormData,
        setPreviewImage,
        updateField,
        handleSubmit,
        clearError,
        reset,
    };
}
