import { useState, useEffect, useCallback } from 'react';

/**
 * useNavbarScrollHide Hook
 * Manages navbar visibility based on scroll direction
 */
interface UseNavbarScrollHideReturn {
    isVisible: boolean;
    scrollY: number;
}

export function useNavbarScrollHide(): UseNavbarScrollHideReturn {
    const [isVisible, setIsVisible] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setScrollY(currentScrollY);

        // Show navbar when scrolling up, hide when scrolling down
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return { isVisible, scrollY };
}
