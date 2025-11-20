// src/services/client-api.ts
import {
    ClientDiamond,
    ClientFilters,
    FilterOptions,
} from "@/types/client/diamond";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Updated to match API docs

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

class ClientDiamondAPI {
    async searchDiamonds(
        filters: ClientFilters = {},
        page: number = 1,
        limit: number = 20
    ): Promise<SearchResponse> {
        const params = new URLSearchParams();

        // Add pagination parameters
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // Add filter parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                // Special handling for multiple size ranges
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
                    // For other array filters, add each value as a separate parameter
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
                credentials: "include", // Include cookies for authentication
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

        // Map API response to FilterOptions format
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
}

export const clientDiamondAPI = new ClientDiamondAPI();
