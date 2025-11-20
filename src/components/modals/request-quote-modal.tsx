"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface QuotationData {
    carat: number;
    noOfPieces: number;
    quotePrice: string;
    certificateNo?: string;
}

interface RequestQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    diamond?: {
        certificateNumber: string;
        shape: string;
        size: number;
        color: string;
        clarity: string;
        cut: string;
    };
}

export function RequestQuoteModal({
    isOpen,
    onClose,
    diamond,
}: RequestQuoteModalProps) {
    const certificateNo = diamond?.certificateNumber || "";
    const [formData, setFormData] = useState<QuotationData>({
        carat: diamond?.size || 0,
        noOfPieces: 1,
        quotePrice: "0",
        certificateNo: certificateNo,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<
        Partial<Record<keyof QuotationData, string>>
    >({});

    const handleInputChange = (field: keyof QuotationData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof QuotationData, string>> = {};

        if (formData.carat <= 0) {
            newErrors.carat = "Carat must be greater than 0";
        }
        if (formData.noOfPieces <= 0) {
            newErrors.noOfPieces = "Number of pieces must be greater than 0";
        }
        if (formData.quotePrice.trim() === "") {
            newErrors.quotePrice = "Quote price/Inquiry cannot be blank";
        }
        if (formData.certificateNo && formData.certificateNo.trim() === "") {
            newErrors.certificateNo = "Certificate number cannot be blank";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const baseURL =
                process.env.NEXT_PUBLIC_API_BASE_URL ||
                "https://millennium-star-inventory-service-dev.caratlogic.com";

            // API expects an array of quotations
            const quotationArray = [formData];

            const response = await fetch(`${baseURL}/api/quotations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quotationArray),
                credentials: "include", // This is the fix - use cookies instead of Authorization header
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.error || "Failed to submit quotation"
                );
            }

            const result = await response.json();

            toast.success("Your quotation has been submitted successfully!");

            // Reset form
            setFormData({
                carat: diamond?.size || 0,
                noOfPieces: 1,
                quotePrice: "0",
                certificateNo: diamond?.certificateNumber,
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error("Quotation submission error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to submit quotation. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setFormData({
            carat: diamond?.size || 0,
            noOfPieces: 1,
            quotePrice: "0",
            certificateNo: diamond?.certificateNumber,
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request a Quote</DialogTitle>
                    <DialogDescription>
                        {diamond ? (
                            <>
                                Submit a quotation for {diamond.shape} Diamond -{" "}
                                {diamond.certificateNumber}
                            </>
                        ) : (
                            <>
                                Fill in your quotation details below. We'll
                                review and get back to you shortly.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {diamond && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                            Diamond Details:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                                Shape:{" "}
                                <span className="font-medium">
                                    {diamond.shape}
                                </span>
                            </div>
                            <div>
                                Size:{" "}
                                <span className="font-medium">
                                    {diamond.size} ct
                                </span>
                            </div>
                            <div>
                                Color:{" "}
                                <span className="font-medium">
                                    {diamond.color}
                                </span>
                            </div>
                            <div>
                                Clarity:{" "}
                                <span className="font-medium">
                                    {diamond.clarity}
                                </span>
                            </div>
                            <div>
                                Cut:{" "}
                                <span className="font-medium">
                                    {diamond.cut}
                                </span>
                            </div>
                            <div>
                                Certificate:{" "}
                                <span className="font-medium">
                                    {diamond.certificateNumber}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carat" className="text-right">
                                Carat *
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    disabled
                                    id="carat"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.carat || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "carat",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="Enter carat weight"
                                    className={
                                        errors.carat ? "border-red-500" : ""
                                    }
                                />
                                {errors.carat && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.carat}
                                    </p>
                                )}
                            </div>
                        </div> */}

                        {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="noOfPieces" className="text-right">
                                Pieces *
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="noOfPieces"
                                    type="number"
                                    min="1"
                                    value={formData.noOfPieces || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "noOfPieces",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="Number of pieces"
                                    className={
                                        errors.noOfPieces
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.noOfPieces && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.noOfPieces}
                                    </p>
                                )}
                            </div>
                        </div> */}

                        <div className="flex flex-col items-start gap-4">
                            <Label
                                htmlFor="quotePrice"
                                className="text-left w-full"
                            >
                                Quote Price ($) / Inquiry :
                            </Label>
                            <div className="w-full">
                                <Textarea
                                    id="quotePrice"
                                    value={formData.quotePrice || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "quotePrice",
                                            e.target.value || "0"
                                        )
                                    }
                                    placeholder="Quote a price or Inquiry "
                                    className={
                                        errors.quotePrice
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.quotePrice && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.quotePrice}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Quote"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
