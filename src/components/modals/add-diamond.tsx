"use client";

import React, { useState } from "react";
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
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
    shape_options,
    color_options,
    clarity_options,
    cut_options,
    lab_options,
    polish_options,
    symmetry_options,
    fluorescenceIntensity_options,
    availability_options,
    noBgm_options,
    fluorescenceColor_options,
    fancyColor_options,
    fancyColorOvertone_options,
    fancyColorIntensity_options,
} from "../filters/diamond-filters";
import { Textarea } from "../ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "sonner";

interface AddDiamondModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
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
    size?: number; // Legacy field, optional
    isAvailable: string;
    noBgm?: string; // Additional field for comments
    fromTab?: string; // Additional field

    fancyColor: string;
    fancyColorOvertone: string;
    fancyColorIntensity: string;
}

interface CreatedDiamond {
    _id: string;
    certificateNumber: string;
    // Add other properties as needed
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

const TOTAL_STEPS = 4;

export function AddDiamondModal({
    isOpen,
    onClose,
    onSuccess,
}: AddDiamondModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<DiamondFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<
        Partial<Record<keyof DiamondFormData, string>>
    >({});
    const [createdDiamond, setCreatedDiamond] = useState<CreatedDiamond | null>(
        null
    );

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

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof DiamondFormData, string>> = {};

        switch (step) {
            case 1: // Basic Information
                if (!formData.certificateNumber.trim()) {
                    newErrors.certificateNumber =
                        "Certificate number is required";
                }
                if (!formData.lab.trim()) {
                    newErrors.lab = "Lab is required";
                }
                if (!formData.shape.trim()) {
                    newErrors.shape = "Shape is required";
                }
                if (formData.size !== undefined && formData.size <= 0) {
                    newErrors.size = "Carat weight must be greater than 0";
                }
                break;

            case 2: // Quality Assessment
                if (!formData.color) {
                    newErrors.color = "Color is required";
                }
                if (!formData.clarity) {
                    newErrors.clarity = "Clarity is required";
                }
                if (!formData.cut) {
                    newErrors.cut = "Cut is required";
                }
                if (!formData.polish) {
                    newErrors.polish = "Polish is required";
                }
                if (!formData.symmetry) {
                    newErrors.symmetry = "Symmetry is required";
                }
                if (!formData.fluorescenceColor) {
                    newErrors.fluorescenceColor =
                        "Fluorescence color is required";
                }
                if (!formData.fluorescenceIntensity) {
                    newErrors.fluorescenceIntensity =
                        "Fluorescence intensity is required";
                }
                break;

            case 3: // Measurements
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
                    newErrors.totalDepth =
                        "Total depth must be between 0 and 100%";
                }
                if (formData.table <= 0 || formData.table > 100) {
                    newErrors.table = "Table must be between 0 and 100%";
                }
                break;

            case 4: // Pricing & Final Details
                if (formData.rapList < 0) {
                    newErrors.rapList =
                        "Rap list price must be greater than or equal to 0";
                }
                if (formData.discount < -100 || formData.discount > 100) {
                    newErrors.discount =
                        "Discount must be between -100% and 100%";
                }
                if (formData.price < 0) {
                    newErrors.price =
                        "Price must be greater than or equal to 0";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            return;
        }

        setLoading(true);

        try {
            // Transform form data to match API schema exactly
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

            console.log("📤 Sending API data:", apiData);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(apiData),
                }
            );
            const result = await response.json();

            if (!response.ok) {
                if (result?.errors && Array.isArray(result.errors)) {
                    // Display validation errors as toast
                    toast.error("Validation Failed", {
                        description: (
                            <div className="space-y-1 text-black">
                                {result.errors.map(
                                    (error: string, index: number) => (
                                        <div
                                            key={index}
                                            className="text-sm text-black"
                                        >
                                            • {error}
                                        </div>
                                    )
                                )}
                            </div>
                        ),
                        duration: 5000,
                    });

                    // Map backend error messages to form fields for inline display
                    const backendErrors: Partial<
                        Record<keyof DiamondFormData, string>
                    > = {};
                    result.errors.forEach((error: string) => {
                        // Map backend error messages to form fields
                        if (error.includes("Certificate number")) {
                            backendErrors.certificateNumber = error;
                        } else if (error.includes("Color")) {
                            backendErrors.color = error;
                        } else if (error.includes("Clarity")) {
                            backendErrors.clarity = error;
                        } else if (error.includes("Discount")) {
                            backendErrors.discount = error;
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
                            // General error
                            backendErrors.certificateNumber = error;
                        }
                    });
                    setErrors(backendErrors);
                    return;
                }

                // UPDATED: Handle other API errors with toast
                const errorMessage =
                    result?.message || `HTTP error! status: ${response.status}`;
                toast.error("Failed to Create Diamond", {
                    description: errorMessage,
                    duration: 4000,
                });

                throw new Error(errorMessage);
            }

            if (!result.success) {
                // UPDATED: Handle unsuccessful responses
                const errorMessage =
                    result.message || "Failed to create diamond";
                toast.error("Creation Failed", {
                    description: errorMessage,
                    duration: 4000,
                });
                throw new Error(errorMessage);
            }

            console.log("✅ Diamond created successfully:", result);

            // ADDED: Display success toast notification
            toast.success("Diamond Created Successfully! 💎", {
                description: (
                    <div className="space-y-1">
                        <div className="font-medium">
                            Certificate: {result.data.certificateNumber}
                        </div>
                        <div className="text-sm text-black">
                            {result.data.size} carat {result.data.color}{" "}
                            {result.data.clarity} {result.data.shape}
                        </div>
                        <div className="text-sm text-green-600">
                            Ready for file uploads
                        </div>
                    </div>
                ),
                duration: 6000,
            });

