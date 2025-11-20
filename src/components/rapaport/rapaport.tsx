import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RapaportGrid from "./rapaport-grid";

// Predefined carat ranges commonly used in the industry
const CARAT_RANGES = [
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
    { label: "3.00 - 4.99", min: 3.0, max: 4.99 },
    { label: "5.00+", min: 5.0, max: 50.0 },
];

const Rapaport = () => {
    const [selectedCaratRange, setSelectedCaratRange] = useState(
        CARAT_RANGES[0]
    );

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-semibold">Rapaport View</h1>
                    <p className="text-gray-600 mt-1">
                        Professional diamond inventory organized by carat ranges
                        and shapes. Numbers represent available stock for each
                        Color/Clarity combination.
                    </p>
                </div>

                {/* Carat Range Selector */}
                {/* <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Carat Range
                    </label>
                    <Select
                        value={`${selectedCaratRange.min}-${selectedCaratRange.max}`}
                        onValueChange={(value) => {
                            const [min, max] = value.split("-").map(Number);
                            const range = CARAT_RANGES.find(
                                (r) => r.min === min && r.max === max
                            );
                            if (range) setSelectedCaratRange(range);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select carat range" />
                        </SelectTrigger>
                        <SelectContent>
                            {CARAT_RANGES.map((range) => (
                                <SelectItem
                                    key={`${range.min}-${range.max}`}
                                    value={`${range.min}-${range.max}`}
                                >
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div> */}
            </div>

            <div className="mt-6">
                <Tabs defaultValue="round" className="w-full">
                    <TabsList className="w-full rounded-md bg-neutral-200">
                        <TabsTrigger value="round">Round</TabsTrigger>
                        <TabsTrigger value="other">Other Shapes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="round" className="mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-5">
                            {CARAT_RANGES.map((range) => (
                                <RapaportGrid
                                    key={range.label}
                                    sizeMin={range.min}
                                    sizeMax={range.max}
                                    shape="Round"
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="other" className="mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {CARAT_RANGES.map((range) => (
                                <RapaportGrid
                                    key={range.label}
                                    sizeMin={range.min}
                                    sizeMax={range.max}
                                    notShape="Round"
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Rapaport;
