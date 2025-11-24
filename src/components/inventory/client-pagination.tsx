"use client";

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

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ClientPaginationProps {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
}

export function ClientPagination({
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50, 100],
    showPageSizeSelector = true,
}: ClientPaginationProps) {
    const {
        currentPage,
        totalPages,
        totalRecords,
        recordsPerPage,
        hasNextPage,
        hasPrevPage,
    } = pagination;

    const handleFirstPage = () => {
        onPageChange(1);
    };

    const handlePreviousPage = () => {
        if (hasPrevPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            onPageChange(currentPage + 1);
        }
    };

    const handleLastPage = () => {
        onPageChange(totalPages);
    };

    const handlePageSizeChange = (value: string) => {
        if (onPageSizeChange) {
            onPageSizeChange(Number(value));
            // Reset to first page when changing page size
            onPageChange(1);
        }
    };

    const renderPageNumbers = () => {
        const buttons = [];

        // Show first page
        if (currentPage > 3) {
            buttons.push(
                <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(1)}
                    className="w-8 h-8"
                >
                    1
                </Button>
            );

            if (currentPage > 4) {
                buttons.push(
                    <span key="dots1" className="text-sm text-gray-500 px-1 md:px-2">
                        ...
                    </span>
                );
            }
        }

        // Show pages around current page
        for (
            let i = Math.max(1, currentPage - 2);
            i <= Math.min(totalPages, currentPage + 2);
            i++
        ) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(i)}
                    className="w-8 h-8"
                >
                    {i}
                </Button>
            );
        }

        // Show last page
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                buttons.push(
                    <span key="dots2" className="text-sm text-gray-500 px-1 md:px-2">
                        ...
                    </span>
                );
            }

            buttons.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    className="w-8 h-8"
                >
                    {totalPages}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <div className="flex flex-col gap-4 px-2 py-3 md:flex-row md:items-center md:justify-between">
            {/* Records info - hidden on mobile, shown on desktop */}
            <div className="hidden md:block flex-1 text-sm text-muted-foreground">
                Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                {Math.min(currentPage * recordsPerPage, totalRecords)} of{" "}
                {totalRecords.toLocaleString()} diamonds
            </div>

            {/* Main pagination controls */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:space-x-6 lg:space-x-8">
                {/* Page size selector */}
                {showPageSizeSelector && onPageSizeChange && (
                    <div className="flex items-center justify-between md:justify-start md:space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${recordsPerPage}`}
                            onValueChange={handlePageSizeChange}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={recordsPerPage} />
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
                )}

                {/* Page info and navigation */}
                <div className="flex items-center justify-between md:justify-start md:space-x-6">
                    {/* Page indicator */}
                    <div className="text-sm font-medium whitespace-nowrap">
                        Page {currentPage} of {totalPages.toLocaleString()}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center space-x-1">
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

                        {/* Page numbers - hide on small mobile */}
                        <div className="hidden sm:flex items-center space-x-1">
                            {renderPageNumbers()}
                        </div>

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
        </div>
    );
}