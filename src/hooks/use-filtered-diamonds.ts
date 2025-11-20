import { useState, useEffect, useCallback } from "react";
import { DiamondType } from "@/lib/validations/diamond-schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface FilteredDiamondsReturn {
    diamonds: DiamondType[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    pageCount: number;
    refetch: () => void;
    updateTable: (state: {
        pagination: { pageIndex: number; pageSize: number };
        sorting: Array<{ id: string; desc: boolean }>;
        columnFilters: Array<{ id: string; value: any }>;
    }) => void;
    paginationMeta: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null;
}

export function useFilteredDiamonds(
    baseEndpoint: string
): FilteredDiamondsReturn {
    const [diamonds, setDiamonds] = useState<DiamondType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [paginationMeta, setPaginationMeta] = useState<{
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null>(null);

    // State for table parameters
    const [tableState, setTableState] = useState({
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [] as Array<{ id: string; desc: boolean }>,
        columnFilters: [] as Array<{ id: string; value: any }>,
    });

    const mapColumnToApiParam = (columnId: string): string => {
        const mapping: Record<string, string> = {
            certificateNumber: "searchTerm",
            "diamond-Id": "searchTerm",
            "CERT-NO": "searchTerm",
            color: "color",
            clarity: "clarity",
            cut: "cut",
            shape: "shape",
            laboratory: "laboratory",
            fluorescenceColor: "fluorescenceColor",
            fluorescenceIntensity: "fluorescenceIntensity",
            polish: "polish",
            symmetry: "symmetry",
            isAvailable: "isAvailable",
            price: "price",
            caratRange: "caratRange",
        };

        return mapping[columnId] || columnId;
    };

    const buildApiUrl = useCallback(() => {
        const { pagination, sorting, columnFilters } = tableState;

        // Start with base endpoint
        let url = baseEndpoint;
        const params = new URLSearchParams();

        // Extract base filters from endpoint if they exist
        if (baseEndpoint.includes("?")) {
            const [baseUrl, queryString] = baseEndpoint.split("?");
            url = baseUrl;
            const existingParams = new URLSearchParams(queryString);
            existingParams.forEach((value, key) => {
                params.set(key, value);
            });
        }

        // Add pagination
        params.set("page", (pagination.pageIndex + 1).toString());
        params.set("limit", pagination.pageSize.toString());

        // Add sorting
        if (sorting.length > 0) {
            const sortField = sorting[0].id;
            const sortOrder = sorting[0].desc ? "desc" : "asc";
            params.set("sortBy", sortField);
            params.set("sortOrder", sortOrder);
        }

        // Add filters
        columnFilters.forEach((filter) => {
            if (
                filter.value &&
                (Array.isArray(filter.value) ? filter.value.length > 0 : true)
            ) {
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

                // Map column IDs to API parameters
                const apiParam = mapColumnToApiParam(filter.id);

                // Handle array filters (from faceted filters)
                if (Array.isArray(filter.value)) {
                    filter.value.forEach((val) => {
                        params.append(apiParam, val.toString());
                    });
                } else {
                    params.set(apiParam, filter.value.toString());
                }
            }
        });

        const finalUrl = `${url}?${params.toString()}`;
        console.log(`🔍 Built API URL: ${finalUrl}`);
        return finalUrl;
    }, [baseEndpoint, tableState]);

    const fetchDiamonds = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = buildApiUrl();
            console.log(`🔍 Fetching filtered diamonds from: ${apiUrl}`);

            const response = await fetch(`${API_BASE_URL}/${apiUrl}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to fetch diamonds");
            }

            setDiamonds(result.data as DiamondType[]);
            setTotalCount(result.count || result.pagination?.totalRecords || 0);

            // Set pagination metadata from API response
            if (result.pagination) {
                setPaginationMeta(result.pagination);
                setPageCount(result.pagination.totalPages);
            } else {
                // Fallback for older API responses
                setPageCount(
                    Math.ceil(
                        (result.count || 0) / tableState.pagination.pageSize
                    )
                );
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    }, [buildApiUrl, tableState.pagination.pageSize]);

    const updateTable = useCallback(
        (newState: {
            pagination: { pageIndex: number; pageSize: number };
            sorting: Array<{ id: string; desc: boolean }>;
            columnFilters: Array<{ id: string; value: any }>;
        }) => {
            console.log(
                "🎯 Filtered Diamonds: Table state change requested:",
                newState
            );
            setTableState(newState);
        },
        []
    );

    const refetch = useCallback(() => {
        fetchDiamonds();
    }, [fetchDiamonds]);

    useEffect(() => {
        if (baseEndpoint) {
            fetchDiamonds();
        }
    }, [fetchDiamonds]);

    return {
        diamonds,
        loading,
        error,
        totalCount,
        pageCount,
        refetch,
        updateTable,
        paginationMeta,
    };
}
