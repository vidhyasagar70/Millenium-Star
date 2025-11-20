import { useState, useEffect, useCallback, useRef } from "react";
import { DiamondType } from "@/lib/validations/diamond-schema";

interface TableState {
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    sorting: Array<{
        id: string;
        desc: boolean;
    }>;
    columnFilters: Array<{
        id: string;
        value: any;
    }>;
}

interface UseDiamondsReturn {
    diamonds: DiamondType[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    pageCount: number;
    refetch: () => void;
    updateTable: (state: TableState) => void;
    // Add pagination metadata
    paginationMeta: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null;
}

export function useDiamonds(): UseDiamondsReturn {
    const [diamonds, setDiamonds] = useState<DiamondType[]>([]);
    const [allDiamonds, setAllDiamonds] = useState<DiamondType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    // Table state with default sorting
    const [tableState, setTableState] = useState<TableState>({
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [{ id: "createdAt", desc: true }], // Default sort by createdAt ascending
        columnFilters: [],
    });

    // Use ref to track if this is the initial load
    const isInitialLoad = useRef(true);

    // Add pagination metadata state
    const [paginationMeta, setPaginationMeta] = useState<{
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null>(null);

    const mapColumnToQueryParam = useCallback((columnId: string): string => {
        // Map column IDs to API query parameters
        const mapping: Record<string, string> = {
            "CERT-NO": "searchTerm",
            certificateNumber: "searchTerm",
            "diamond-Id": "searchTerm",
            color: "color",
            clarity: "clarity",
            cut: "cut",
            shape: "shape",
            laboratory: "laboratory",
            fluorescenceColor: "fluorescenceColor",
            fluorescenceIntensity: "fluorescenceIntensity",
            Polish: "polish",
            polish: "polish",
            sym: "symmetry",
            symmetry: "symmetry",
            isAvailable: "isAvailable",
            price: "price",
            size: "size", // Keep this for direct size searches
            caratRange: "caratRange", // Add this for range searches
        };

        return mapping[columnId] || columnId;
    }, []);

    const buildQueryParams = useCallback((state: TableState) => {
        const params = new URLSearchParams();

        // Pagination
        params.append("page", (state.pagination.pageIndex + 1).toString());
        params.append("limit", state.pagination.pageSize.toString());

        // Sorting - always include default if no sorting is specified
        if (state.sorting.length > 0) {
            const sort = state.sorting[0];
            params.append("sortBy", sort.id);
            params.append("sortOrder", sort.desc ? "desc" : "asc");
        } else {
            // Default sorting when no sorting is specified
            params.append("sortBy", "createdAt");
            params.append("sortOrder", "asc");
        }

        // Filters
        state.columnFilters.forEach((filter) => {
            if (filter.value !== undefined && filter.value !== null) {
                // Special handling for carat range - now supports multiple ranges
                if (filter.id === "caratRange") {
                    if (Array.isArray(filter.value)) {
                        // Multiple ranges - add each range as separate parameters
                        filter.value.forEach((range: any) => {
                            if (
                                range.min !== undefined &&
                                range.max !== undefined
                            ) {
                                params.append("sizeMin", range.min.toString());
                                params.append("sizeMax", range.max.toString());
                            }
                        });
                    } else if (
                        typeof filter.value === "object" &&
                        filter.value.min !== undefined &&
                        filter.value.max !== undefined
                    ) {
                        // Legacy single range format
                        params.append("sizeMin", filter.value.min.toString());
                        params.append("sizeMax", filter.value.max.toString());
                    }
                    return;
                }

                if (Array.isArray(filter.value)) {
                    // Handle array filters (like faceted filters)
                    filter.value.forEach((val) => {
                        params.append(
                            mapColumnToQueryParam(filter.id),
                            val.toString()
                        );
                    });
                } else {
                    params.append(
                        mapColumnToQueryParam(filter.id),
                        filter.value.toString()
                    );
                }
            }
        });

        return params;
    }, []);

    const fetchDiamonds = useCallback(
        async (state: TableState) => {
            try {
                setLoading(true);
                setError(null);

                const queryParams = buildQueryParams(state);
                const hasFilters = state.columnFilters.length > 0;
                const endpoint = hasFilters ? "diamonds/search" : "diamonds";

                console.log(`🔍 Fetching diamonds from: ${endpoint}`, {
                    page: state.pagination.pageIndex + 1,
                    limit: state.pagination.pageSize,
                    filters: state.columnFilters.length,
                    sorting: state.sorting.length,
                    timestamp: new Date().toISOString(),
                });

                const response = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/${endpoint}?${queryParams.toString()}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch diamonds");
                }

                setDiamonds(result.data as DiamondType[]);
                setTotalCount(
                    result.count || result.pagination?.totalRecords || 0
                );

                // Set pagination metadata from API response
                if (result.pagination) {
                    setPaginationMeta(result.pagination);
                    setPageCount(result.pagination.totalPages);
                } else {
                    // Fallback for older API responses
                    setPageCount(
                        Math.ceil(
                            (result.count || 0) / state.pagination.pageSize
                        )
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
            } finally {
                setLoading(false);
            }
        },
        [buildQueryParams]
    );

    // Separate function to update table state without immediate fetch
    const updateTable = useCallback((newState: TableState) => {
        console.log("🔄 Updating table state:", newState);
        setTableState(newState);
    }, []);

    const refetch = useCallback(() => {
        fetchDiamonds(tableState);
    }, [fetchDiamonds, tableState]);

    // Effect for initial load only
    useEffect(() => {
        if (isInitialLoad.current) {
            console.log("🚀 Initial load");
            fetchDiamonds(tableState);
            isInitialLoad.current = false;
        }
    }, []); // Empty dependency array for initial load only

    // Effect for table state changes (after initial load)
    useEffect(() => {
        if (!isInitialLoad.current) {
            console.log("📊 Table state changed, fetching data:", tableState);
            fetchDiamonds(tableState);
        }
    }, [tableState, fetchDiamonds]);

    return {
        diamonds,
        loading,
        error,
        totalCount,
        pageCount,
        refetch,
        updateTable,
        paginationMeta, // Add this to the return
    };
}
