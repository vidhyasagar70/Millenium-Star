"use client";

import React, { JSX } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ClientFilters } from "@/types/client/diamond";

interface AppliedFiltersProps {
    filters: ClientFilters;
    onRemoveFilter: (key: keyof ClientFilters, value?: string) => void;
    onClearAll: () => void;
}

export function AppliedFilters({
    filters,
    onRemoveFilter,
    onClearAll,
}: AppliedFiltersProps) {
    const getFilterBadges = () => {
        const badges: JSX.Element[] = [];

        // Helper function to add badges
        const addBadge = (
            label: string,
            key: keyof ClientFilters,
            value?: string
        ) => {
            badges.push(
                <Badge
                    key={`${key}-${value || "single"}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1 bg-black text-white hover:text-white"
                >
                    <span className="text-xs font-medium">{label}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 "
                        onClick={() => onRemoveFilter(key, value)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            );
        };

        // Shape filters
        if (filters.shape && filters.shape.length > 0) {
            filters.shape.forEach((shape) => {
                const shapeLabels: { [key: string]: string } = {
                    RBC: "Round",
                    PRN: "Princess",
                    EMD: "Emerald",
                    ASS: "Asscher",
                    CUS: "Cushion",
                    OVL: "Oval",
                    RAD: "Radiant",
                    PER: "Pear",
                    MQS: "Marquise",
                    HRT: "Heart",
                };
                addBadge(
                    `Shape: ${shapeLabels[shape] || shape}`,
                    "shape",
                    shape
                );
            });
        }

        // Color filters
        if (filters.color && filters.color.length > 0) {
            filters.color.forEach((color) => {
                addBadge(`Color: ${color}`, "color", color);
            });
        }

        // Clarity filters
        if (filters.clarity && filters.clarity.length > 0) {
            filters.clarity.forEach((clarity) => {
                addBadge(`Clarity: ${clarity}`, "clarity", clarity);
            });
        }

        // Cut filters
        if (filters.cut && filters.cut.length > 0) {
            filters.cut.forEach((cut) => {
                const cutLabels: { [key: string]: string } = {
                    EX: "Excellent",
                    VG: "Very Good",
                    G: "Good",
                    F: "Fair",
                    P: "Poor",
                };
                addBadge(`Cut: ${cutLabels[cut] || cut}`, "cut", cut);
            });
        }

        // Polish filters
        if (filters.polish && filters.polish.length > 0) {
            filters.polish.forEach((polish) => {
                const polishLabels: { [key: string]: string } = {
                    EX: "Excellent",
                    VG: "Very Good",
                    G: "Good",
                    F: "Fair",
                    P: "Poor",
                };
                addBadge(
                    `Polish: ${polishLabels[polish] || polish}`,
                    "polish",
                    polish
                );
            });
        }

        // Symmetry filters
        if (filters.symmetry && filters.symmetry.length > 0) {
            filters.symmetry.forEach((symmetry) => {
                const symmetryLabels: { [key: string]: string } = {
                    EX: "Excellent",
                    VG: "Very Good",
                    G: "Good",
                    F: "Fair",
                    P: "Poor",
                };
                addBadge(
                    `Symmetry: ${symmetryLabels[symmetry] || symmetry}`,
                    "symmetry",
                    symmetry
                );
            });
        }

        // Fluorescence filters
        if (
            filters.fluorescenceIntensity &&
            filters.fluorescenceIntensity.length > 0
        ) {
            filters.fluorescenceIntensity.forEach((fluorescence) => {
                addBadge(
                    `Fluorescence: ${fluorescence}`,
                    "fluorescenceIntensity",
                    fluorescence
                );
            });
        }

        // Laboratory filters
        if (filters.laboratory && filters.laboratory.length > 0) {
            filters.laboratory.forEach((lab) => {
                addBadge(`Laboratory: ${lab}`, "laboratory", lab);
            });
        }

        // Price range
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
            const min = filters.priceMin
                ? `$${filters.priceMin.toLocaleString()}`
                : "";
            const max = filters.priceMax
                ? `$${filters.priceMax.toLocaleString()}`
                : "";
            const priceLabel =
                min && max
                    ? `${min} - ${max}`
                    : min
                    ? `From ${min}`
                    : `Up to ${max}`;
            addBadge(`Price: ${priceLabel}`, "priceMin"); // We'll handle both min/max together
        }

        // Carat range
        if (filters.sizeMin !== undefined || filters.sizeMax !== undefined) {
            const min = filters.sizeMin ? `${filters.sizeMin}ct` : "";
            const max = filters.sizeMax ? `${filters.sizeMax}ct` : "";
            const caratLabel =
                min && max
                    ? `${min} - ${max}`
                    : min
                    ? `From ${min}`
                    : `Up to ${max}`;
            addBadge(`Size: ${caratLabel}`, "sizeMin"); // We'll handle both min/max together
        }

        // Multiple carat ranges (sizeRanges)
        if (filters.sizeRanges && filters.sizeRanges.length > 0) {
            filters.sizeRanges.forEach((range, index) => {
                addBadge(
                    `Carat: ${range.min}ct - ${range.max}ct`,
                    "sizeRanges",
                    `${range.min}-${range.max}` // Use a string representation for the value
                );
            });
        }

        // Search term
        if (filters.searchTerm) {
            addBadge(`Search: "${filters.searchTerm}"`, "searchTerm");
        }

        // Availability
        // if (filters.isAvailable !== undefined) {
        //     addBadge(
        //         `${filters.isAvailable ? "Available" : "Not Available"}`,
        //         "isAvailable"
        //     );
        // }

        return badges;
    };

    const filterBadges = getFilterBadges();

    if (filterBadges.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            {filterBadges}
            <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="ml-2 text-xs"
            >
                Clear All
            </Button>
        </div>
    );
}
