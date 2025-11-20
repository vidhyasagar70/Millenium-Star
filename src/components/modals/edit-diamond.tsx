"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
    shape_options,
    color_options,
    clarity_options,
    cut_options,
    lab_options,
    fluorescenceColor_options,
    polish_options,
    symmetry_options,
    fluorescenceIntensity_options,
    availability_options, // ADDED: Import availability options
    noBgm_options,
    fancyColor_options,
    fancyColorOvertone_options,
    fancyColorIntensity_options,
} from "../filters/diamond-filters";
import { Textarea } from "../ui/textarea";
import { DiamondType } from "@/lib/validations/diamond-schema";

interface EditDiamondModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    diamond: DiamondType | null;
}

interface DiamondFormData {
    // Required Basic Properties
    certificateNumber: string;
    lab: string;
    shape: string;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescenceColor: string;
    fluorescenceIntensity: string;

    // Required Measurements
    length: number;
    width: number;
    depth: number;
    totalDepth: number;
    table: number;

    // Required Pricing
    rapList: number;
    discount: number;
    price: number;

    // Optional fields
    size?: number;
    isAvailable: string;
    noBgm?: string;
    fromTab?: string;
    // Fancy color fields
    fancyColor: string;
    fancyColorOvertone: string;
    fancyColorIntensity: string;
}

const initialFormData: DiamondFormData = {
    certificateNumber: "",
    lab: "",
    shape: "",
    color: "",
    clarity: "",
    cut: "",
    polish: "",
    symmetry: "",
    fluorescenceColor: "N",
    fluorescenceIntensity: "N",
    length: 0,
    width: 0,
    depth: 0,
    totalDepth: 0,
    table: 0,
    rapList: 0,
    discount: 0,
    price: 0,
    size: undefined,
    isAvailable: "G",
    noBgm: "no",
    fromTab: "",
    fancyColor: "X",
    fancyColorOvertone: "Other",
    fancyColorIntensity: "N",
};

