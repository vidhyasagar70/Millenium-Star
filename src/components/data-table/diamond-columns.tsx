"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./diamond-row-actions";
import { DiamondType } from "@/lib/validations/diamond-schema";
import {
    shape_options,
    color_options,
    clarity_options,
    cut_options,
    lab_options,
    flou_options,
    availability_options,
} from "../filters/diamond-filters";
import { clientDiamondAPI } from "@/services/client-api";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { DiamondImage } from "../diamond-image";

export const diamondColumns: ColumnDef<DiamondType>[] = [
    {
        id: "actions",
        cell: ({ row }) => (
            <DataTableRowActions
                row={row}
                onRefresh={() => {
                    window.location.reload();
                }}
            />
        ),
    },
    // Image Column
    // {
    //     accessorKey: "image",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Image" />
    //     ),
    //     cell: ({ row }) => (
    //         <Link href={`/${row.original.certificateNumber}`}>
    //             <DiamondImage certificateNumber={row.original._id} size={60} />
    //         </Link>
    //     ),
    // },
    // Shape Column
    {
        accessorKey: "shape",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Shape" />
        ),
        cell: ({ row }) => {
            const shapeValue = row.original.shape || "-";
            const shape = shape_options.find(
                (shape) => shape.value === shapeValue
            );
            return (
                <div className="flex w-[80px] items-center">
                    {/* {shape?.icon && (
                        <shape.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}
                    <span className="whitespace-pre-wrap">
                        {shapeValue.split(" ")[0]}
                    </span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },

    // Certificate Number Column
    {
        accessorKey: "certificateNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Diamond-Id" />
        ),
        cell: ({ row }) => {
            const certNo =
                (row.original as any)["CERT-NO"] ||
                row.original.certificateNumber ||
                "-";
            return (
                <div className="w-[120px] font-mono text-xs">{`${certNo}`}</div>
            );
        },
        filterFn: (row, id, value) => {
            const certNo =
                (row.original as any)["CERT-NO"] ||
                row.original.certificateNumber ||
                "";
            return certNo.toLowerCase().includes(value.toLowerCase());
        },
    },
    // Size/Carat Column
    {
        accessorKey: "size",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Size" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px] whitespace-pre-wrap">
                {(row.getValue("size") as number) || (0 as number)} ct
            </div>
        ),
    },
    // Color Column
    {
        accessorKey: "color",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Color" />
        ),
        cell: ({ row }) => {
            const colorValue =
                row.original.color || (row.original as any)["color"] || "-";

            const color = color_options.find(
                (color) => color.value === colorValue
            );

            return (
                <div className="flex w-[60px] items-center">
                    <span className="whitespace-pre-wrap">{colorValue}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // Clarity Column
    {
        accessorKey: "clarity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clarity" />
        ),
        cell: ({ row }) => {
            const clarityValue =
                row.original.clarity || (row.original as any)["clarity"] || "-";
            const clarity = clarity_options.find(
                (clarity) => clarity.value === clarityValue
            );
            return (
                <div className="flex w-[80px] items-center">
                    <span className="whitespace-pre-wrap">{clarityValue}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // Cut Column
    {
        accessorKey: "cut",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cut" />
        ),
        cell: ({ row }) => {
            const cutValue =
                row.original.cut || (row.original as any)["cut"] || "-";
            const cut = cut_options.find((cut) => cut.value === cutValue);
            return (
                <div className="flex w-[80px] items-center">
                    <span className="whitespace-pre-wrap">{cutValue}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // Symmetry Column
    {
        accessorKey: "symmetry",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Symmetry" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px] whitespace-pre-wrap">
                {(row.original as any)["sym"] || row.original.symmetry || "-"}
            </div>
        ),
    },
    // Polish Column
    {
        accessorKey: "polish",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Polish" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px] whitespace-pre-wrap">
                {row.original.polish || (row.original as any)["Polish"] || "-"}
            </div>
        ),
    },
    // Fluorescence Intensity Column
    {
        accessorKey: "fluorescenceIntensity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fluo. Intensity" />
        ),
        cell: ({ row }) => {
            const flou = flou_options.find(
                (flou) => flou.value === row.original.fluorescenceIntensity
            );
            return (
                <div className="flex w-[100px] justify-center items-center">
                    <span className="whitespace-pre-wrap">
                        {(row.original as any)["fluorescenceIntensity"] ||
                            row.original.fluorescenceIntensity ||
                            "-"}
                    </span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // Laboratory Column
    {
        accessorKey: "laboratory",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="LAB" />
        ),
        cell: ({ row }) => {
            const labValue =
                row.original.laboratory ||
                (row.original as any)["laboratory"] ||
                "-";

            const lab = lab_options.find((lab) => lab.value === labValue);
            return (
                <div className="flex w-[80px] items-center">
                    {/* {lab?.icon && (
                        <lab.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}
                    <span>{labValue}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // Table Column
    {
        accessorKey: "table",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Table" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px]">
                {row.getValue("table") || row.original.table?.toFixed(2) || "-"}
                %
            </div>
        ),
    },
    // Total Depth Column
    {
        accessorKey: "totalDepth",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Depth" />
        ),
        cell: ({ row }) => {
            // Safe access to nested property
            const tDep =
                row.original.totalDepth || (row.original as any)?.T?.DEP;
            return <div className="w-[80px]">{tDep ? `${tDep}%` : "-"}</div>;
        },
    },
    // RapList Column
    {
        accessorKey: "rapList",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="RapList" />
        ),
        cell: ({ row }) => {
            const rapList = row.original.rapList;
            return (
                <div className="w-[100px] font-semibold">
                    ${rapList ? rapList.toLocaleString() : rapList}
                </div>
            );
        },
    },
    // Discount Column
    {
        accessorKey: "discount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Discount" />
        ),
        cell: ({ row }) => {
            const discount = row.getValue("discount") as number;
            return (
                <div
                    className={`w-[80px] ${
                        discount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {discount < 0 ? discount.toFixed(2) : discount}%
                </div>
            );
        },
    },
    // Price Per Carat Column
    {
        accessorKey: "pricePerCarat",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price/Carat" />
        ),
        cell: ({ row }) => {
            const price = row.original.pricePerCarat;
            return (
                <div className="w-[100px] font-semibold">
                    ${price?.toLocaleString()}
                </div>
            );
        },
    },
    // Price Column
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
            const price = row.original.price;
            return (
                <div className="w-[100px] font-semibold">
                    ${price ? price.toLocaleString() : price}
                </div>
            );
        },
    },
    // Measurements Columns
    {
        accessorKey: "length",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Length" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px]">
                {row.original.measurements?.length || "-"} mm
            </div>
        ),
    },
    // Width Column
    {
        accessorKey: "width",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Width" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px]">
                {row.original.measurements?.width || "-"} mm
            </div>
        ),
    },
    // Depth Column
    {
        accessorKey: "depth",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Depth" />
        ),
        cell: ({ row }) => (
            <div className="w-[80px]">
                {row.original.measurements?.depth || "-"} mm
            </div>
        ),
    },

    // Availability Column
    {
        accessorKey: "isAvailable", // Change from "Availabilty" to "isAvailable"
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Availability" />
        ),
        cell: ({ row }) => {
            const isAvailable = row.getValue("isAvailable") as string;
            return (
                <div className="w-[100px]">
                    <Badge
                        variant={isAvailable === "G" ? "default" : "secondary"}
                        className={
                            isAvailable === "G"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }
                    >
                        {isAvailable === "G"
                            ? "Available"
                            : isAvailable === "S"
                            ? "Sold"
                            : isAvailable === "M"
                            ? "Memo"
                            : "N/A"}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const cellValue = row.getValue(id) as boolean;
            // Handle undefined/null values
            const normalizedValue = cellValue ?? false;
            return value.includes(normalizedValue);
        },
        enableSorting: true, // Enable sorting for this column
    },
    // Virtual Column for Carat Range Filtering
    {
        id: "caratRange",
        // This is a virtual column that doesn't render but handles carat range filtering
        header: () => null,
        cell: () => null,
        enableHiding: true,
        enableSorting: false,
        meta: {
            isVirtual: true, // Mark as virtual column
        },
    },

    // Example columns for newly added fields

    //FancyColor Coloumn
    // {
    //     accessorKey: "fancyColor",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Fancy Color" />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="w-[100px]">{row.original.fancyColor || "-"}</div>
    //     ),
    // },
    //FancyColorOvertone Coloumn
    // {
    //     accessorKey: "fancyColorOvertone",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader
    //             column={column}
    //             title="Fancy Color Overtone"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="w-[120px]">
    //             {row.original.fancyColorOvertone || "-"}
    //         </div>
    //     ),
    // },
    //FancyColorIntensity Coloumn
    // {
    //     accessorKey: "fancyColorIntensity",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader
    //             column={column}
    //             title="Fancy Color Intensity"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="w-[120px]">
    //             {row.original.fancyColorIntensity || "-"}
    //         </div>
    //     ),
    // },
];
