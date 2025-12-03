import {
    ClientDiamond,
    ClientFilters,
    FilterOptions,
} from "@/types/client/diamond";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    count?: number;
}

interface SearchResponse {
    data: ClientDiamond[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface CartItem {
    diamondId: string;
    certificateNumber: string;
    addedAt: string;
    _id: string;
}

interface CartResponse {
    success: boolean;
    message: string;
    data: {
        cart: {
            cart: {
                _id: string;
                userId: string;
                items: Array<{
                    diamondId: string;
                    certificateNumber: string;
                    addedAt: string;
                    _id: string;
                }>;
                createdAt: string;
                updatedAt: string;
            };
            user: {
                _id: string;
                username: string;
                email: string;
            };
            items: Array<{
                cartItem: {
                    diamondId: string;
                    certificateNumber: string;
                    addedAt: string;
                    _id: string;
                };
                diamond: ClientDiamond;
            }>;
        };
        totalItems: number;
    };
}

interface HoldItem {
    _id: string;
    certificateNumber: string;
    userId: string;
    status: string;
    rejectionReason: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

class ClientDiamondAPI {
    async searchDiamonds(
        filters: ClientFilters = {},
        page: number = 1,
        limit: number = 20
    ): Promise<SearchResponse> {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "sizeRanges" && Array.isArray(value)) {
                    value.forEach((range) => {
                        if (
                            range.min !== undefined &&
                            range.max !== undefined
                        ) {
                            params.append("sizeMin", range.min.toString());
                            params.append("sizeMax", range.max.toString());
                        }
                    });
                } else if (Array.isArray(value)) {
                    if (value.length > 0) {
                        value.forEach((item) => {
                            params.append(key, item);
                        });
                    }
                } else {
                    params.append(key, value.toString());
                }
            }
        });
        const response = await fetch(
            `${API_BASE_URL}/diamonds/search?${params}`,
            {
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse<ClientDiamond[]> = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to fetch diamonds");
        }
        return {
            data: result.data,
            pagination: result.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalRecords: result.data.length,
                recordsPerPage: limit,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }

    async getDiamondsByIds(ids: string[]): Promise<ClientDiamond[]> {
        if (!ids || ids.length === 0) return [];
        
        // Fetch diamonds one by one using search endpoint
        const diamonds: ClientDiamond[] = [];
        
        for (const id of ids) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/diamonds/search?searchTerm=${id}`,
                    {
                        credentials: "include",
                    }
                );
                
                if (!response.ok) {
                    console.error(`Failed to fetch diamond with id: ${id}`);
                    continue;
                }
                
                const result: ApiResponse<ClientDiamond[]> = await response.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    // Find the diamond with matching _id
                    const diamond = result.data.find(d => d._id === id);
                    if (diamond) {
                        diamonds.push(diamond);
                    }
                }
            } catch (error) {
                console.error(`Error fetching diamond ${id}:`, error);
            }
        }
        
        return diamonds;
    }

    async getDiamondsByCertificateNumbers(certificateNumbers: string[]): Promise<ClientDiamond[]> {
        if (!certificateNumbers || certificateNumbers.length === 0) return [];
        
        // Fetch diamonds one by one using search endpoint with certificate number
        const diamonds: ClientDiamond[] = [];
        
        for (const certNumber of certificateNumbers) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/diamonds/search?searchTerm=${certNumber}`,
                    {
                        credentials: "include",
                    }
                );
                
                if (!response.ok) {
                    console.error(`Failed to fetch diamond with certificate: ${certNumber}`);
                    continue;
                }
                
                const result: ApiResponse<ClientDiamond[]> = await response.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    // Find the diamond with matching certificate number
                    const diamond = result.data.find(d => d.certificateNumber === certNumber);
                    if (diamond) {
                        diamonds.push(diamond);
                    }
                }
            } catch (error) {
                console.error(`Error fetching diamond with certificate ${certNumber}:`, error);
            }
        }
        
        return diamonds;
    }

    async getFilterOptions(): Promise<FilterOptions> {
        const response = await fetch(
            `${API_BASE_URL}/diamonds/filter-options`,
            {
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse<any> = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to fetch filter options");
        }
        return {
            colors: result.data.colors || [],
            clarities: result.data.clarities || [],
            cuts: result.data.cuts || [],
            polishes: result.data.polishGrades || [],
            symmetries: result.data.symmetryGrades || [],
            fluorescences: result.data.fluorescenceTypes || [],
            shapes: result.data.shapes || [],
            labs: result.data.labs || [],
        };
    }

    async getAllDiamonds(): Promise<ClientDiamond[]> {
        const response = await fetch(`${API_BASE_URL}/diamonds/all`, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse<ClientDiamond[]> = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to fetch diamonds");
        }
        return result.data;
    }

    async addToCart(certificateNumber: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/diamonds/cart/add`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ certificateNumber }),
        });

        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || "Failed to add diamond to cart");
        }

        return {
            success: result.success,
            message: result.message || "Diamond added to cart successfully",
        };
    }

    async addToHold(certificateNumber: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/diamonds/hold/add`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ certificateNumber }),
        });

        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || "Failed to add diamond to hold");
        }

        return {
            success: result.success,
            message: result.message || "Diamond added to hold successfully",
        };
    }

    async getCart(): Promise<CartResponse> {
        const response = await fetch(`${API_BASE_URL}/diamonds/cart`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to fetch cart");
        }

        return result.data;
    }

    async getHoldItems(): Promise<HoldItem[]> {
        const response = await fetch(`${API_BASE_URL}/diamonds/hold`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to fetch hold items");
        }

        return result.data;
    }

    async removeFromCart(certificateNumber: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/diamonds/cart/remove`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ certificateNumber }),
        });

        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || "Failed to remove diamond from cart");
        }

        return {
            success: result.success,
            message: result.message || "Diamond removed from cart successfully",
        };
    }

    async removeFromHold(certificateNumber: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/diamonds/hold/remove`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ certificateNumber }),
        });

        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || "Failed to remove diamond from hold");
        }

        return {
            success: result.success,
            message: result.message || "Diamond removed from hold successfully",
        };
    }
}

export const clientDiamondAPI = new ClientDiamondAPI();
export type { CartItem, CartResponse, HoldItem };