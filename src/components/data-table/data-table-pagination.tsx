import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    pageSizeOptions?: number[];
    paginationMeta?: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null;
}

export function DataTablePagination<TData>({
    table,
    pageSizeOptions = [10, 20, 30, 40, 50, 100],
    paginationMeta,
}: DataTablePaginationProps<TData>) {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;

    // Use server-side pagination data when available
    const currentPage = paginationMeta?.currentPage ?? pageIndex + 1;
    const totalPages = paginationMeta?.totalPages ?? table.getPageCount();
    const totalRecords = paginationMeta?.totalRecords ?? table.getRowCount();
    const hasNextPage = paginationMeta?.hasNextPage ?? table.getCanNextPage();
    const hasPrevPage =
        paginationMeta?.hasPrevPage ?? table.getCanPreviousPage();

    const handleFirstPage = () => {
        console.log("🏠 Going to first page");
        table.setPageIndex(0);
    };

    const handlePreviousPage = () => {
        console.log("⬅️ Going to previous page");
        if (hasPrevPage) {
            table.previousPage();
        }
    };

    const handleNextPage = () => {
        console.log("➡️ Going to next page");
        if (hasNextPage) {
            table.nextPage();
        }
    };

    const handleLastPage = () => {
        console.log("🏁 Going to last page");
        table.setPageIndex(totalPages - 1);
    };

    const handlePageSizeChange = (value: string) => {
        console.log("📏 Changing page size to:", value);
        table.setPageSize(Number(value));
        // Reset to first page when changing page size
        table.setPageIndex(0);
    };

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {pageSize.toLocaleString()} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="h-8 w-auto">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Enhanced page info with server data */}
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, totalRecords)} of{" "}
                        {totalRecords.toLocaleString()} results
                    </div>
                    <div className="flex w-[120px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {totalPages.toLocaleString()}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={handleFirstPage}
                        disabled={!hasPrevPage}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={handlePreviousPage}
                        disabled={!hasPrevPage}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={handleLastPage}
                        disabled={!hasNextPage}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
