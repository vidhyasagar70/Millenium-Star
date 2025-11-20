"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { CaratRangeFilter } from "./carat-range-filter";
import { X, Search } from "lucide-react";
import {
    shape_options,
    color_options,
    clarity_options,
    cut_options,
    lab_options,
    flou_options,
    availability_options,
    fluorescenceIntensity_options,
} from "../filters/diamond-filters";
import { useState, useEffect } from "react";

interface DiamondTableToolbarProps<TData> {
    table: Table<TData>;
}

interface CaratRange {
    label: string;
    min: number;
    max: number;
}

export function DiamondTableToolbar<TData>({
    table,
}: DiamondTableToolbarProps<TData>) {
    const [selectedCaratRanges, setSelectedCaratRanges] = useState<
        CaratRange[]
    >([]);
    const isFiltered = table.getState().columnFilters.length > 0;

    // Check if there's an existing carat range filter
    useEffect(() => {
        const columnFilters = table.getState().columnFilters;
        const caratFilter: any = columnFilters.find(
            (filter) => filter.id === "caratRange"
        );
        console.log("Current column filters:", caratFilter);

        if (caratFilter && caratFilter.value) {
            // Handle both single range (legacy) and multiple ranges
            if (Array.isArray(caratFilter.value)) {
                setSelectedCaratRanges(caratFilter.value);
            } else if (caratFilter.value.min !== undefined) {
                // Legacy single range format
                const { min, max, label } = caratFilter.value;
                setSelectedCaratRanges([{ label, min, max }]);
            }
        } else {
            setSelectedCaratRanges([]);
        }
    }, [table.getState().columnFilters]);

    const handleCaratRangeSelect = (ranges: CaratRange[]) => {
        setSelectedCaratRanges(ranges);

        // Set filter value as array of ranges for the hooks to handle
        table.getColumn("caratRange")?.setFilterValue(ranges);
    };

    const handleCaratRangeClear = () => {
        setSelectedCaratRanges([]);
        table.getColumn("caratRange")?.setFilterValue(undefined);
    };

    return (
        <div className="flex items-center justify-between  overflow-x-scroll">
            <div className="flex flex-1 items-center space-x-2">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by certificate number..."
                        value={
                            (table
                                .getColumn("certificateNumber")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("certificateNumber")
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[200px] pl-8 lg:w-[300px]"
                    />
                </div>

                {/* Carat Range Filter */}
                <CaratRangeFilter
                    onRangeSelect={handleCaratRangeSelect}
                    selectedRanges={selectedCaratRanges}
                    onClear={handleCaratRangeClear}
                />

                {/* Existing Faceted Filters */}
                {table.getColumn("laboratory") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("laboratory")}
                        title="Lab"
                        options={lab_options}
                    />
                )}
                {table.getColumn("shape") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("shape")}
                        title="Shape"
                        options={shape_options}
                    />
                )}
                {table.getColumn("color") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("color")}
                        title="Color"
                        options={color_options}
                    />
                )}
                {table.getColumn("clarity") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("clarity")}
                        title="Clarity"
                        options={clarity_options}
                    />
                )}
                {table.getColumn("cut") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("cut")}
                        title="Cut"
                        options={cut_options}
                    />
                )}
                {table.getColumn("fluorescenceIntensity") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("fluorescenceIntensity")}
                        title="Fluo. Intensity"
                        options={fluorescenceIntensity_options}
                    />
                )}
                {table.getColumn("isAvailable") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("isAvailable")}
                        title="Availability"
                        options={availability_options}
                    />
                )}

                {/* Reset Button */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            setSelectedCaratRanges([]);
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
