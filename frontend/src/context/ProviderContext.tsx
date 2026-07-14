import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Provider } from '../models';

/**
 * Provider Context
 * Manages the currently selected provider for viewing details
 */

interface ProviderContextType {
    providerSelected: Provider | null;
    setProviderSelected: (provider: Provider | null) => void;
}

interface ProviderProviderProps {
    children: ReactNode;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

/**
 * Hook to access provider context
 * @throws {Error} if used outside ProviderProvider
 */
export const useProviderContext = (): ProviderContextType => {
    const context = useContext(ProviderContext);
    if (!context) {
        throw new Error('useProviderContext must be used within ProviderProvider');
    }
    return context;
};

/**
 * Provider Context Provider Component
 */
export const ProviderProvider: React.FC<ProviderProviderProps> = ({ children }) => {
    const [providerSelected, setProviderSelected] = useState<Provider | null>(null);

    const contextValue: ProviderContextType = {
        providerSelected,
        setProviderSelected,
    };

    return (
        <ProviderContext.Provider value={contextValue}>
            {children}
        </ProviderContext.Provider>
    );
};