            // Set created diamond for file upload step
            setCreatedDiamond({
                _id: result.data._id,
                certificateNumber: formData.certificateNumber.trim(),
            });

            // Call onSuccess to refresh the main table
            onSuccess();
        } catch (error) {
            console.error("❌ Error creating diamond:", error);

            // UPDATED: Only show error toast if not already handled above
            if (
                error instanceof Error &&
                !error.message.includes("HTTP error")
            ) {
                toast.error("Unexpected Error", {
                    description:
                        error.message ||
                        "An unexpected error occurred while creating the diamond",
                    duration: 4000,
                });
            }

            setErrors({
                certificateNumber:
                    error instanceof Error
                        ? error.message
                        : "Failed to create diamond",
            });
        } finally {
            setLoading(false);
        }
    };
    const handleClose = () => {
        if (!loading) {
            setFormData(initialFormData);
            setCurrentStep(1);
            setErrors({});
            setCreatedDiamond(null);
            onClose();
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1:
                return "Basic Information";
            case 2:
                return "Quality Assessment";
            case 3:
                return "Measurements";
            case 4:
                return "Pricing & Final Details";
            default:
                return "";
        }
    };

    const getStepDescription = (step: number) => {
        switch (step) {
            case 1:
                return "Enter the diamond's certificate details and basic properties";
            case 2:
                return "Specify the diamond's quality characteristics";
            case 3:
                return "Provide precise measurements and proportions";
            case 4:
                return "Set pricing information and additional details";
            default:
                return "";
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
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

                            <div className="space-y-2">
                                <Label htmlFor="lab">Lab *</Label>
                                <Select
                                    value={formData.lab}
                                    onValueChange={(value) =>
                                        handleInputChange("lab", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full ${
                                            errors.lab ? "border-red-500" : ""
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

                            <div className="space-y-2">
                                <Label htmlFor="shape">Shape *</Label>
                                <Select
                                    value={formData.shape}
                                    onValueChange={(value) =>
                                        handleInputChange("shape", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full ${
                                            errors.shape ? "border-red-500" : ""
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
                                    className={
                                        errors.size ? "border-red-500" : ""
                                    }
                                />
                                {errors.size && (
                                    <p className="text-sm text-red-500">
                                        {errors.size}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* Fancy Color Fields */}
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

                            <div className="space-y-2">
                                <Label htmlFor="cut">Cut *</Label>
                                <Select
                                    value={formData.cut}
                                    onValueChange={(value) =>
                                        handleInputChange("cut", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full ${
                                            errors.cut ? "border-red-500" : ""
                                        }`}
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
                                        className={`w-full ${
                                            errors.polish
                                                ? "border-red-500"
                                                : ""
                                        }`}
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
                                        className={`w-full ${
                                            errors.symmetry
                                                ? "border-red-500"
                                                : ""
                                        }`}
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
                                        <SelectValue placeholder="Select fluorescence" />
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
                                    Fluorescence *
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
                                        <SelectValue placeholder="Select fluorescence Intensity" />
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
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                );

            case 4:
                return (
                    <div className="space-y-6">
                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">
                                Pricing Information *
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rapList">
                                        Rap List ($) *
                                    </Label>
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
                                            errors.rapList
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.rapList && (
                                        <p className="text-sm text-red-500">
                                            {errors.rapList}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount">
                                        Discount (%) *
                                    </Label>
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
                                            errors.discount
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.discount && (
                                        <p className="text-sm text-red-500">
                                            {errors.discount}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">
                                        Final Price ($) *
                                    </Label>
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

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">
                                Additional Information
                            </Label>

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
                );

            default:
                return null;
        }
    };

    const progress = (currentStep / TOTAL_STEPS) * 100;

    // If diamond is created, show file upload interface
    if (createdDiamond) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl  max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Upload Files for Diamond{" "}
                            {createdDiamond.certificateNumber}
                        </DialogTitle>
                        <DialogDescription>
                            Your diamond has been created successfully! Now you
                            can upload images, videos, and certificates for the
                            diamond.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <FileUploader
                            fileType="images"
                            certificateNumber={createdDiamond._id}
                            onUploadSuccess={() => {
                                // Optional: Add any additional success handling
                            }}
                            maxFiles={1}
                            maxSizePerFile={2}
                        />
                        <FileUploader
                            fileType="videos"
                            certificateNumber={createdDiamond._id}
                            onUploadSuccess={() => {
                                // Optional: Add any additional success handling
                            }}
                            maxFiles={1}
                            maxSizePerFile={2}
                        />
                        <FileUploader
                            fileType="certificates"
                            certificateNumber={createdDiamond._id}
                            onUploadSuccess={() => {
                                // Optional: Add any additional success handling
                            }}
                            maxFiles={1}
                            maxSizePerFile={2}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleClose}
                        >
                            Finish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Original diamond creation form
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl min-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Diamond</DialogTitle>
                    <DialogDescription>
                        {getStepDescription(currentStep)}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>
                            Step {currentStep} of {TOTAL_STEPS}
                        </span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </div>

                {/* Step Title */}
                <div className="border-b pb-2">
                    <h3 className="text-lg font-semibold">
                        {getStepTitle(currentStep)}
                    </h3>
                </div>

                {/* Step Content */}
                <div className="py-4">{renderStep()}</div>

                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={loading}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Previous
                            </Button>
                        )}

                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={loading}
                            >
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {loading
                                    ? "Adding Diamond..."
                                    : "Create Diamond"}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
