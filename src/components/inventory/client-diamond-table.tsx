"use client"
import { Badge } from "../ui/badge";
import { ClientPagination } from "./client-pagination";
import { ClientTableColumnHeader } from "./client-table-column-header";
// src/components/client/client-diamond-table.tsx


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientDiamond } from "@/types/client/diamond";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ClientDiamondTableProps {
    diamonds: ClientDiamond[];
    loading: boolean;
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSortChange?: (sorting: { id: string; desc: boolean }[]) => void;
    currentSorting?: { id: string; desc: boolean }[];
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ClientDiamondTable(props: ClientDiamondTableProps) {
    const {
        diamonds,
        loading,
        pagination,
        onPageChange,
        onPageSizeChange,
        onSortChange,
        currentSorting = [],
        selected,
        setSelected,
    } = props;

// Helper function to get shape image path
const getShapeImage = (shapeValue: string) => {
    const shapeMap: { [key: string]: string } = {
        Round: "round.svg",
        Emerald: "emerald.svg",
        Princess: "princess.svg",
        PrincessAlt: "princess.svg",
        Asscher: "asscher.svg",
        Cushion: "cushion.svg",
        "Cushion Modified": "cushion.svg",
        "Cushion Brilliant": "cushion.svg",
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
        "Square Emerald": "sqEmerald.svg",
        Trilliant: "trilliant.svg",
        others: "others.png",
    };
    const fileName = shapeMap[shapeValue];
    return fileName
        ? `/assets/diamondShapes/${fileName}`
        : `/assets/diamondShapes/others.png`;
};

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ClientDiamondTableProps {
    diamonds: ClientDiamond[];
    loading: boolean;
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSortChange?: (sorting: { id: string; desc: boolean }[]) => void;
    currentSorting?: { id: string; desc: boolean }[];
}

// ...existing code...
    const router = useRouter();

    // Checkbox state is now managed by parent
    const allIds = diamonds.map((d) => d._id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));
    // const someSelected = selected.length > 0 && !allSelected;

    const handleSelectAll = () => {
        if (allSelected) {
            setSelected([]);
        } else {
            setSelected(allIds);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (diamonds.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No diamonds found matching your criteria.
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US").format(price);
    };

    return (
        <div className="space-y-4 max-w-[1536px] mx-auto">
            <div className="rounded-lg border border-gray-200 bg-white overflow-scroll">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200">
                            {/* Checkbox Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center w-8">
                                <div className="bg-white rounded p-1 flex justify-center items-center">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all rows"
                                        className="m-2 scale-125"
                                    />
                                </div>
                            </TableHead>
                            {/* <TableHead className="text-xs font-medium text-gray-700 text-left pl-3">
                                <ClientTableColumnHeader
                                    title="Img."
                                    canSort={false}
                                />
                            </TableHead> */}
                            {/* Shape Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Shape"
                                    sortKey="shape"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* CertficateNumber Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Diamond Id."
                                    sortKey="certificateNumber"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Size Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Size (ct.)"
                                    sortKey="size"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Color Header */}
                            <TableHead className="text-xs font-medium  text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Col."
                                    sortKey="color"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Clarity Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Clr."
                                    sortKey="clarity"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Cut Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center  ">
                                <ClientTableColumnHeader
                                    title="Cut"
                                    sortKey="cut"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Symmetry Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Sym."
                                    sortKey="symmetry"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Polish Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Pol."
                                    sortKey="polish"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Fluorescence Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Fluo."
                                    sortKey="fluorescenceIntensity"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Laboratory Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Lab."
                                    sortKey="laboratory"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Table Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Table"
                                    sortKey="table"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Total Depth Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="T. Dep."
                                    sortKey="totalDepth"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* RapList Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Rap List"
                                    sortKey="rapList"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Discount Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Dis."
                                    sortKey="discount"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Price per Carat Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Pr./Ct."
                                    sortKey="pricePerCarat"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Price Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Price"
                                    sortKey="price"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Length Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Len."
                                    sortKey="length"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Width Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Wid."
                                    sortKey="width"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            {/* Total depth Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Dep."
                                    sortKey="depth"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                            <TableHead className="text-sm font-semibold text-gray-700 text-center px-2">
                                Ratio
                            </TableHead>
                            {/* Availability Header */}
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                <ClientTableColumnHeader
                                    title="Avail. "
                                    sortKey="isAvailable"
                                    currentSorting={currentSorting}
                                    onSortChange={onSortChange}
                                />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {diamonds.map((diamond: ClientDiamond) => (
                            <TableRow
                                key={diamond._id}
                                className={`hover:bg-gray-50 text-center odd:bg-white even:bg-gray-100 `}
                            >
                                {/* Checkbox Cell */}
                                <TableCell className="text-center w-8">
                                    <Checkbox
                                        checked={selected.includes(diamond._id)}
                                        onCheckedChange={() => handleSelectRow(diamond._id)}
                                        aria-label={`Select row for ${diamond.certificateNumber}`}
                                        className="m-2 scale-125"
                                    />
                                </TableCell>
                                {/* <TableCell className="text-sm font-mono">
                                    <div className="aspect-square relative w-15 mx-auto m-2 ml-2">
                                        <DiamondImage
                                            className="rounded-xl"
                                            certificateNumber={diamond._id}
                                            size={60}
                                        />
                                        <div
                                            className={`h-2 w-2 rounded-full absolute -top-1 -right-1 ${
                                                diamond.isAvailable == "G"
                                                    ? "bg-green-500"
                                                    : diamond.isAvailable == "S"
                                                    ? "bg-red-500"
                                                    : diamond.isAvailable == "M"
                                                    ? "bg-yellow-500"
                                                    : "bg-gray-500"
                                            }`}
                                        ></div>
                                    </div>
                                </TableCell> */}
                                <TableCell className="text-sm flex gap-1">
                                    <div className="flex items-center justify-center gap-2">
                                        <img
                                            src={getShapeImage(
                                                diamond.shape || "others"
                                            )}
                                            alt={diamond.shape || "Shape"}
                                            className="w-6 h-6 object-contain m-1"
                                            onError={(e) => {
                                                // Fallback to others.png if image fails to load
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    "/assets/diamondShapes/others.png";
                                            }}
                                        />
                                        <span className="text-xs">
                                            {diamond.shape?.split(" ")[0] ||
                                                "-"}
                                        </span>
                                    </div>{" "}
                                </TableCell>
                                <TableCell
                                    className="text-sm font-mono cursor-pointer"
                                    onClick={() =>
                                        router.push(
                                            `/${diamond.certificateNumber}`
                                        )
                                    }
                                >
                                    {diamond.certificateNumber || "-"}
                                </TableCell>
                                <TableCell className="text-sm font-semibold">
                                    {diamond.size || "-"}
                                </TableCell>
                                <TableCell className="text-sm  font-semibold">
                                    {diamond.color || "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {diamond.clarity || "-"}
                                </TableCell>
                                <TableCell className="text-sm ">
                                    {diamond.cut || "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {diamond.symmetry || "-"}
                                </TableCell>

                                <TableCell className="text-sm">
                                    {diamond.polish || "-"}
                                </TableCell>

                                <TableCell className="text-sm">
                                    {diamond.fluorescenceIntensity || "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {diamond.laboratory || "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {diamond.table ? diamond.table : "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {diamond.totalDepth
                                        ? diamond.totalDepth
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-sm font-semibold">
                                    {"$ " + formatPrice(diamond.rapList) || "-"}
                                </TableCell>
                                <TableCell className="text-sm font-semibold">
                                    {formatPrice(diamond.discount) + "%" || "-"}
                                </TableCell>
                                <TableCell className="text-sm font-semibold">
                                    {"$ " +
                                        formatPrice(diamond.pricePerCarat) ||
                                        "-"}
                                </TableCell>
                                <TableCell className="text-sm font-semibold">
                                    {"$ " + formatPrice(diamond.price) || "-"}
                                </TableCell>
                                <TableCell className="text-sm ">
                                    {diamond.measurements?.length
                                        ? diamond.measurements.length
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-sm ">
                                    {diamond.measurements?.width
                                        ? diamond.measurements.width
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-sm ">
                                    {diamond.measurements?.depth
                                        ? diamond.measurements.depth
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-sm mr-2 ">
                                    {diamond.measurements.length &&
                                    diamond.measurements.width
                                        ? (
                                              diamond.measurements.length /
                                              diamond.measurements.width
                                          ).toFixed(2)
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-sm font-semibold py-2">
                                    {diamond.isAvailable ? (
                                        <Badge
                                            className={
                                                diamond.isAvailable == "G"
                                                    ? "bg-green-200 text-black"
                                                    : diamond.isAvailable == "S"
                                                    ? "bg-red-200 text-black"
                                                    : diamond.isAvailable == "M"
                                                    ? "bg-yellow-200 text-black"
                                                    : "bg-gray-200 text-black"
                                            }
                                        >
                                            {diamond.isAvailable == "G"
                                                ? "Available"
                                                : diamond.isAvailable == "S"
                                                ? "Sold"
                                                : diamond.isAvailable == "M"
                                                ? "Out for Memo"
                                                : "N/A"}
                                        </Badge>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <ClientPagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={[10, 20, 30, 50, 100]}
            />
        </div>
    );
}
