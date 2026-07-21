import { useEffect, useMemo, useRef, useState } from 'react';
import { FaFilter, FaSearch, FaStar } from 'react-icons/fa';
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

  const activeMenuItem = categories.find(
    (category) => category.id === activeMenuId,
  );

  // Handlers
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

  // CORREÇÃO 1: Ordenação sem mutação direta usando useMemo
  const displayedProviders = useMemo(() => {
    if (!providers || !Array.isArray(providers)) return [];

    // Criamos uma cópia do array [...providers] para não mutar o estado original
    const providersCopy = [...providers];

    if (selectedRating !== null) {
      return providersCopy.sort((a, b) => {
        const distA = Math.abs(Number(a.nota_media || 0) - selectedRating);
        const distB = Math.abs(Number(b.nota_media || 0) - selectedRating);

        if (distA === distB) {
          return Number(b.nota_media || 0) - Number(a.nota_media || 0);
        }
        return distA - distB;
      });
    }

    return providersCopy;
  }, [providers, selectedRating]);

  // Check se todos os filtros estão limpos/inativos
  const isAllFiltersCleared =
    !filtersMaterial &&
    !filtersHours24 &&
    !filtersWeekend &&
    selectedRating === null &&
    !filtersOrderByDistance &&
    !filtersOrderByRating &&
    selectedCategoryId === null &&
    searchQuery === '';

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
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
      <div
        className={styles.menuWrapper}
        onMouseLeave={() => setActiveMenuId(null)}
      >
        <div className={styles.servicesMenu}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.menuItem}
              onMouseEnter={() => setActiveMenuId(category.id)}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  selectCategory(category.id);
                }}
              >
                {category.nome}
              </a>
            </div>
          ))}
        </div>

        {/* Submenu */}
        {activeMenuItem && activeMenuItem.servicos && (
          <div className={styles.menuFilter}>
            {(activeMenuItem.servicos as any[])
              .slice()
              .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
              .map((service) => (
                <a
                  key={service.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // CORREÇÃO 2: Passa o ID do serviço selecionado
                    selectCategory(service.id);
                  }}
                >
                  {service.nome}
                </a>
              ))}
          </div>
        )}
      </div>

      {/* Mobile Bar */}
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
          <button type="button">
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
        {/* Desktop Filters Side Panel */}
        <div className={styles.servicesFilter}>
          <div className={styles.filterItem}>
            <input
              type="text"
              placeholder="Buscar por serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button">
              <FaSearch />
            </button>
          </div>

          <div className={styles.serviceClassific}>
            <h4>Filtrar por:</h4>
            <div className={styles.serviceClassificBox}>
              <h2>Classificação de Profissionais</h2>
              <div className={styles.starSponsored}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    color={
                      star <= (selectedRating || 0) ? '#ffcd29' : '#7d7d7e'
                    }
                    onClick={() =>
                      setRatingFilter(selectedRating === star ? null : star)
                    }
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
                checked={Boolean(filtersOrderByDistance)}
                onChange={(e) => setProximityFilter(e.target.checked)}
              />
              <span>Mais Próximos</span>
            </div>
            <div className={styles.serviceItem}>
              <input
                type="checkbox"
                checked={Boolean(filtersOrderByRating)}
                onChange={(e) => setRatingOrderFilter(e.target.checked)}
              />
              <span>Melhores Avaliados</span>
            </div>

            <h3>Material Próprio</h3>
            <div className={styles.serviceItem}>
              <input
                type="checkbox"
                checked={Boolean(filtersMaterial)}
                onChange={(e) =>
                  setMaterialFilter(e.target.checked ? true : null)
                }
              />
              <span>Possui Material</span>
            </div>
          </div>

          <div className={styles.servicesList}>
            <h3>Disponibilidade</h3>
            <div className={styles.serviceItem}>
              <input
                type="checkbox"
                checked={Boolean(filtersHours24)}
                onChange={(e) =>
                  setHours24Filter(e.target.checked ? true : null)
                }
              />
              <span>Atende 24h</span>
            </div>
            <div className={styles.serviceItem}>
              <input
                type="checkbox"
                checked={Boolean(filtersWeekend)}
                onChange={(e) =>
                  setWeekendFilter(e.target.checked ? true : null)
                }
              />
              <span>Atende fim de semana</span>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
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
            <div className={styles.serviceClassific}>
              <h4>Filtrar por:</h4>
              <div className={styles.serviceClassificBox}>
                <h2>Classificação de Profissionais</h2>
                <div className={styles.starSponsored}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      color={
                        star <= (selectedRating || 0) ? '#ffcd29' : '#7d7d7e'
                      }
                      onClick={() =>
                        setRatingFilter(selectedRating === star ? null : star)
                      }
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
                  checked={Boolean(filtersOrderByDistance)}
                  onChange={(e) => setProximityFilter(e.target.checked)}
                />
                <span>Mais Próximos</span>
              </div>
              <div className={styles.serviceItem}>
                <input
                  type="checkbox"
                  checked={Boolean(filtersOrderByRating)}
                  onChange={(e) => setRatingOrderFilter(e.target.checked)}
                />
                <span>Melhores Avaliados</span>
              </div>

              <h3>Material Próprio</h3>
              <div className={styles.serviceItem}>
                <input
                  type="checkbox"
                  checked={Boolean(filtersMaterial)}
                  onChange={(e) =>
                    setMaterialFilter(e.target.checked ? true : null)
                  }
                />
                <span>Possui Material</span>
              </div>
            </div>

            <div className={styles.servicesList}>
              <h3>Disponibilidade</h3>
              <div className={styles.serviceItem}>
                <input
                  type="checkbox"
                  checked={Boolean(filtersHours24)}
                  onChange={(e) =>
                    setHours24Filter(e.target.checked ? true : null)
                  }
                />
                <span>Atende 24h</span>
              </div>
              <div className={styles.serviceItem}>
                <input
                  type="checkbox"
                  checked={Boolean(filtersWeekend)}
                  onChange={(e) =>
                    setWeekendFilter(e.target.checked ? true : null)
                  }
                />
                <span>Atende fim de semana</span>
              </div>
            </div>
          </div>
        )}

        {/* Providers Grid */}
        <section
          className={
            isLoadingProviders
              ? styles.providerContainerLogin
              : styles.providerContainer
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
                    type="button"
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
