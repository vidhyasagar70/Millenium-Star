"use client";

import React, { useState } from "react";
import { ClientFilterSidebar } from "@/components/inventory/client-filter-sidebar";
import { ClientDiamondTable } from "@/components/inventory/client-diamond-table";
import { ClientDiamondGrid } from "@/components/inventory/client-diamond-grid";
import { AppliedFilters } from "@/components/inventory/applied-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientFilters } from "@/types/client/diamond";
import { useClientDiamonds } from "@/hooks/client-table/use-client-diamonds";
import {
    Download,
    FileText,
    FunnelX,
    Grid3X3,
    Table as TableIcon,
} from "lucide-react";
import { InventoryGuard } from "@/components/auth/routeGuard"; // Updated import
import { UserStatusHandler } from "@/components/auth/statusGuard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/header";
import Rapaport from "@/components/rapaport/rapaport";
import Container from "@/components/ui/container";

export default function ClientPage() {
    const { user } = useAuth(); // Get user for conditional rendering
    const router = useRouter();
    const {
        diamonds,
        pagination,
        loading,
        currentSorting,
        handleSortChange,
        handlePageSizeChange,
        filterOptions,
        error,
        searchDiamonds,
        resetFilters,
        currentFilters,
    } = useClientDiamonds();

    const [filters, setFilters] = useState<ClientFilters>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState<"table" | "grid">("table");

    const handleFiltersChange = (newFilters: ClientFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = async (searchFilters?: ClientFilters) => {
        const filtersToUse = searchFilters || {
            ...filters,
            searchTerm: searchTerm || filters.searchTerm,
        };

        console.log("Searching with filters:", filtersToUse); // Add this for debugging
        await searchDiamonds(filtersToUse, 1);
    };

    const handleReset = async () => {
        setFilters({});
        setSearchTerm("");
        await resetFilters();
    };

    const handlePageChange = async (page: number) => {
        await searchDiamonds(currentFilters, page);
    };

    const handleRemoveFilter = (key: keyof ClientFilters, value?: string) => {
        const newFilters = { ...filters };

        if (key === "priceMax") {
            // Remove price max filter and reset min to range minimum
            delete newFilters.priceMax;
            delete newFilters.priceMin;
        } else if (key === "sizeMax") {
            // Remove size max filter and reset min to range minimum
            delete newFilters.sizeMax;
            delete newFilters.sizeMin;
        } else if (key === "discountMax") {
            // Remove discount max filter and reset min to range minimum
            delete newFilters.discountMax;
            delete newFilters.discountMin;
        } else if (key === "rapListMax") {
            // Remove rap list max filter and reset min to range minimum
            delete newFilters.rapListMax;
            delete newFilters.rapListMin;
        } else if (key === "sizeRanges" && value) {
            // Handle removal of individual carat ranges
            const [min, max] = value.split("-").map(Number);
            const currentRanges = newFilters.sizeRanges || [];
            const updatedRanges = currentRanges.filter(
                (range) => !(range.min === min && range.max === max)
            );
            if (updatedRanges.length === 0) {
                delete newFilters.sizeRanges;
            } else {
                newFilters.sizeRanges = updatedRanges;
            }
        } else if (Array.isArray(newFilters[key]) && value) {
            // Remove specific value from array
            const arrayFilter = newFilters[key] as string[];
            const updatedArray = arrayFilter.filter((item) => item !== value);
            if (updatedArray.length === 0) {
                delete newFilters[key];
            } else {
                newFilters[key] = updatedArray as any;
            }
        } else {
            // Remove the entire filter
            delete newFilters[key];
        }

        setFilters(newFilters);

        // Auto-search with updated filters
        searchDiamonds(newFilters, 1);
    };

    // Handle clearing all filters
    const handleClearAllFilters = () => {
        setFilters({});
        setSearchTerm("");
        resetFilters();
    };

    const exportData = () => {
        const csvContent = diamonds
            .map((diamond) => Object.values(diamond).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diamonds.csv";
        a.click();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-600">
                        Error Loading Diamonds
                    </h3>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <Button onClick={resetFilters} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <InventoryGuard>
            <UserStatusHandler>
                <div className=" bg-white">
                    <Container className="max-w-[1536px] mx-auto">
                        <div className="flex-col">
                            {/* Filter Sidebar */}
                            <ClientFilterSidebar
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                filterOptions={filterOptions}
                                onSearch={handleSearch} // Make sure this accepts the filters parameter
                                onReset={handleReset}
                                loading={loading}
                            />

                            {/* Main Content */}
                            <div className="flex-1 px-6 py-2   ">
                                {/* Top Controls */}
                                <div className="flex bg-[#F4F4F4] rounded-xl  flex-col lg:flex-row justify-start items-start flex-wrap gap-4 lg:items-center lg:justify-between mb-2">
                                    <div className="flex flex-wrap grow items-center justify-between space-x-4">
                                        <Tabs
                                            className="bg-gray-100 rounded-xl "
                                            value={view}
                                            onValueChange={(v) =>
                                                setView(v as "table" | "grid")
                                            }
                                        >
                                            <TabsList className="bg-gray-100 h-12 rounded-xl ">
                                                <TabsTrigger
                                                    value="table"
                                                    className="flex items-center rounded-xl  space-x-2"
                                                >
                                                    <TableIcon className="w-4 h-4" />
                                                    <span>Table View</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="grid"
                                                    className="flex rounded-xl  items-center space-x-2"
                                                >
                                                    <Grid3X3 className="w-4 h-4" />
                                                    <span>Grid View</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    placeholder="Search by Diamond ID"
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        handleSearch()
                                                    }
                                                    className="w-auto border-gray-300 lg:min-w-100 rounded-full  h-10 lg:translate-x-10  z-9 "
                                                />
                                                <Button
                                                    onClick={() => {
                                                        handleSearch();
                                                    }}
                                                    disabled={loading}
                                                    className="rounded-full h-10 z-10 "
                                                >
                                                    Search
                                                </Button>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleReset()}
                                                className="border  border-black rounded-full text-sm px-6"
                                            >
                                                <FunnelX className="w-4 h-4" />
                                                Reset
                                            </Button>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-center space-x-2 rounded-xl h-full  mr-1">
                                        <Button
                                            variant="outline"
                                            onClick={exportData}
                                            className="h-full rounded-xl "
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Current View
                                        </Button>
                                    </div> */}
                                </div>

                                {/* Applied Filters */}
                                <AppliedFilters
                                    filters={currentFilters}
                                    onRemoveFilter={handleRemoveFilter}
                                    onClearAll={handleClearAllFilters}
                                />

                                {/* Diamond Display - Conditional based on view */}
                                {view === "table" ? (
                                    <ClientDiamondTable
                                        diamonds={diamonds}
                                        loading={loading}
                                        pagination={pagination}
                                        onPageChange={handlePageChange}
                                        onPageSizeChange={handlePageSizeChange}
                                        onSortChange={handleSortChange}
                                        currentSorting={currentSorting}
                                    />
                                ) : (
                                    <ClientDiamondGrid
                                        diamonds={diamonds}
                                        loading={loading}
                                        pagination={pagination}
                                        onPageChange={handlePageChange}
                                        onPageSizeChange={handlePageSizeChange}
                                    />
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
            </UserStatusHandler>
        </InventoryGuard>
    );
}
