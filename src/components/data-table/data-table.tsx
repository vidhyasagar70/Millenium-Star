"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DiamondTableToolbar } from "./diamond-toolbar";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    toolbar?: React.ComponentType<{ table: any }>;
    pageCount?: number;
    loading?: boolean;
    onStateChange?: (state: {
        pagination: { pageIndex: number; pageSize: number };
        sorting: Array<{ id: string; desc: boolean }>;
        columnFilters: Array<{ id: string; value: any }>;
    }) => void;
    // Add pagination metadata
    paginationMeta?: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    toolbar: Toolbar = DiamondTableToolbar,
    pageCount = -1,
    loading = false,
    onStateChange,
    paginationMeta,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const router = useRouter();
    // Notify parent component of state changes immediately when filters change
    React.useEffect(() => {
        if (onStateChange) {
            onStateChange({
                pagination,
                sorting,
                columnFilters,
            });
        }
    }, [pagination, sorting, columnFilters, onStateChange]);

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        // Disable client-side operations for server-side
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        // Keep these for UI features
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="space-y-4">
            <Toolbar table={table} />
            <div className="rounded-md border">
                <Table className="overflow-x-auto">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-gray-200"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: pagination.pageSize }).map(
                                (_, index) => (
                                    <TableRow
                                        key={index}
                                        className="odd:bg-white even:bg-gray-100"
                                    >
                                        {columns.map((_, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                <div className="h-4  rounded animate-pulse" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="odd:bg-white even:bg-gray-100"
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                table={table}
                paginationMeta={paginationMeta} // Pass to pagination
            />
        </div>
    );
}
