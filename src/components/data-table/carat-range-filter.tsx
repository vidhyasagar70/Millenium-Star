"use client";

import { Gem } from "lucide-react";
import {
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectItem,
} from "@/components/ui/multi-select";

interface CaratRange {
    label: string;
    min: number;
    max: number;
}

const CARAT_RANGES: CaratRange[] = [
    { label: "0.30 - 0.39", min: 0.3, max: 0.39 },
    { label: "0.40 - 0.49", min: 0.4, max: 0.49 },
    { label: "0.50 - 0.69", min: 0.5, max: 0.69 },
    { label: "0.70 - 0.89", min: 0.7, max: 0.89 },
    { label: "0.90 - 0.99", min: 0.9, max: 0.99 },
    { label: "1.00 - 1.49", min: 1.0, max: 1.49 },
    { label: "1.50 - 1.99", min: 1.5, max: 1.99 },
    { label: "2.00 - 2.99", min: 2.0, max: 2.99 },
    { label: "3.00 - 4.99", min: 3.0, max: 4.99 },
    { label: "5.00+", min: 5.0, max: 999 },
];

interface CaratRangeFilterProps {
    onRangeSelect: (ranges: CaratRange[]) => void;
    selectedRanges?: CaratRange[];
    onClear: () => void;
}

export function CaratRangeFilter({
    onRangeSelect,
    selectedRanges = [],
    onClear,
}: CaratRangeFilterProps) {
    // Convert CaratRange objects to string values for MultiSelect
    const selectedValues = selectedRanges.map((range) => range.label);

    const handleValuesChange = (values: string[]) => {
        if (values.length === 0) {
            onClear();
            return;
        }

        // Convert selected string values back to CaratRange objects
        const selectedCaratRanges = values
            .map((value) => CARAT_RANGES.find((range) => range.label === value))
            .filter((range): range is CaratRange => range !== undefined);

        onRangeSelect(selectedCaratRanges);
    };

    return (
        <MultiSelect
            values={selectedValues}
            onValuesChange={handleValuesChange}
        >
            <MultiSelectTrigger className="h-8 border-dashed">
                <Gem className="mr-2 h-4 w-4" />
                <MultiSelectValue
                    placeholder="Carat Range"
                    clickToRemove={true}
                    overflowBehavior="cutoff"
                />
            </MultiSelectTrigger>
            <MultiSelectContent
                search={{
                    placeholder: "Search carat ranges...",
                    emptyMessage: "No carat range found.",
                }}
            >
                {CARAT_RANGES.map((range) => (
                    <MultiSelectItem key={range.label} value={range.label}>
                        {range.label}
                    </MultiSelectItem>
                ))}
            </MultiSelectContent>
        </MultiSelect>
    );
}
