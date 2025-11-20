"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Eye } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

// Define types based on your API response
interface Diamond {
    _id: string;
    color: string;
    clarity: string;
    rapList: number;
    pricePerCarat: number;
    discount: number;
    polish: string;
    symmetry?: string;
    fluorescenceColor: string;
    fluorescenceIntensity: string;
    fancyColor: string;
    fancyColorOvertone: string;
    fancyColorIntensity: string;
    laboratory: string;
    shape: string;
    measurements: {
        length: number;
        width: number;
        depth: number;
    };
    totalDepth: number;
    table: number;
    certificateNumber: string;
    size: number;
    noBgm: string;
    fromTab: string;
    isAvailable: string;
    imageUrls: string[];
    videoUrls: string[];
    certificateUrls: string[];
    createdAt: string;
    updatedAt: string;
    price: number;
    rapnetAmount: number;
    cut?: string;
}

interface RapaportGridProps {
    sizeMin: number;
    sizeMax: number;
    shape?: string;
    notShape?: string;
}

// Color and clarity options based on your schema
const COLOR_OPTIONS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITY_OPTIONS = [
    "FL",
    "IF",
    "VVS1",
    "VVS2",
    "VS1",
    "VS2",
    "SI1",
    "SI2",
    "SI3",
];

const RapaportGrid: React.FC<RapaportGridProps> = ({
    sizeMin,
    sizeMax,
    shape,
    notShape,
}) => {
    const [diamonds, setDiamonds] = useState<Diamond[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDiamonds, setSelectedDiamonds] = useState<Diamond[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedClarity, setSelectedClarity] = useState<string>("");

    // Create a matrix to count diamonds by color/clarity
    const diamondMatrix = React.useMemo(() => {
        const matrix: { [key: string]: { [key: string]: Diamond[] } } = {};

        COLOR_OPTIONS.forEach((color) => {
            matrix[color] = {};
            CLARITY_OPTIONS.forEach((clarity) => {
                matrix[color][clarity] = [];
            });
        });

        diamonds.forEach((diamond) => {
            if (
                matrix[diamond.color] &&
                matrix[diamond.color][diamond.clarity]
            ) {
                matrix[diamond.color][diamond.clarity].push(diamond);
            }
        });

        return matrix;
    }, [diamonds]);

    useEffect(() => {
        fetchDiamonds();
    }, [sizeMin, sizeMax, shape]);

    const fetchDiamonds = async () => {
        try {
            setLoading(true);
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            let url = `${baseURL}/diamonds/search?page=1&limit=1000&sizeMin=${sizeMin}&sizeMax=${sizeMax}&sortBy=createdAt&sortOrder=asc`;

            if (shape) {
                url += `&shape=${shape}`;
            }
            if (notShape) {
                url += `&notShape=${notShape}`;
            }

            const response = await fetch(url, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch diamonds");
            }

            const data = await response.json();
            if (data.success) {
                setDiamonds(data.data);
            }
        } catch (error) {
            console.error("Error fetching diamonds:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (color: string, clarity: string) => {
        const cellDiamonds = diamondMatrix[color][clarity];
        if (cellDiamonds.length > 0) {
            setSelectedDiamonds(cellDiamonds);
            setSelectedColor(color);
            setSelectedClarity(clarity);
            setIsModalOpen(true);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: {
            [key: string]: {
                label: string;
                variant: "default" | "secondary" | "outline";
            };
        } = {
            S: { label: "Available", variant: "default" },
            G: { label: "Available", variant: "default" },
            M: { label: "Memo", variant: "secondary" },
            P: { label: "Pending", variant: "outline" },
        };

        const statusInfo = statusMap[status] || {
            label: status,
            variant: "secondary",
        };
        return (
            <Badge variant={statusInfo.variant} className="text-xs">
                {statusInfo.label}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Skeleton className="h-full w-full bg-gray-200" />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header with carat range info */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold">
                    {sizeMin} - {sizeMax} Carat {shape ? `(${shape})` : ""}
                </h3>
                <p className="text-sm text-gray-600">
                    Total Diamonds: {diamonds.length}
                </p>
            </div>

            {/* Grid Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-xs font-medium">
                                Color/Clarity
                            </th>
                            {CLARITY_OPTIONS.map((clarity) => (
                                <th
                                    key={clarity}
                                    className="border border-gray-300 bg-gray-100 p-2 text-xs font-medium"
                                >
                                    {clarity}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {COLOR_OPTIONS.map((color) => (
                            <tr key={color}>
                                <td className="border border-gray-300 bg-gray-50 p-2 text-xs font-medium text-center">
                                    {color}
                                </td>
                                {CLARITY_OPTIONS.map((clarity) => {
                                    const count =
                                        diamondMatrix[color][clarity].length;
                                    const averagePrice =
                                        diamondMatrix[color][clarity].reduce(
                                            (sum, d) => sum + d.price,
                                            0
                                        ) / (count || 1);
                                    return (
                                        <td
                                            key={`${color}-${clarity}`}
                                            className={`border border-gray-300 p-2 text-center text-xs cursor-pointer transition-colors hover:bg-blue-50 ${
                                                count > 0
                                                    ? "bg-white text-blue-600 font-medium"
                                                    : "bg-gray-50 text-gray-400"
                                            }`}
                                            onClick={() =>
                                                handleCellClick(color, clarity)
                                            }
                                        >
                                            {count > 0 ? count : "-"}
                                            <p className="text-[12px] text-gray-500 mt-1">
                                                {count > 0
                                                    ? `$${averagePrice.toFixed(
                                                          2
                                                      )}`
                                                    : ""}
                                            </p>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for displaying diamonds */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="min-w-5xl  max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            Diamond Inventory: Color {selectedColor} - Clarity{" "}
                            {selectedClarity}
                            <span className="text-sm font-normal text-gray-600 ml-2">
                                {selectedDiamonds.length} diamonds
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="h-[60vh] ">
                        {/* Table Header */}
                        <div className="mb-4">
                            <div className="grid grid-cols-9 gap-x-8 p-3 bg-gray-50 rounded-lg font-semibold text-sm text-gray-700 border-b">
                                <div>Stock #</div>
                                <div>Weight</div>
                                <div>Shape</div>
                                <div>Cut</div>
                                <div>Price/Carat</div>
                                <div>Total Price</div>
                                <div>Lab</div>
                                <div>Status</div>
                                <div>Actions</div>
                            </div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-2">
                            {selectedDiamonds.map((diamond) => (
                                <div
                                    key={diamond._id}
                                    className="grid grid-cols-9 gap-x-8 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors items-center"
                                >
                                    {/* Stock # */}
                                    <div className="text-sm font-mono text-blue-600">
                                        {diamond.certificateNumber}
                                    </div>

                                    {/* Weight */}
                                    <div className="text-sm font-medium">
                                        {diamond.size}
                                    </div>

                                    {/* Shape */}
                                    <div className="text-sm">
                                        {diamond.shape}
                                    </div>

                                    {/* Cut */}
                                    <div className="text-sm">
                                        {diamond.cut || diamond.polish || "-"}
                                    </div>

                                    {/* Price/Carat */}
                                    <div className="text-sm font-medium">
                                        {formatPrice(diamond.pricePerCarat)}
                                    </div>

                                    {/* Total Price */}
                                    <div className="text-sm font-bold text-blue-600">
                                        {formatPrice(diamond.price)}
                                    </div>

                                    {/* Lab */}
                                    <div className="text-sm">
                                        {diamond.laboratory}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        {getStatusBadge(diamond.isAvailable)}
                                    </div>

                                    {/* Actions */}
                                    <div>
                                        <Link
                                            href={`/${diamond.certificateNumber}`}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RapaportGrid;
