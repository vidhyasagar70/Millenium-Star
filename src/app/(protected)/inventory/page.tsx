"use client";

import React, { useState } from "react";
import { ClientFilterSidebar } from "@/components/inventory/client-filter-sidebar";
import { ClientDiamondTable } from "@/components/inventory/client-diamond-table";
import { ClientDiamondGrid } from "@/components/inventory/client-diamond-grid";
import { AppliedFilters } from "@/components/inventory/applied-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientFilters, ClientDiamond } from "@/types/client/diamond";
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
  ShoppingCart,
  Hand,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clientDiamondAPI } from "@/services/client-api";
import Navbar from "@/components/landing/header";
import Rapaport from "@/components/rapaport/rapaport";
import Container from "@/components/ui/container";
import { LoginModal } from "@/components/landing/loginCard";
import { RegistrationModal } from "@/components/landing/registrationCard";

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
  const [selected, setSelected] = useState<ClientDiamond[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToHold, setIsAddingToHold] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [mobileFilterSearch, setMobileFilterSearch] = useState("");

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenRegistrationFromLogin = () => {
    setIsLoginModalOpen(false);
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

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
  };

  const handleCompare = () => {
    if (!user) {
      toast.error("Please login to compare diamonds");
      router.push("/");
      return;
    }

    if (selected.length >= 2) {
      const ids = selected.map((d) => d._id).join(",");
      router.push(`/compare?ids=${ids}`);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add diamonds to cart");
      router.push("/");
      return;
    }

    if (selected.length === 0) {
      toast.error("Please select at least one diamond");
      return;
    }

    try {
      setIsAddingToCart(true);
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const diamond of selected) {
        try {
          await clientDiamondAPI.addToCart(diamond.certificateNumber);
          successCount++;
        } catch (error: any) {
          failedCount++;
          errors.push(error.message);
        }
      }

      if (successCount > 0 && failedCount === 0) {
        toast.success(`${successCount} diamond(s) added to cart successfully`);
        setSelected([]);
      } else if (successCount > 0 && failedCount > 0) {
        toast.warning(
          `${successCount} diamond(s) added, ${failedCount} failed`
        );
        setSelected([]);
      } else {
        toast.error(errors[0] || "Failed to add diamonds to cart");
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add diamonds to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToHold = async () => {
    if (!user) {
      toast.error("Please login to add diamonds to hold");
      router.push("/");
      return;
    }

    if (selected.length === 0) {
      toast.error("Please select at least one diamond");
      return;
    }

    try {
      setIsAddingToHold(true);
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const diamond of selected) {
        try {
          await clientDiamondAPI.addToHold(diamond.certificateNumber);
          successCount++;
        } catch (error: any) {
          failedCount++;
          errors.push(error.message);
        }
      }

      if (successCount > 0 && failedCount === 0) {
        toast.success(`${successCount} diamond(s) added to hold successfully`);
        setSelected([]);
      } else if (successCount > 0 && failedCount > 0) {
        toast.warning(
          `${successCount} diamond(s) added to hold, ${failedCount} failed`
        );
        setSelected([]);
      } else {
        toast.error(errors[0] || "Failed to add diamonds to hold");
      }
    } catch (error: any) {
      console.error("Error adding to hold:", error);
      toast.error(error.message || "Failed to add diamonds to hold");
    } finally {
      setIsAddingToHold(false);
    }
  };

  const toggleView = () => {
    setView(view === "table" ? "grid" : "table");
  };

  return (
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
                  onValueChange={(v) => setView(v as "table" | "grid")}
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                  {user && (
                    <>
                      <Button
                        onClick={handleAddToCart}
                        disabled={
                          selected.length === 0 || isAddingToCart || loading
                        }
                        variant="outline"
                        className="border border-black rounded-full text-sm px-6 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isAddingToCart ? "Adding..." : "Cart"}
                      </Button>

                      <Button
                        onClick={handleAddToHold}
                        disabled={
                          selected.length === 0 || isAddingToHold || loading
                        }
                        variant="outline"
                        className="border border-black rounded-full text-sm px-6 disabled:opacity-50"
                      >
                        <Hand className="w-4 h-4" />
                        {isAddingToHold ? "Holding..." : "Hold"}
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={handleCompare}
                    disabled={selected.length < 2}
                    variant="outline"
                    className="border border-black rounded-full text-sm px-6"
                  >
                    <GitCompare className="w-4 h-4" />
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
              <div className="w-full overflow-x-auto max-w-full">
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
                  isAuthenticated={!!user}
                  onLoginClick={handleLoginClick}
                />
              </div>
            ) : (
              <ClientDiamondGrid
                diamonds={diamonds}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isAuthenticated={!!user}  
                onLoginClick={handleLoginClick}    
              />
            )}
          </div>
        </div>

        {/* Mobile Layout - Visible only on Mobile */}
        <div className="lg:hidden flex flex-col min-h-screen max-h-screen overflow-hidden">
          {/* Top Controls - Mobile */}
          <div className="px-1.5 py-1.5 bg-gray-100 border-b sticky top-0 z-20 rounded-lg">
            <div className="flex items-center gap-1.5 justify-between">
              {/* View Toggle Button */}
              <Button
                onClick={toggleView}
                size="sm"
                className="bg-white border border-gray-300 text-black rounded-full h-7 w-7 p-0 flex items-center justify-center min-w-0 hover:bg-gray-50 flex-shrink-0"
              >
                {view === "table" ? (
                  <Grid3X3 className="w-3 h-3" />
                ) : (
                  <TableIcon className="w-3 h-3" />
                )}
              </Button>

              {/* Search with Button Inside */}
              <div className="flex-1 min-w-0 relative">
                <Input
                  placeholder="Diamond ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-white border-gray-300 rounded-full h-7 text-[10px] pr-7 pl-2.5 placeholder:text-[10px]"
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={loading}
                  size="sm"
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full h-5.5 w-5.5 p-0 bg-black hover:bg-gray-800 text-white flex items-center justify-center min-w-0"
                >
                  <Search className="h-2.5 w-2.5" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => handleReset()}
                  size="sm"
                  className="bg-white border border-gray-300 rounded-full h-7 w-7 p-0 flex items-center justify-center min-w-0 hover:bg-gray-50"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>

                {user && (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      disabled={selected.length === 0 || isAddingToCart || loading}
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white rounded-full h-7 px-1.5 flex items-center gap-0.5 disabled:opacity-50 min-w-0"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {/* {selected.length > 0 && (
                        <span className="text-[9px] font-medium leading-none">{selected.length}</span>
                      )} */}
                    </Button>

                    <Button
                      onClick={handleAddToHold}
                      disabled={selected.length === 0 || isAddingToHold || loading}
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-900 text-white rounded-full h-7 px-1.5 flex items-center gap-0.5 disabled:opacity-50 min-w-0"
                    >
                      <Hand className="w-3 h-3" />
                      {/* {selected.length > 0 && (
                        <span className="text-[9px] font-medium leading-none">{selected.length}</span>
                      )} */}
                    </Button>
                  </>
                )}

                <Button
                  onClick={handleCompare}
                  disabled={selected.length < 2}
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-900 text-white rounded-full h-7 px-1.5 flex items-center gap-0.5 disabled:opacity-50 min-w-0"
                >
                  <GitCompare className="w-3 h-3" />
                  {/* {selected.length > 0 && (
                    <span className="text-[9px] font-medium leading-none">{selected.length}</span>
                  )} */}
                </Button>

                <Button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  size="sm"
                  className={`rounded-full h-7 w-7 p-0 flex items-center justify-center min-w-0 ${
                    mobileFiltersOpen
                      ? "bg-black hover:bg-gray-800 text-white"
                      : "bg-white hover:bg-gray-50 text-black border border-gray-300"
                  }`}
                >
                  <Filter className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Two Column Layout - Mobile */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Column - Filter Sidebar (Conditional) */}
            {mobileFiltersOpen && (
              <div className="w-3/6 border-r overflow-y-auto bg-gray-50 max-h-full">
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
            <div
              className={`${
                mobileFiltersOpen ? "w-full" : "w-full"
              } flex-1 min-h-0 overflow-y-auto bg-white mt-1`}
            >
              <div className="p-0">
                {view === "table" ? (
                  <div className="w-full overflow-x-auto max-w-full">
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
                      isAuthenticated={!!user}
                      onLoginClick={handleLoginClick}
                    />
                  </div>
                ) : (
                  <ClientDiamondGrid
                    diamonds={diamonds}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    isAuthenticated={!!user}  
                    onLoginClick={handleLoginClick}    
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Login/Registration Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onOpenRegistration={handleOpenRegistrationFromLogin}
      />
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistrationModal}
      />
    </div>
  );
}