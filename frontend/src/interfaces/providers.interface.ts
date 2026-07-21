interface ServiceInfo {
    id: number;
    nome: string;
    descricao: string;
}

interface PortfolioItem {
    id: number;
    imagem: string;
}

export interface Provider {
    id: number;
    user_id: number;
    nome: string;
    foto: string | null;
    biografia: string;
    categoria: string;
    localizacao?: string; // Algumas vezes vem como 'bairro, cidade'
    bairro: string;
    cidade: string;
    estado: string;
    nota_media: string | number;
    total_avaliacoes: number;
    servico: ServiceInfo;
    portfolio: PortfolioItem[];
    distancia: number | null;
}

export interface Review {
    id: number;
    cliente_nome: string;
    comentario: string;
    data: string;
    nota: number;
    prestador_id: number;
    prestador_nome: string;
    prestador_foto: string;
}