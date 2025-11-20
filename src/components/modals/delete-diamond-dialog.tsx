"use client";

import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { DiamondType } from "@/lib/validations/diamond-schema";

interface DeleteDiamondDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    diamond: DiamondType | null;
}

export function DeleteDiamondDialog({
    isOpen,
    onClose,
    onSuccess,
    diamond,
}: DeleteDiamondDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!diamond) return;

        setIsDeleting(true);

        try {
            console.log(`🗑️ Deleting diamond with ID: ${diamond._id}`);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/${diamond._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Failed to delete diamond");
            }

            console.log("✅ Diamond deleted successfully:", result);

            // Close dialog and refresh data
            onSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Error deleting diamond:", error);
            // You might want to show a toast notification here
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete diamond"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Diamond</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this diamond? This
                        action cannot be undone.
                        {diamond && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                <strong>Certificate:</strong>{" "}
                                {diamond.certificateNumber}
                                <br />
                                <strong>Shape:</strong> {diamond.shape}
                                <br />
                                <strong>Color:</strong> {diamond.color}
                                <br />
                                <strong>Clarity:</strong> {diamond.clarity}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
