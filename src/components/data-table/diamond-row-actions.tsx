"use client";

import * as React from "react";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Copy,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    Upload,
} from "lucide-react";
import { diamondSchema, DiamondType } from "@/lib/validations/diamond-schema";
import { EditDiamondModal } from "@/components/modals/edit-diamond";
import { DeleteDiamondDialog } from "@/components/modals/delete-diamond-dialog";
import { AddFilesModal } from "@/components/modals/add-files-modal";

interface DiamondRowActionsProps<TData> {
    row: Row<TData>;
    onRefresh?: () => void; // Add optional refresh callback
}

export function DataTableRowActions<TData>({
    row,
    onRefresh,
}: DiamondRowActionsProps<TData>) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddFilesModalOpen, setIsAddFilesModalOpen] = useState(false);

    // Safe parsing with error handling
    const parseResult = diamondSchema.safeParse(row.original);

    if (!parseResult.success) {
        console.error("Diamond data parsing failed:", parseResult.error);
        console.log("Raw data:", row.original);

        // Fallback: try to access basic properties directly
        const rawData = row.original as any;
        const diamondId = rawData._id || rawData.id || "unknown";

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(diamondId)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    const diamond = parseResult.data;

    const handleEditSuccess = () => {
        console.log("✅ Diamond edit successful, refreshing data...");
        if (onRefresh) {
            onRefresh();
        }
    };

    const handleDeleteSuccess = () => {
        console.log("✅ Diamond delete successful, refreshing data...");
        if (onRefresh) {
            onRefresh();
        }
    };

    const handleAddFilesSuccess = () => {
        console.log("✅ Files added successfully, refreshing data...");
        if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => {
                            const diamond = row.original as DiamondType;
                            const certNo =
                                diamond.certificateNumber ||
                                (diamond as any)["CERT-NO"] ||
                                "No certificate number";
                            navigator.clipboard.writeText(certNo);
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Diamond ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Diamond
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsAddFilesModalOpen(true)}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Add Files
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Diamond
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Modal */}
            <EditDiamondModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                diamond={diamond}
            />

            {/* Add Files Modal */}
            <AddFilesModal
                isOpen={isAddFilesModalOpen}
                onClose={() => setIsAddFilesModalOpen(false)}
                onSuccess={handleAddFilesSuccess}
                diamond={diamond}
            />

            {/* Delete Dialog */}
            <DeleteDiamondDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onSuccess={handleDeleteSuccess}
                diamond={diamond}
            />
        </>
    );
}
