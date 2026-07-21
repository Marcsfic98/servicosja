/**
 * Models - Interfaces and types for backend data structures
 * Strongly typed interfaces for all API responses
 */

// ============================================
// AUTH & USER MODELS
// ============================================

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthResponse extends AuthTokens {
    user?: User;
    tipo_usuario?: 'cliente' | 'prestador';
}

export interface AuthData extends AuthTokens {
    tipo_usuario?: 'cliente' | 'prestador';
    user_id?: number;
}

export enum UserType {
    CLIENT = 'cliente',
    PROVIDER = 'prestador'
}

export interface BaseUser {
    id: number;
    email: string;
    nome: string;
    foto: string | null;
    tipo_usuario: UserType | string;
}

export interface User extends BaseUser {
    bio?: string;
    telefone?: string;
    localizacao?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
}

export interface ClientProfile extends User {
    data_criacao?: string;
}

// ============================================
// PROVIDER MODELS
// ============================================

export interface ServiceInfo {
    id: number;
    nome: string;
    descricao: string;
}

export interface PortfolioItem {
    id: number;
    imagem: string;
    titulo?: string;
    descricao?: string;
}

export interface ProviderFilters {
    material?: boolean | null;
    hours24?: boolean | null;
    weekend?: boolean | null;
    service?: string | null;
    category?: string | null;
    minRating?: number | null;
    orderByDistance?: boolean | null;
    orderByRating?: boolean | null;
    latitude?: number | null;
    longitude?: number | null;
    searchTerm?: string | null;
}

export interface Provider extends BaseUser {
    user_id: number;
    biografia: string;
    categoria: string;
    localizacao?: string;
    bairro: string;
    cidade: string;
    estado: string;
    nota_media: string | number;
    total_avaliacoes: number;
    servico: ServiceInfo;
    portfolio: PortfolioItem[];
    distancia: number | null;
    possui_material_proprio?: boolean;
    disponibilidade?: boolean;
    atende_fim_de_semana?: boolean;
}

export interface ProviderProfile extends Provider {
    descricao_completa?: string;
    anos_experiencia?: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// ============================================
// REVIEW & RATING MODELS
// ============================================

export interface Review {
    id: number;
    cliente_nome: string;
    cliente_id?: number;
    comentario: string;
    data: string;
    nota: number;
    prestador_id: number;
    prestador_nome: string;
    prestador_foto: string;
    titulo?: string;
}

export interface CreateReviewPayload {
    prestador_id: number;
    nota: number;
    comentario: string;
    titulo?: string;
}

export interface RatingStats {
    media: number;
    total: number;
    distribuicao: {
        [key: number]: number; // { 5: 10, 4: 5, 3: 2, etc }
    };
}

// ============================================
// CATEGORY MODELS
// ============================================

export interface Category {
    id: number;
    nome: string;
    descricao?: string;
    icone?: string;
    total_prestadores?: number;
    servicos?: Service[];
}

// ============================================
// SERVICE MODELS
// ============================================

export interface Service {
    id: number;
    nome: string;
    descricao: string;
    categoria?: Category;
    icone?: string;
}

// ============================================
// SOLICITATION & CONTRACT MODELS
// ============================================

export enum SolicitationStatus {
    PENDING = 'pendente',
    ACCEPTED = 'aceito',
    REJECTED = 'rejeitado',
    COMPLETED = 'completo',
    CANCELLED = 'cancelado'
}

export interface Solicitation {
    id: number;
    cliente_id: number;
    cliente_nome: string;
    prestador_id: number;
    prestador_nome: string;
    servico_id: number;
    servico_nome: string;
    status: SolicitationStatus | string;
    data_criacao: string;
    data_atualizacao?: string;
    descricao?: string;
}

export interface ClientSolicitation extends Solicitation {
    prestador_foto?: string;
    prestador_categoria?: string;
}

export interface ProviderSolicitation extends Solicitation {
    cliente_foto?: string;
    cliente_telefone?: string;
}

export interface CreateSolicitationPayload {
    prestador_id: number;
    servico: number;
}

// ============================================
// LOCATION MODELS
// ============================================

export interface Location {
    latitude: number;
    longitude: number;
}

export interface UserLocation extends Location {
    nome?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
}

// ============================================
// PAGINATION MODELS
// ============================================

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

// ============================================
// ERROR MODELS
// ============================================

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
    field?: string;
}

// ============================================
// REQUEST/RESPONSE MODELS
// ============================================

export interface ApiRequestConfig {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: string | FormData | null;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    statusCode: number;
}

// ============================================
// FAVORITE MODELS
// ============================================

export interface FavoritePayload {
    prestador_id: number;
}

export interface Favorite {
    id: number;
    cliente_id: number;
    prestador_id: number;
    data_criacao: string;
}
