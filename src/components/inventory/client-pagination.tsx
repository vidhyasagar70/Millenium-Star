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
    recordLabel?: string; // Add custom label prop
}

export function ClientPagination({
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50, 100],
    showPageSizeSelector = true,
    recordLabel = "diamonds", // Default to "diamonds"
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
        const maxVisible = 5; // Show max 5 page numbers

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className={`w-9 h-9 ${
                            currentPage === i
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    >
                        {i}
                    </Button>
                );
            }
        } else {
            // Always show first page
            buttons.push(
                <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(1)}
                    className={`w-9 h-9 ${
                        currentPage === 1
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white hover:bg-gray-50"
                    }`}
                >
                    1
                </Button>
            );

            // Show dots or page 2
            if (currentPage > 3) {
                buttons.push(
                    <Button
                        key={2}
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(2)}
                        className="w-9 h-9 bg-white hover:bg-gray-50"
                    >
                        2
                    </Button>
                );
                buttons.push(
                    <span key="dots1" className="text-sm text-gray-400 px-1">
                        ...
                    </span>
                );
            } else if (currentPage === 3) {
                buttons.push(
                    <Button
                        key={2}
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(2)}
                        className="w-9 h-9 bg-white hover:bg-gray-50"
                    >
                        2
                    </Button>
                );
            }

            // Show current page and adjacent pages
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    buttons.push(
                        <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(i)}
                            className={`w-9 h-9 ${
                                currentPage === i
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            {i}
                        </Button>
                    );
                }
            }

            // Show dots before last page
            if (currentPage < totalPages - 2) {
                buttons.push(
                    <span key="dots2" className="text-sm text-gray-400 px-1">
                        ...
                    </span>
                );
            }

            // Always show last page
            buttons.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    className={`w-9 h-9 ${
                        currentPage === totalPages
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white hover:bg-gray-50"
                    }`}
                >
                    {totalPages}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <div className="flex flex-col gap-4 px-2 py-4">
            {/* Desktop View */}
            <div className="hidden md:flex md:items-center md:justify-between">
                {/* Records info */}
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                    {Math.min(currentPage * recordsPerPage, totalRecords)} of{" "}
                    {totalRecords.toLocaleString()} {recordLabel}
                </div>

                {/* Page size selector */}
                {showPageSizeSelector && onPageSizeChange && (
                    <div className="flex items-center space-x-2 mr-6">
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

                {/* Navigation */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={handlePreviousPage}
                        disabled={!hasPrevPage}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                        {renderPageNumbers()}
                    </div>

                    <Button
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile View - Centered Pagination */}
            <div className="md:hidden flex flex-col gap-3">
                {/* Page size selector on mobile */}
                {showPageSizeSelector && onPageSizeChange && (
                    <div className="flex items-center justify-between">
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

                {/* Centered navigation with page numbers */}
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={handlePreviousPage}
                        disabled={!hasPrevPage}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                        {renderPageNumbers()}
                    </div>

                    <Button
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}