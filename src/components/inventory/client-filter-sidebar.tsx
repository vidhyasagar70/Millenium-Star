"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ClientFilters, FilterOptions } from "@/types/client/diamond";
import { Palette, ChevronDown, ChevronUp } from "lucide-react";
import {
    shape_options,
    color_options,
    clarity_options,
    cut_options,
    polish_options,
    symmetry_options,
    fluorescenceIntensity_options,
} from "@/components/filters/diamond-filters";
import Container from "../ui/container";
import ShapeIcon from "../../../public/assets/icons/inventory/shapeIcon";
import CaratIcon from "../../../public/assets/icons/inventory/caratIcon";
import SparkleIcon from "../../../public/assets/icons/inventory/sparkleIcon";

interface ClientFilterSidebarProps {
    filters: ClientFilters;
    onFiltersChange: (filters: ClientFilters) => void;
    filterOptions: FilterOptions;
    onSearch: (filters: ClientFilters) => void;
    onReset: () => void;
    loading?: boolean;
}

export function ClientFilterSidebar({
    filters,
    onFiltersChange,
    onSearch,
    onReset,
    loading = false,
}: ClientFilterSidebarProps) {
    // Mobile filter visibility state
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    // Debounce timer ref
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Updated debounced search function - pass filters directly
    const debouncedSearch = useCallback(
        (filtersToSearch: ClientFilters) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
                onSearch(filtersToSearch);
            }, 500);
        },
        [onSearch]
    );

    const updateFilter = (key: keyof ClientFilters, value: any) => {
        const newFilters = { ...filters, [key]: value };
        onFiltersChange(newFilters);
        debouncedSearch(newFilters);
    };

    const updateArrayFilter = (
        key: keyof ClientFilters,
        value: string,
        checked: boolean
    ) => {
        const currentValues = (filters[key] as string[]) || [];
        const newValues = checked
            ? [...currentValues, value]
            : currentValues.filter((v) => v !== value);

        const newFilters = {
            ...filters,
            [key]: newValues.length > 0 ? newValues : undefined,
        };
        onFiltersChange(newFilters);
        debouncedSearch(newFilters);
    };

    const handleSearch = () => {
        onSearch(filters);
    };

    // Helper function to get SVG image path for shapes
    const getShapeImage = (shapeValue: string) => {
        const shapeMap: { [key: string]: string } = {
            Round: "round.svg",
            Emerald: "emerald.svg",
            Princess: "princess.svg",
            PrincessAlt: "princess.svg",
            Asscher: "asscher.svg",
            Cushion: "cushion.svg",
            CUB: "cushion.svg",
            CUM: "cushion.svg",
            Oval: "oval.svg",
            Heart: "heart.svg",
            Marquise: "marquise.svg",
            Baguette: "baguette.svg",
            "Tapered Baguette": "tapered.svg",
            Radiant: "radiant.svg",
            Pear: "pear.svg",
            Square: "square.svg",
            Trilliant: "trilliant.svg",
            "Square Emerald": "sqEmerald.svg",
            others: "others.png",
        };
        const fileName = shapeMap[shapeValue];
        return fileName ? `/assets/diamondShapes/${fileName}` : null;
    };

    // Helper function to check if a range is selected
    const isRangeSelected = (min: number, max: number) => {
        if (filters.sizeRanges) {
            return filters.sizeRanges.some(
                (range) => range.min === min && range.max === max
            );
        }
        // Fallback for single selection compatibility
        return filters.sizeMin === min && filters.sizeMax === max;
    };

    // Helper function to toggle range selection
    const toggleRangeSelection = (min: number, max: number) => {
        const currentRanges = filters.sizeRanges || [];
        const existingIndex = currentRanges.findIndex(
            (range) => range.min === min && range.max === max
        );

        let newRanges;
        if (existingIndex >= 0) {
            // Remove the range if it exists
            newRanges = currentRanges.filter(
                (_, index) => index !== existingIndex
            );
        } else {
            // Add the range if it doesn't exist
            newRanges = [...currentRanges, { min, max }];
        }

        const newFilters = {
            ...filters,
            sizeRanges: newRanges.length > 0 ? newRanges : undefined,
            // Clear single range values when using multi-select
            sizeMin: undefined,
            sizeMax: undefined,
        };

        onFiltersChange(newFilters);
        debouncedSearch(newFilters);
    };

    return (
        <div className="w-full rounded-lg py-2 mb-1">
            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden mb-4 px-4">
                <Button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="w-full flex items-center justify-between bg-white border border-gray-300 text-black hover:bg-gray-50"
                >
                    <span className="font-medium">
                        {isFilterVisible ? "Hide Filters" : "Show Filters"}
                    </span>
                    {isFilterVisible ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </Button>
            </div>

            {/* Filter Content - Hidden on mobile unless toggled */}
            <div className={`${isFilterVisible ? 'block' : 'hidden'} lg:block`}>
                <Container className="max-w-[1536px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                        {/* Shape Filter */}
                        <div className="flex-1 bg-white rounded-xl pb-1 border-gray-300 border">
                            <Label className="text-sm font-medium bg-[#F4F4F4] rounded-t-lg py-3 px-3 text-black mb-3 flex items-center gap-2">
                                <ShapeIcon className="w-4 h-4" />
                                Shape
                            </Label>
                            <div className="grid grid-cols-4 gap-x-2 gap-y-4 px-2">
                                {shape_options.slice(0, 12).map((shape) => (
                                    <div
                                        key={shape.value}
                                        className="aspect-square"
                                    >
                                        <Checkbox
                                            id={`shape-${shape.value}`}
                                            checked={(filters.shape || []).includes(
                                                shape.value
                                            )}
                                            onCheckedChange={(checked) =>
                                                updateArrayFilter(
                                                    "shape",
                                                    shape.value,
                                                    checked as boolean
                                                )
                                            }
                                            className="sr-only peer"
                                        />
                                        <label
                                            htmlFor={`shape-${shape.value}`}
                                            className={`aspect-square cursor-pointer bg-white justify-center transition-all flex flex-col rounded-md border border-gray-300 items-center hover:border-gray-400 hover:bg-gray-100 peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:text-black peer-data-[state=checked]:border-[#FFE7D0] ${
                                                (filters.shape || []).includes(
                                                    shape.value
                                                )
                                                    ? "bg-gray-200 border-black border-1"
                                                    : ""
                                            }`}
                                        >
                                            <div className="aspect-square flex flex-col justify-center items-center p-2">
                                                {getShapeImage(shape.label) ? (
                                                    <img
                                                        src={
                                                            getShapeImage(
                                                                shape.label
                                                            )!
                                                        }
                                                        alt={shape.label}
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-center">
                                                        {shape.value}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-600 mt-1 text-center">
                                                    {shape.label}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carat Range */}
                        <div className="flex flex-col gap-4 bg-white border-gray-300 border rounded-xl">
                            <div>
                                <Label className="text-sm font-medium text-black mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-2 rounded-t-lg">
                                    <CaratIcon className="w-4 h-4" />
                                    Carat
                                </Label>

                                <div className="flex gap-2 px-1">
                                    <Input
                                        type="number"
                                        placeholder="From"
                                        step="0.01"
                                        value={filters.sizeMin || ""}
                                        onChange={(e) =>
                                            updateFilter(
                                                "sizeMin",
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : undefined
                                            )
                                        }
                                        className="text-xs h-8 bg-white"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="To"
                                        step="0.01"
                                        value={filters.sizeMax || ""}
                                        onChange={(e) =>
                                            updateFilter(
                                                "sizeMax",
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : undefined
                                            )
                                        }
                                        className="text-xs h-8 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Multi-Select Predefined Carat Range Buttons */}
                            <div className="grid grid-cols-3 gap-1 mb-3 px-1">
                                {[
                                    { label: "0.18 - 0.22", min: 0.18, max: 0.22 },
                                    { label: "0.23 - 0.29", min: 0.23, max: 0.29 },
                                    { label: "0.30 - 0.39", min: 0.3, max: 0.39 },
                                    { label: "0.40 - 0.49", min: 0.4, max: 0.49 },
                                    { label: "0.50 - 0.69", min: 0.5, max: 0.69 },
                                    { label: "0.70 - 0.89", min: 0.7, max: 0.89 },
                                    { label: "0.90 - 0.99", min: 0.9, max: 0.99 },
                                    { label: "1.00 - 1.49", min: 1.0, max: 1.49 },
                                    { label: "1.50 - 1.99", min: 1.5, max: 1.99 },
                                    { label: "2.00 - 2.99", min: 2.0, max: 2.99 },
                                    { label: "3.00 - 3.99", min: 3.0, max: 3.99 },
                                    { label: "4.00 - 4.99", min: 4.0, max: 4.99 },
                                    { label: "5.00 - 9.99", min: 5.0, max: 9.99 },
                                    { label: "10.00 +", min: 10.0, max: 10.99 },
                                ].map((range) => {
                                    const isSelected = isRangeSelected(
                                        range.min,
                                        range.max
                                    );
                                    return (
                                        <button
                                            key={range.label}
                                            type="button"
                                            onClick={() =>
                                                toggleRangeSelection(
                                                    range.min,
                                                    range.max
                                                )
                                            }
                                            className={`text-xs rounded-lg px-3 py-2 border cursor-pointer hover:bg-gray-100 hover:border-black transition-colors ${
                                                isSelected
                                                    ? "bg-[#FFF3E7] border-[#FFE7D0] text-black hover:bg-[#FFE7D0] hover:border-[#FFE7D0]"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Color and Clarity */}
                        <div className="border-gray-300 border rounded-xl bg-white flex flex-col justify-start items-start gap-2">
                            <div className="mb-1 w-full">
                                <Label className="text-sm font-medium text-black mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-1 rounded-t-lg">
                                    <Palette className="w-4 h-4" />
                                    Color
                                </Label>
                                <div className="flex flex-wrap gap-x-1 gap-y-3 px-1">
                                    {color_options.map((color) => (
                                        <div key={color.value}>
                                            <Checkbox
                                                id={`color-${color.value}`}
                                                className="sr-only peer"
                                                checked={(
                                                    filters.color || []
                                                ).includes(color.value)}
                                                onCheckedChange={(checked) =>
                                                    updateArrayFilter(
                                                        "color",
                                                        color.value,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`color-${color.value}`}
                                                className="text-xs px-3 py-2 border bg-white border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                            >
                                                {color.value}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Clarity */}
                            <div className="mb-6 w-full">
                                <div>
                                    <Label className="text-sm font-medium text-black mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-2 rounded-t-lg">
                                        <SparkleIcon className="w-4 h-4" />
                                        Clarity
                                    </Label>
                                    <div className="flex flex-wrap gap-x-2 gap-y-3 px-1">
                                        {clarity_options.map((clarity) => (
                                            <div key={clarity.value}>
                                                <Checkbox
                                                    id={`clarity-${clarity.value}`}
                                                    className="sr-only peer"
                                                    checked={(
                                                        filters.clarity || []
                                                    ).includes(clarity.value)}
                                                    onCheckedChange={(checked) =>
                                                        updateArrayFilter(
                                                            "clarity",
                                                            clarity.value,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`clarity-${clarity.value}`}
                                                    className="text-xs px-3 py-2 border bg-white border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                                >
                                                    {clarity.value}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Other Filters */}
                        <div className="border-gray-300 border rounded-xl bg-white flex flex-col justify-start items-start gap-0">
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-2 rounded-t-lg">
                                    Fluorescence Intensity
                                </Label>
                                <div className="flex flex-wrap gap-x-1 gap-y-2 pb-2 px-1">
                                    {fluorescenceIntensity_options.map((fluo) => (
                                        <div key={fluo.value}>
                                            <Checkbox
                                                id={`fluo-${fluo.value}`}
                                                className="sr-only peer"
                                                checked={(
                                                    filters.fluorescenceIntensity ||
                                                    []
                                                ).includes(fluo.value)}
                                                onCheckedChange={(checked) =>
                                                    updateArrayFilter(
                                                        "fluorescenceIntensity",
                                                        fluo.value,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`fluo-${fluo.value}`}
                                                className="text-xs px-2 py-1 border bg-white border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                            >
                                                {fluo.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Cut */}
                            <div className="flex justify-start items-center w-full mt-1">
                                <Label className="text-sm min-w-15 font-medium text-gray-700 mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-4 rounded-r-lg">
                                    Cut :
                                </Label>
                                <div className="flex flex-wrap gap-x-1 pb-2 gap-y-4 px-1">
                                    {cut_options.slice(0, 4).map((cut) => (
                                        <div key={cut.value}>
                                            <Checkbox
                                                id={`cut-${cut.value}`}
                                                className="sr-only peer"
                                                checked={(
                                                    filters.cut || []
                                                ).includes(cut.value)}
                                                onCheckedChange={(checked) =>
                                                    updateArrayFilter(
                                                        "cut",
                                                        cut.value,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`cut-${cut.value}`}
                                                className="text-xs px-2 py-1 border bg-white border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                            >
                                                {cut.value}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Polish */}
                            <div className="flex justify-start items-center w-full">
                                <Label className="text-sm min-w-15 font-medium text-gray-700 mb-2 bg-[#F4F4F4] flex justify-between items-center gap-2 py-3 px-4 rounded-r-lg">
                                    Pol. :
                                </Label>
                                <div className="flex flex-wrap gap-x-1 gap-y-4 pb-2 px-1">
                                    {polish_options.slice(0, 4).map((polish) => (
                                        <div key={polish.value}>
                                            <Checkbox
                                                id={`polish-${polish.value}`}
                                                className="sr-only peer"
                                                checked={(
                                                    filters.polish || []
                                                ).includes(polish.value)}
                                                onCheckedChange={(checked) =>
                                                    updateArrayFilter(
                                                        "polish",
                                                        polish.value,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`polish-${polish.value}`}
                                                className="text-xs px-2 py-1 border bg-white border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                            >
                                                {polish.value}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Symmetry */}
                            <div className="flex justify-start items-center w-full">
                                <Label className="text-sm min-w-15 font-medium text-gray-700 mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-3.5 rounded-r-lg">
                                    Sym. :
                                </Label>
                                <div className="flex flex-wrap gap-x-1 gap-y-4 px-1 pb-2">
                                    {symmetry_options
                                        .slice(0, 4)
                                        .map((symmetry) => (
                                            <div key={symmetry.value}>
                                                <Checkbox
                                                    id={`symmetry-${symmetry.value}`}
                                                    className="sr-only peer"
                                                    checked={(
                                                        filters.symmetry || []
                                                    ).includes(symmetry.value)}
                                                    onCheckedChange={(checked) =>
                                                        updateArrayFilter(
                                                            "symmetry",
                                                            symmetry.value,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`symmetry-${symmetry.value}`}
                                                    className="text-xs px-2 py-1 border bg-white border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                                >
                                                    {symmetry.value}
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Laboratory */}
                            <div className="flex justify-start items-center w-full">
                                <Label className="text-sm min-w-15 font-medium text-gray-700 mb-2 bg-[#F4F4F4] flex items-center gap-2 py-3 px-4 rounded-r-lg">
                                    Lab. :
                                </Label>
                                <div className="flex flex-wrap gap-x-1 gap-y-4 px-1 pb-2">
                                    {[
                                        { value: "GIA", label: "GIA" },
                                        { value: "HRD", label: "HRD" },
                                        { value: "IGI", label: "IGI" },
                                        { value: "None", label: "Other" },
                                    ].map((lab) => (
                                        <div key={lab.value}>
                                            <Checkbox
                                                id={`lab-${lab.value}`}
                                                className="sr-only peer"
                                                checked={(
                                                    filters.laboratory || []
                                                ).includes(lab.value)}
                                                onCheckedChange={(checked) =>
                                                    updateArrayFilter(
                                                        "laboratory",
                                                        lab.value,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`lab-${lab.value}`}
                                                className="text-xs px-2 py-1 border bg-white border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-black transition-colors peer-data-[state=checked]:bg-[#FFF3E7] peer-data-[state=checked]:border-[#FFE7D0]"
                                            >
                                                {lab.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}