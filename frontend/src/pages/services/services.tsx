import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaStar, FaFilter } from 'react-icons/fa';
import { ImMenu3 } from 'react-icons/im';
import ProviderBox from '../../components/providerBox/providerBox';
import { useProviderContext } from '../../context/ProviderContext';
import { useServicesFilter } from '../../hooks/useServicesFilter';
import { normalizeImageUrl } from '../../utils/imageUrlUtil';
import Loading3 from '../loading/loading3';
import styles from './services.module.css';

export default function Services() {
    const servicesRef = useRef<HTMLDivElement>(null);
    const { setProviderSelected } = useProviderContext();

    // State
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Hook
    const {
        providers,
        categories,
        selectedCategoryId,
        selectedRating,
        searchQuery,
        isLoadingCategories,
        isLoadingProviders,
        hasMoreProviders,
        filtersMaterial,
        filtersHours24,
        filtersWeekend,
        filtersOrderByDistance,
        filtersOrderByRating,
        selectCategory,
        setSearchQuery,
        setRatingFilter,
        setMaterialFilter,
        setHours24Filter,
        setWeekendFilter,
        setProximityFilter,
        setRatingOrderFilter,
        clearAllFilters,
        loadMoreProviders,
    } = useServicesFilter();

    const activeMenuItem = categories.find((category) => category.id === activeMenuId);

    // Handle menu interactions
    const handleToggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
        setActiveMenuId(null);
        setIsFilterMenuOpen(false);
    };

    const handleToggleFilterMenu = () => {
        setIsFilterMenuOpen((prev) => !prev);
        setIsMobileMenuOpen(false);
        setActiveMenuId(null);
    };

    const handleProviderSelect = (provider: any) => {
        setProviderSelected(provider);
    };

    // Sort providers by selected rating
    const displayedProviders = providers.sort((a, b) => {
        if (selectedRating !== null) {
            const distA = Math.abs(Number(a.nota_media || 0) - selectedRating);
            const distB = Math.abs(Number(b.nota_media || 0) - selectedRating);

            if (distA === distB) {
                return Number(b.nota_media || 0) - Number(a.nota_media || 0);
            }
            return distA - distB;
        }
        return 0;
    });

    const isAllFiltersCleared =
        filtersMaterial === null &&
        filtersHours24 === null &&
        filtersWeekend === null &&
        selectedRating === null &&
        filtersOrderByDistance === null &&
        filtersOrderByRating === null &&
        selectedCategoryId === null &&
        searchQuery === '';

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
                setActiveMenuId(null);
                setIsFilterMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.services} ref={servicesRef}>
            {/* Desktop Menu */}
            <div className={styles.menuWrapper} onMouseLeave={() => setActiveMenuId(null)}>
                <div className={styles.servicesMenu}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={styles.menuItem}
                            onMouseEnter={() => setActiveMenuId(category.id)}
                        >
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                {category.nome}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Submenu for active category */}
                {activeMenuItem && activeMenuItem.servicos && (
                    <div className={styles.menuFilter}>
                        {(activeMenuItem.servicos as any[])
                            .slice()
                            .sort((a, b) => {
                                const nomeA = (a.nome || '').toLowerCase();
                                const nomeB = (b.nome || '').toLowerCase();
                                return nomeA.localeCompare(nomeB);
                            })
                            .map((service) => (
                                <a
                                    key={service.id}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        selectCategory(activeMenuId);
                                    }}
                                >
                                    {service.nome}
                                </a>
                            ))}
                    </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className={styles.menuMobile}>
                <div className={styles.icon} onClick={handleToggleMobileMenu}>
                    <ImMenu3 />
                </div>
                <div className={styles.iconT} onClick={handleToggleFilterMenu}>
                    <FaFilter />
                </div>
                <div className={styles.filterItemMenu}>
                    <input
                        type="text"
                        placeholder="Buscar por serviço..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button>
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* Mobile Categories Menu */}
            {isMobileMenuOpen && (
                <div className={styles.servicesMenuMobile}>
                    {categories.map((category) => (
                        <div key={category.id} className={styles.menuItem}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    selectCategory(category.id);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                {category.nome}
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className={styles.servicesBody}>
                {/* Desktop Filters */}
                <div className={styles.servicesFilter}>
                    {/* Search */}
                    <div className={styles.filterItem}>
                        <input
                            type="text"
                            placeholder="Buscar por serviço..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button>
                            <FaSearch />
                        </button>
                    </div>

                    {/* Rating Filter */}
                    <div className={styles.serviceClassific}>
                        <h4>Filtrar por:</h4>
                        <div className={styles.serviceClassificBox}>
                            <h2>Classificação de Profissionais</h2>
                            <div className={styles.starSponsored}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        color={star <= (selectedRating || 0) ? '#ffcd29' : '#7d7d7e'}
                                        onClick={() => setRatingFilter(selectedRating === star ? null : star)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Clear All Filters */}
                    <div className={styles.serviceItem}>
                        <input
                            type="checkbox"
                            checked={isAllFiltersCleared}
                            onChange={() => clearAllFilters()}
                        />
                        <span>Todos</span>
                    </div>

                    {/* Main Filters */}
                    <div className={styles.servicesList}>
                        <h3>Filtros</h3>
                        <div className={styles.serviceItem}>
                            <input
                                type="checkbox"
                                checked={filtersOrderByDistance === true}
                                onChange={(e) => setProximityFilter(e.target.checked)}
                            />
                            <span>Mais Próximos</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <input
                                type="checkbox"
                                checked={filtersOrderByRating === true}
                                onChange={(e) => setRatingOrderFilter(e.target.checked)}
                            />
                            <span>Melhores Avaliados</span>
                        </div>

                        <h3>Material Próprio</h3>
                        <div className={styles.serviceItem}>
                            <input
                                type="checkbox"
                                checked={filtersMaterial === true}
                                onChange={(e) => setMaterialFilter(e.target.checked ? true : null)}
                            />
                            <span>Possui Material</span>
                        </div>
                    </div>

                    {/* Availability Filters */}
                    <div className={styles.servicesList}>
                        <h3>Disponibilidade</h3>
                        <div className={styles.serviceItem}>
                            <input
                                type="checkbox"
                                checked={filtersHours24 === true}
                                onChange={(e) => setHours24Filter(e.target.checked ? true : null)}
                            />
                            <span>Atende 24h</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <input
                                type="checkbox"
                                checked={filtersWeekend === true}
                                onChange={(e) => setWeekendFilter(e.target.checked ? true : null)}
                            />
                            <span>Atende fim de semana</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Filters */}
                {isFilterMenuOpen && (
                    <div
                        className={styles.servicesFilter}
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '155px',
                            left: 0,
                            width: '100%',
                            zIndex: 100,
                            backgroundColor: '#fcfcfc',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Same filters as desktop */}
                        <div className={styles.serviceClassific}>
                            <h4>Filtrar por:</h4>
                            <div className={styles.serviceClassificBox}>
                                <h2>Classificação de Profissionais</h2>
                                <div className={styles.starSponsored}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            color={star <= (selectedRating || 0) ? '#ffcd29' : '#7d7d7e'}
                                            onClick={() => setRatingFilter(selectedRating === star ? null : star)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.serviceItem}>
                            <input
                                type="checkbox"
                                checked={isAllFiltersCleared}
                                onChange={() => clearAllFilters()}
                            />
                            <span>Todos</span>
                        </div>

                        <div className={styles.servicesList}>
                            <h3>Filtros</h3>
                            <div className={styles.serviceItem}>
                                <input
                                    type="checkbox"
                                    checked={filtersOrderByDistance === true}
                                    onChange={(e) => setProximityFilter(e.target.checked)}
                                />
                                <span>Mais Próximos</span>
                            </div>
                            <div className={styles.serviceItem}>
                                <input
                                    type="checkbox"
                                    checked={filtersOrderByRating === true}
                                    onChange={(e) => setRatingOrderFilter(e.target.checked)}
                                />
                                <span>Melhores Avaliados</span>
                            </div>

                            <h3>Material Próprio</h3>
                            <div className={styles.serviceItem}>
                                <input
                                    type="checkbox"
                                    checked={filtersMaterial === true}
                                    onChange={(e) => setMaterialFilter(e.target.checked ? true : null)}
                                />
                                <span>Possui Material</span>
                            </div>
                        </div>

                        <div className={styles.servicesList}>
                            <h3>Disponibilidade</h3>
                            <div className={styles.serviceItem}>
                                <input
                                    type="checkbox"
                                    checked={filtersHours24 === true}
                                    onChange={(e) => setHours24Filter(e.target.checked ? true : null)}
                                />
                                <span>Atende 24h</span>
                            </div>
                            <div className={styles.serviceItem}>
                                <input
                                    type="checkbox"
                                    checked={filtersWeekend === true}
                                    onChange={(e) => setWeekendFilter(e.target.checked ? true : null)}
                                />
                                <span>Atende fim de semana</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Providers Grid */}
                <section
                    className={
                        isLoadingProviders ? styles.providerContainerLogin : styles.providerContainer
                    }
                >
                    {isLoadingProviders ? (
                        <Loading3 />
                    ) : (
                        <>
                            {displayedProviders.map((provider) => (
                                <div
                                    className={styles.box}
                                    key={provider.id}
                                    onClick={() => handleProviderSelect(provider)}
                                >
                                    <ProviderBox
                                        name={provider.nome}
                                        location={`${provider.cidade}, ${provider.bairro}`}
                                        rating={provider.nota_media}
                                        resum={provider.biografia || 'Sem descrição'}
                                        image={normalizeImageUrl(provider.foto || '')}
                                    />
                                </div>
                            ))}

                            {hasMoreProviders && (
                                <div className={styles.loadMoreContainer}>
                                    <button
                                        className={styles.loadMoreButton}
                                        onClick={loadMoreProviders}
                                        disabled={isLoadingProviders}
                                    >
                                        {isLoadingProviders ? 'Carregando...' : 'Carregar Mais'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
