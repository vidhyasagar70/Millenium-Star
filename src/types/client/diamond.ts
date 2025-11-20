// src/types/client/diamond.ts
export interface ClientDiamond {
    _id: string;
    color: string;
    clarity: string;
    rapList: number;
    discount: number;
    laboratory: string;
    size: number;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescenceColor: string;
    fluorescenceIntensity: string;
    fancyColor?: string;
    fancyColorOvertone?: string;
    fancyColorIntensity?: string;
    measurements: {
        length: number;
        width: number;
        depth: number;
    };
    totalDepth: number;
    table: number;
    certificateNumber: string;
    price: number;
    pricePerCarat: number;
    noBgm?: string;
    fromTab?: string;
    isAvailable: string;
    lab?: string;
    shape?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClientFilters {
    sortBy?: string;
    sortOrder?: string;
    shape?: string[];
    sizeRanges?: Array<{ min: number; max: number }>; // New field for multiple ranges
    sizeMin?: number;
    sizeMax?: number;
    priceMin?: number;
    priceMax?: number;
    discountMin?: number;
    discountMax?: number;
    rapListMin?: number;
    rapListMax?: number;
    color?: string[];
    clarity?: string[];
    cut?: string[];
    polish?: string[];
    symmetry?: string[];
    fluorescenceColor?: string[];
    fluorescenceIntensity?: string[];
    laboratory?: string[];
    searchTerm?: string;
    isAvailable?: string | string[];
}

export interface FilterOptions {
    colors: string[];
    clarities: string[];
    cuts: string[];
    polishes: string[];
    symmetries: string[];
    fluorescences: string[];
    shapes: string[];
    labs: string[];
}
