import { useState, useEffect } from "react";
import {
    ClientDiamond,
    ClientFilters,
    FilterOptions,
} from "@/types/client/diamond";
import { clientDiamondAPI } from "@/services/client-api";

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface UseClientDiamondsReturn {
    diamonds: ClientDiamond[];
    filterOptions: FilterOptions;
    pagination: PaginationData;
    loading: boolean;
    error: string | null;
    searchDiamonds: (filters: ClientFilters, page?: number) => Promise<void>;
    resetFilters: () => Promise<void>;
    currentFilters: ClientFilters;
    currentSorting: { id: string; desc: boolean }[];
    handleSortChange: (
        sorting: { id: string; desc: boolean }[]
    ) => Promise<void>;
    handlePageSizeChange: (pageSize: number) => Promise<void>;
}

export function useClientDiamonds(): UseClientDiamondsReturn {
    const [diamonds, setDiamonds] = useState<ClientDiamond[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        colors: [],
        clarities: [],
        cuts: [],
        polishes: [],
        symmetries: [],
        fluorescences: [],
        shapes: [],
        labs: [],
    });
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        recordsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [currentFilters, setCurrentFilters] = useState<ClientFilters>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSorting, setCurrentSorting] = useState<
        { id: string; desc: boolean }[]
    >([{ id: "createdAt", desc: false }]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Add default sorting parameters
            const defaultFilters: ClientFilters = {
                sortBy: "createdAt",
                sortOrder: "asc",
                isAvailable: ["G", "M"],
            };

            const [diamondsResponse, filterOptionsData] = await Promise.all([
                clientDiamondAPI.searchDiamonds(
                    defaultFilters,
                    1,
                    pagination.recordsPerPage
                ),
                clientDiamondAPI.getFilterOptions(),
            ]);

            setDiamonds(diamondsResponse.data);
            setPagination(diamondsResponse.pagination);
            setFilterOptions(filterOptionsData);
            setCurrentFilters(defaultFilters);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    const searchDiamonds = async (
        filters: ClientFilters,
        page: number = 1,
        sortingOverride?: { id: string; desc: boolean }[],
        pageSize?: number
    ) => {
        try {
            setLoading(true);
            setError(null);
            const isAvailable = ["G", "M"];

            // Use override sorting if provided, otherwise use current state
            const sorting = sortingOverride || currentSorting;
            const currentPageSize = pageSize || pagination.recordsPerPage;

            // Convert sorting state to API format
            const sortBy = sorting.length > 0 ? sorting[0].id : "createdAt";
            const sortOrder =
                sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "asc";

            // Ensure default sorting is always applied if not specified
            const filtersWithDefaults = {
                ...filters,
                isAvailable,
                sortBy,
                sortOrder,
            };

            console.log("Filters with defaults:", filtersWithDefaults);

            const response = await clientDiamondAPI.searchDiamonds(
                filtersWithDefaults,
                page,
                currentPageSize
            );

            setDiamonds(response.data);
            setPagination(response.pagination);
            setCurrentFilters(filtersWithDefaults);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = async (
        sorting: { id: string; desc: boolean }[]
    ) => {
        setCurrentSorting(sorting);
        // Pass the new sorting directly to searchDiamonds
        await searchDiamonds(currentFilters, 1, sorting);
    };

    const handlePageSizeChange = async (newPageSize: number) => {
        await searchDiamonds(currentFilters, 1, currentSorting, newPageSize);
    };

    const resetFilters = async () => {
        await loadInitialData();
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    return {
        diamonds,
        filterOptions,
        pagination,
        loading,
        error,
        searchDiamonds,
        resetFilters,
        currentFilters,
        currentSorting,
        handleSortChange,
        handlePageSizeChange,
    };
}
