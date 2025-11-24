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
    RotateCcw,
    GitCompare,
    Filter,
} from "lucide-react";
import { InventoryGuard } from "@/components/auth/routeGuard";
import { UserStatusHandler } from "@/components/auth/statusGuard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/header";
import Rapaport from "@/components/rapaport/rapaport";
import Container from "@/components/ui/container";

export default function ClientPage() {
    const { user } = useAuth();
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
    const [selected, setSelected] = useState<any[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const handleFiltersChange = (newFilters: ClientFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = async (searchFilters?: ClientFilters) => {
        const filtersToUse = searchFilters || {
            ...filters,
            searchTerm: searchTerm || filters.searchTerm,
        };

        console.log("Searching with filters:", filtersToUse);
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
            delete newFilters.priceMax;
            delete newFilters.priceMin;
        } else if (key === "sizeMax") {
            delete newFilters.sizeMax;
            delete newFilters.sizeMin;
        } else if (key === "discountMax") {
            delete newFilters.discountMax;
            delete newFilters.discountMin;
        } else if (key === "rapListMax") {
            delete newFilters.rapListMax;
            delete newFilters.rapListMin;
        } else if (key === "sizeRanges" && value) {
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
            const arrayFilter = newFilters[key] as string[];
            const updatedArray = arrayFilter.filter((item) => item !== value);
            if (updatedArray.length === 0) {
                delete newFilters[key];
            } else {
                newFilters[key] = updatedArray as any;
            }
        } else {
            delete newFilters[key];
        }

        setFilters(newFilters);
        searchDiamonds(newFilters, 1);
    };

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

    const handleCompare = () => {
        if (selected.length >= 2) {
            const ids = selected.map((d) => d._id || d).join(",");
            router.push(`/compare?ids=${ids}`);
        }
    };

    return (
        <InventoryGuard>
            <UserStatusHandler>
                <div className="bg-white">
                    <Container className="max-w-[1536px] mx-auto">
                        {/* Desktop Layout - Hidden on Mobile */}
                        <div className="hidden lg:flex lg:flex-col">
                            {/* Filter Sidebar */}
                            <ClientFilterSidebar
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                filterOptions={filterOptions}
                                onSearch={handleSearch}
                                onReset={handleReset}
                                loading={loading}
                            />

                            {/* Main Content */}
                            <div className="flex-1 px-6 py-2">
                                {/* Top Controls */}
                                <div className="flex bg-[#F4F4F4] rounded-xl flex-col lg:flex-row justify-start items-start flex-wrap gap-4 lg:items-center lg:justify-between mb-2">
                                    <div className="flex flex-wrap grow items-center justify-between space-x-4">
                                        <Tabs
                                            className="bg-gray-100 rounded-xl"
                                            value={view}
                                            onValueChange={(v) =>
                                                setView(v as "table" | "grid")
                                            }
                                        >
                                            <TabsList className="bg-gray-100 h-12 rounded-xl">
                                                <TabsTrigger
                                                    value="table"
                                                    className="flex items-center rounded-xl space-x-2"
                                                >
                                                    <TableIcon className="w-4 h-4" />
                                                    <span>Table View</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="grid"
                                                    className="flex rounded-xl items-center space-x-2"
                                                >
                                                    <Grid3X3 className="w-4 h-4" />
                                                    <span>Grid View</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    placeholder="Search by Diamond ID"
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(e.target.value)
                                                    }
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" && handleSearch()
                                                    }
                                                    className="w-auto border-gray-300 lg:min-w-100 rounded-full h-10 lg:translate-x-10 z-9"
                                                />
                                                <Button
                                                    onClick={() => {
                                                        handleSearch();
                                                    }}
                                                    disabled={loading}
                                                    className="rounded-full h-10 z-10"
                                                >
                                                    Search
                                                </Button>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleReset()}
                                                className="border border-black rounded-full text-sm px-6"
                                            >
                                                <FunnelX className="w-4 h-4" />
                                                Reset
                                            </Button>
                                            <Button
                                                onClick={handleCompare}
                                                disabled={selected.length < 2}
                                                className="rounded-full h-10 z-10 bg-black text-white px-6 ml-2"
                                            >
                                                Compare
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Applied Filters */}
                                <div className="hidden lg:block">
    <AppliedFilters
        filters={currentFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
    />
</div>


                                {/* Diamond Display */}
                                {view === "table" ? (
                                    <ClientDiamondTable
                                        diamonds={diamonds}
                                        loading={loading}
                                        pagination={pagination}
                                        onPageChange={handlePageChange}
                                        onPageSizeChange={handlePageSizeChange}
                                        onSortChange={handleSortChange}
                                        currentSorting={currentSorting}
                                        selected={selected}
                                        setSelected={setSelected}
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

                        {/* Mobile Layout - Visible only on Mobile */}
  {/* Mobile Layout - Visible only on Mobile */}
{/* Mobile Layout - Visible only on Mobile */}
<div className="lg:hidden flex flex-col h-screen">
    {/* Top Controls - Mobile */}
    <div className="px-2 py-2 bg-gray-100 border-b sticky top-0 z-20">
        <div className="flex items-center gap-1.5 justify-between">
            {/* Left Group - View Tabs */}
            <Tabs
                value={view}
                onValueChange={(v) =>
                    setView(v as "table" | "grid")
                }
            >
                <TabsList className="bg-white h-7 rounded-lg p-0.5">
                    <TabsTrigger
                        value="table"
                        className="rounded-md px-2 h-6"
                    >
                        <TableIcon className="w-3 h-3" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="grid"
                        className="rounded-md px-2 h-6"
                    >
                        <Grid3X3 className="w-3 h-3" />
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Center Group - Search with Button Inside */}
            <div className="flex-1 max-w-md relative">
                <Input
                    placeholder="Diamond ID"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    onKeyPress={(e) =>
                        e.key === "Enter" && handleSearch()
                    }
                    className="w-full bg-white border-gray-300 rounded-full h-7 text-xs pr-16 pl-3"
                />
                <Button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    size="sm"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full h-6 px-3 bg-black text-white text-xs"
                >
                    Search
                </Button>
            </div>

            {/* Right Group - Action Buttons */}
            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    onClick={() => handleReset()}
                    size="sm"
                    className="bg-white border border-gray-300 rounded-full h-7 px-2.5 flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-xs">Reset</span>
                </Button>

                <Button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    size="sm"
                    className={`rounded-full h-7 px-2.5 flex items-center gap-1 ${
                        mobileFiltersOpen 
                            ? "bg-black text-white" 
                            : "bg-white text-black border border-gray-300"
                    }`}
                >
                    
                    <span className="text-xs">Filters</span>
                </Button>
            </div>
        </div>
    </div>

                           

                            {/* Two Column Layout - Mobile */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Left Column - Filter Sidebar (Conditional) */}
                                {mobileFiltersOpen && (
                                    <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
                                        <ClientFilterSidebar
                                            filters={filters}
                                            onFiltersChange={handleFiltersChange}
                                            filterOptions={filterOptions}
                                            onSearch={handleSearch}
                                            onReset={handleReset}
                                            loading={loading}
                                        />
                                    </div>
                                )}

                                {/* Right Column - Diamond Display */}
                                <div className={`${mobileFiltersOpen ? 'w-2/3' : 'w-full'} overflow-y-auto bg-white`}>
                                    <div className="p-2">
                                        {view === "table" ? (
                                            <ClientDiamondTable
                                                diamonds={diamonds}
                                                loading={loading}
                                                pagination={pagination}
                                                onPageChange={handlePageChange}
                                                onPageSizeChange={handlePageSizeChange}
                                                onSortChange={handleSortChange}
                                                currentSorting={currentSorting}
                                                selected={selected}
                                                setSelected={setSelected}
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
                            </div>
                        </div>
                    </Container>
                </div>
            </UserStatusHandler>
        </InventoryGuard>
    );
}