export function EditDiamondModal({
    isOpen,
    onClose,
    onSuccess,
    diamond,
}: EditDiamondModalProps) {
    const [formData, setFormData] = useState<DiamondFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<
        Partial<Record<keyof DiamondFormData, string>>
    >({});

    // Populate form data when diamond changes
    useEffect(() => {
        if (diamond) {
            setFormData({
                certificateNumber: diamond.certificateNumber || "",
                lab: diamond.laboratory || "",
                shape: diamond.shape || "",
                color: diamond.color || "",
                clarity: diamond.clarity || "",
                cut: diamond.cut || "",
                polish: diamond.polish || "",
                symmetry: diamond.symmetry || "",
                fluorescenceColor: diamond.fluorescenceColor || "N",
                fluorescenceIntensity: diamond.fluorescenceIntensity || "N",
                length: diamond.measurements?.length || 0,
                width: diamond.measurements?.width || 0,
                depth: diamond.measurements?.depth || 0,
                totalDepth: diamond.totalDepth || 0,
                table: diamond.table || 0,
                rapList: diamond.rapList || 0,
                discount: diamond.discount || 0,
                price: diamond.price || 0,
                size: diamond.size,
                isAvailable: diamond.isAvailable || "G", // Map to string enum
                noBgm: diamond.noBgm || "no",
                fromTab: diamond.fromTab || "",
                fancyColor: diamond.fancyColor || "X",
                fancyColorOvertone: diamond.fancyColorOvertone || "Other",
                fancyColorIntensity: diamond.fancyColorIntensity || "N",
            });
        }
    }, [diamond]);

    const handleInputChange = (
        field: keyof DiamondFormData,
        value: string | number | boolean
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof DiamondFormData, string>> = {};

        // Required field validations
        if (!formData.certificateNumber.trim()) {
            newErrors.certificateNumber = "Certificate number is required";
        }
        if (!formData.lab.trim()) {
            newErrors.lab = "Lab is required";
        }
        if (!formData.shape.trim()) {
            newErrors.shape = "Shape is required";
        }
        if (!formData.color) {
            newErrors.color = "Color is required";
        }
        if (!formData.clarity) {
            newErrors.clarity = "Clarity is required";
        }
        if (!formData.fluorescenceColor) {
            newErrors.fluorescenceColor = "Fluorescence color is required";
        }
        if (!formData.fluorescenceIntensity) {
            newErrors.fluorescenceIntensity =
                "Fluorescence intensity is required";
        }

        // Measurement validations
        if (formData.length <= 0) {
            newErrors.length = "Length must be greater than 0";
        }
        if (formData.width <= 0) {
            newErrors.width = "Width must be greater than 0";
        }
        if (formData.depth <= 0) {
            newErrors.depth = "Depth must be greater than 0";
        }
        if (formData.totalDepth <= 0 || formData.totalDepth > 100) {
            newErrors.totalDepth = "Total depth must be between 0 and 100%";
        }
        if (formData.table <= 0 || formData.table > 100) {
            newErrors.table = "Table must be between 0 and 100%";
        }

        // Pricing validations
        if (formData.rapList < 0) {
            newErrors.rapList =
                "Rap list price must be greater than or equal to 0";
        }
        if (formData.discount < -100 || formData.discount > 100) {
            newErrors.discount = "Discount must be between -100% and 100%";
        }
        if (formData.price < 0) {
            newErrors.price = "Price must be greater than or equal to 0";
        }

        // Optional size validation
        if (formData.size !== undefined && formData.size < 0) {
            newErrors.size = "Size must be greater than or equal to 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !diamond) {
            return;
        }

        setLoading(true);

        try {
            // Transform form data to match API schema
            const apiData = {
                color: formData.color,
                clarity: formData.clarity,
                rapList: formData.rapList,
                discount: formData.discount,
                cut: formData.cut,
                polish: formData.polish,
                symmetry: formData.symmetry,
                fluorescenceColor: formData.fluorescenceColor,
                fluorescenceIntensity: formData.fluorescenceIntensity,
                lab: formData.lab.trim(),
                shape: formData.shape.trim(),
                measurements: {
                    length: formData.length,
                    width: formData.width,
                    depth: formData.depth,
                },
                totalDepth: formData.totalDepth,
                table: formData.table,
                certificateNumber: formData.certificateNumber.trim(),
                price: formData.price,
                fancyColor: formData.fancyColor,
                fancyColorOvertone: formData.fancyColorOvertone,
                fancyColorIntensity: formData.fancyColorIntensity,
                ...(formData.size !== undefined && { size: formData.size }),
                isAvailable: formData.isAvailable,
                ...(formData.noBgm && { noBgm: formData.noBgm }),
                ...(formData.fromTab && { fromTab: formData.fromTab.trim() }),
            };

            console.log("📤 Updating diamond with data:", apiData);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/${diamond._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(apiData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                // Handle validation errors from backend
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const backendErrors: Partial<
                        Record<keyof DiamondFormData, string>
                    > = {};
                    errorData.errors.forEach((error: string) => {
                        // Map backend error messages to form fields
                        if (error.includes("Certificate number")) {
                            backendErrors.certificateNumber = error;
                        } else if (error.includes("Color")) {
                            backendErrors.color = error;
                        } else if (error.includes("Clarity")) {
                            backendErrors.clarity = error;
                        } else if (error.includes("Lab")) {
                            backendErrors.lab = error;
                        } else if (error.includes("Shape")) {
                            backendErrors.shape = error;
                        } else if (error.includes("Cut")) {
                            backendErrors.cut = error;
                        } else if (error.includes("Polish")) {
                            backendErrors.polish = error;
                        } else if (error.includes("Symmetry")) {
                            backendErrors.symmetry = error;
                        } else if (error.includes("FluorescenceColor")) {
                            backendErrors.fluorescenceColor = error;
                        } else if (error.includes("FluorescenceIntensity")) {
                            backendErrors.fluorescenceIntensity = error;
                        } else if (error.includes("Length")) {
                            backendErrors.length = error;
                        } else if (error.includes("Width")) {
                            backendErrors.width = error;
                        } else if (error.includes("Depth")) {
                            backendErrors.depth = error;
                        } else if (error.includes("Table")) {
                            backendErrors.table = error;
                        } else if (error.includes("Price")) {
                            backendErrors.price = error;
                        } else {
                            backendErrors.certificateNumber = error;
                        }
                    });
                    setErrors(backendErrors);
                    return;
                }

                throw new Error(
                    errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Failed to update diamond");
            }

            console.log("✅ Diamond updated successfully:", result);

            // Close modal and refresh data
            onSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Error updating diamond:", error);
            setErrors({
                certificateNumber:
                    error instanceof Error
                        ? error.message
                        : "Failed to update diamond",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData(initialFormData);
            setErrors({});
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Diamond</DialogTitle>
                    <DialogDescription>
                        Update the diamond details below. Fields marked with *
                        are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">
                            Basic Information
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2 w-full">
                                <Label htmlFor="certificateNumber">
                                    Certificate Number *
                                </Label>
                                <Input
                                    id="certificateNumber"
                                    value={formData.certificateNumber}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "certificateNumber",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter certificate number"
                                    className={
                                        errors.certificateNumber
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.certificateNumber && (
                                    <p className="text-sm text-red-500">
                                        {errors.certificateNumber}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 w-full">
                                <Label htmlFor="lab">Lab *</Label>
                                <Select
                                    value={formData.lab}
                                    onValueChange={(value) =>
                                        handleInputChange("lab", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full${
                                            errors.lab ? " border-red-500" : ""
                                        }`}
                                    >
                                        <SelectValue placeholder="Select lab" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lab_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.lab && (
                                    <p className="text-sm text-red-500">
                                        {errors.lab}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 w-full">
                                <Label htmlFor="shape">Shape *</Label>
                                <Select
                                    value={formData.shape}
                                    onValueChange={(value) =>
                                        handleInputChange("shape", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full${
                                            errors.shape
                                                ? " border-red-500"
                                                : ""
                                        }`}
                                    >
                                        <SelectValue placeholder="Select shape" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shape_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.shape && (
                                    <p className="text-sm text-red-500">
                                        {errors.shape}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">Color *</Label>
                                <Select
                                    value={formData.color}
                                    onValueChange={(value) =>
                                        handleInputChange("color", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full ${
                                            errors.color ? "border-red-500" : ""
                                        }`}
                                    >
                                        <SelectValue placeholder="Select color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {color_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.color && (
                                    <p className="text-sm text-red-500">
                                        {errors.color}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="clarity">Clarity *</Label>
                                <Select
                                    value={formData.clarity}
                                    onValueChange={(value) =>
                                        handleInputChange("clarity", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full ${
                                            errors.clarity
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    >
                                        <SelectValue placeholder="Select clarity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clarity_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.clarity && (
                                    <p className="text-sm text-red-500">
                                        {errors.clarity}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="size">Carat Weight *</Label>
                                <Input
                                    id="size"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.size || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "size",
                                            e.target.value
                                                ? parseFloat(e.target.value)
                                                : 0
                                        )
                                    }
                                    placeholder="0.00"
                                    className={`w-full ${
                                        errors.size ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.size && (
                                    <p className="text-sm text-red-500">
                                        {errors.size}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cut Quality */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">
                            Cut Quality
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cut">Cut *</Label>
                                <Select
                                    value={formData.cut}
                                    onValueChange={(value) =>
                                        handleInputChange("cut", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.cut
                                                ? "border-red-500 w-full"
                                                : "w-full"
                                        }
                                    >
                                        <SelectValue placeholder="Select cut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cut_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.cut && (
                                    <p className="text-sm text-red-500">
                                        {errors.cut}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="polish">Polish *</Label>
                                <Select
                                    value={formData.polish}
                                    onValueChange={(value) =>
                                        handleInputChange("polish", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.polish
                                                ? "border-red-500 w-full"
                                                : "w-full"
                                        }
                                    >
                                        <SelectValue placeholder="Select polish" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {polish_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.polish && (
                                    <p className="text-sm text-red-500">
                                        {errors.polish}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="symmetry">Symmetry *</Label>
                                <Select
                                    value={formData.symmetry}
                                    onValueChange={(value) =>
                                        handleInputChange("symmetry", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.symmetry
                                                ? "border-red-500 w-full"
                                                : "w-full"
                                        }
                                    >
                                        <SelectValue placeholder="Select symmetry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {symmetry_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.symmetry && (
                                    <p className="text-sm text-red-500">
                                        {errors.symmetry}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Fluorescence Section */}
                        <div className="mt-4">
                            <Label className="text-base font-semibold">
                                Fluorescence
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fluorescenceColor">
                                        Fluorescence Color *
                                    </Label>
                                    <Select
                                        value={formData.fluorescenceColor}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                "fluorescenceColor",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={`w-full ${
                                                errors.fluorescenceColor
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        >
                                            <SelectValue placeholder="Select fluorescence color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fluorescenceColor_options.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.fluorescenceColor && (
                                        <p className="text-sm text-red-500">
                                            {errors.fluorescenceColor}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fluorescenceIntensity">
                                        Fluorescence Intensity *
                                    </Label>
                                    <Select
                                        value={formData.fluorescenceIntensity}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                "fluorescenceIntensity",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={`w-full ${
                                                errors.fluorescenceIntensity
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        >
                                            <SelectValue placeholder="Select fluorescence intensity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fluorescenceIntensity_options.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.fluorescenceIntensity && (
                                        <p className="text-sm text-red-500">
                                            {errors.fluorescenceIntensity}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fancy Color Information */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">
                            Fancy Color Information
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fancyColor">Fancy Color</Label>
                                <Select
                                    value={formData.fancyColor}
                                    onValueChange={(value) =>
                                        handleInputChange("fancyColor", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select fancy color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fancyColor_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fancyColorOvertone">
                                    Fancy Color Overtone
                                </Label>
                                <Select
                                    value={formData.fancyColorOvertone}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "fancyColorOvertone",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select fancy color overtone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fancyColorOvertone_options.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fancyColorIntensity">
                                    Fancy Color Intensity
                                </Label>
                                <Select
                                    value={formData.fancyColorIntensity}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "fancyColorIntensity",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select fancy color intensity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fancyColorIntensity_options.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">
                            Measurements *
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="length">Length (mm) *</Label>
                                <Input
                                    id="length"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.length || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "length",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0.00"
                                    className={
                                        errors.length ? "border-red-500" : ""
                                    }
                                />
                                {errors.length && (
                                    <p className="text-sm text-red-500">
                                        {errors.length}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="width">Width (mm) *</Label>
                                <Input
                                    id="width"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.width || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "width",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0.00"
                                    className={
                                        errors.width ? "border-red-500" : ""
                                    }
                                />
                                {errors.width && (
                                    <p className="text-sm text-red-500">
                                        {errors.width}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="depth">Depth (mm) *</Label>
                                <Input
                                    id="depth"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.depth || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "depth",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0.00"
                                    className={
                                        errors.depth ? "border-red-500" : ""
                                    }
                                />
                                {errors.depth && (
                                    <p className="text-sm text-red-500">
                                        {errors.depth}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalDepth">
                                    Total Depth (%) *
                                </Label>
                                <Input
                                    id="totalDepth"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={formData.totalDepth || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "totalDepth",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0.0"
                                    className={
                                        errors.totalDepth
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.totalDepth && (
                                    <p className="text-sm text-red-500">
                                        {errors.totalDepth}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="table">Table (%) *</Label>
                                <Input
                                    id="table"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={formData.table || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "table",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0.0"
                                    className={
                                        errors.table ? "border-red-500" : ""
                                    }
                                />
                                {errors.table && (
                                    <p className="text-sm text-red-500">
                                        {errors.table}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">
                            Pricing *
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rapList">Rap List ($) *</Label>
                                <Input
                                    id="rapList"
                                    type="number"
                                    min="0"
                                    value={formData.rapList || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "rapList",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                    className={
                                        errors.rapList ? "border-red-500" : ""
                                    }
                                />
                                {errors.rapList && (
                                    <p className="text-sm text-red-500">
                                        {errors.rapList}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount (%) *</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    step="0.1"
                                    min="-100"
                                    max="100"
                                    value={formData.discount || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "discount",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0.0"
                                    className={
                                        errors.discount ? "border-red-500" : ""
                                    }
                                />
                                {errors.discount && (
                                    <p className="text-sm text-red-500">
                                        {errors.discount}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Final Price ($) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={formData.price || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "price",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                    className={
                                        errors.price ? "border-red-500" : ""
                                    }
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="isAvailable">
                                    Availability Status
                                </Label>
                                <Select
                                    value={formData.isAvailable}
                                    onValueChange={(value) =>
                                        handleInputChange("isAvailable", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availability_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="noBgm">BGM Status</Label>
                                <Select
                                    value={formData.noBgm}
                                    onValueChange={(value) =>
                                        handleInputChange("noBgm", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select BGM status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {noBgm_options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {/* Additional Fields */}
                    {/* <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="noBgm">
                                    Comments (Optional)
                                </Label>
                                <Textarea
                                    id="noBgm"
                                    value={formData.noBgm}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "noBgm",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Add any additional notes about this diamond..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fromTab">
                                    Source Tab (Optional)
                                </Label>
                                <Input
                                    id="fromTab"
                                    value={formData.fromTab}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "fromTab",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., Inventory, Import, etc."
                                />
                            </div>
                        </div>
                    </div> */}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {loading ? "Updating Diamond..." : "Update Diamond"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
