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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { emailService, EmailExportRequest } from "@/services/email-service";

interface EmailExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Add these new props
    activeTab?: string;
    currentFilters?: any;
    currentSorting?: Array<{ id: string; desc: boolean }>;
}

export function EmailExportModal({
    isOpen,
    onClose,
    activeTab = "all",
    currentFilters = {},
    currentSorting = [],
}: EmailExportModalProps) {
    const [emails, setEmails] = useState("");
    const [category, setCategory] = useState<
        "fancy" | "high" | "low" | "current"
    >("fancy");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        emails: "",
        category: "",
    });

    const validateForm = () => {
        const newErrors = { emails: "", category: "" };

        // Validate emails
        if (!emails.trim()) {
            newErrors.emails = "Please enter at least one email address";
        } else {
            const emailArray = emailService.parseEmailString(emails);
            const validation = emailService.validateEmails(emailArray);

            if (!validation.isValid) {
                newErrors.emails = `Invalid email format: ${validation.invalidEmails.join(
                    ", "
                )}`;
            }
        }

        // Validate category
        if (!category) {
            newErrors.category = "Please select a category";
        }

        setErrors(newErrors);
        return !newErrors.emails && !newErrors.category;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Parse emails and prepare request data
            const emailArray = emailService.parseEmailString(emails);

            let requestData: EmailExportRequest = {
                emails: emailArray,
            };

            // Handle different categories
            if (category === "current") {
                // Send current filters and sorting as separate properties
                requestData.filters = currentFilters;
                requestData.sortField = currentSorting[0]?.id || "createdAt";
                requestData.sortOrder = currentSorting[0]?.desc
                    ? "desc"
                    : "asc";
            } else {
                // Send category for predefined filters
                requestData.category = category;
            }

            console.log("🔍 Email request data:", requestData);

            // Call the email service
            const response = await emailService.sendCsvExport(requestData);

            if (response.success) {
                toast.success(
                    "CSV report sent successfully to all recipients!"
                );
                handleClose();
            } else {
                throw new Error(
                    response.message || "Failed to send email report"
                );
            }
        } catch (error) {
            console.error("Error sending email report:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to send email report";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmails("");
        setCategory("fancy");
        setErrors({ emails: "", category: "" });
        onClose();
    };

    // Helper function to get current tab description
    const getCurrentTabDescription = () => {
        switch (activeTab) {
            case "fancy":
                return "Fancy Diamonds";
            case "highEnd":
                return "High End Diamonds";
            case "lowEnd":
                return "Low End Diamonds";
            case "all":
            default:
                return "All Diamonds";
        }
    };

    // Helper function to get current filters description
    const getCurrentFiltersDescription = () => {
        const filterEntries = Object.entries(currentFilters);
        if (filterEntries.length === 0) {
            return "No filters applied";
        }

        const descriptions = filterEntries.map(([key, value]) => {
            switch (key) {
                case "sizeMin":
                    return `Min Size: ${value}ct`;
                case "sizeMax":
                    return `Max Size: ${value}ct`;
                case "priceMin":
                    return `Min Price: $${value}`;
                case "priceMax":
                    return `Max Price: $${value}`;
                case "color":
                    return `Color: ${
                        Array.isArray(value) ? value.join(", ") : value
                    }`;
                case "clarity":
                    return `Clarity: ${
                        Array.isArray(value) ? value.join(", ") : value
                    }`;
                case "shape":
                    return `Shape: ${value}`;
                default:
                    return `${key}: ${
                        Array.isArray(value) ? value.join(", ") : value
                    }`;
            }
        });

        return descriptions.join(", ");
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Send Email Report
                    </DialogTitle>
                    <DialogDescription>
                        Send diamond inventory CSV report to multiple email
                        addresses.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="emails">Email Addresses *</Label>
                        <Input
                            id="emails"
                            type="text"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            placeholder="email1@example.com, email2@example.com"
                            className={errors.emails ? "border-red-500" : ""}
                        />
                        <p className="text-sm text-gray-500">
                            Enter multiple emails separated by commas
                        </p>
                        {errors.emails && (
                            <p className="text-sm text-red-500">
                                {errors.emails}
                            </p>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-3">
                        <Label>Diamond Category *</Label>
                        <RadioGroup
                            value={category}
                            onValueChange={(value) =>
                                setCategory(
                                    value as
                                        | "fancy"
                                        | "high"
                                        | "low"
                                        | "current"
                                )
                            }
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fancy" id="fancy" />
                                <Label
                                    htmlFor="fancy"
                                    className="cursor-pointer"
                                >
                                    Fancy Diamonds (Non-Round)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="high" />
                                <Label
                                    htmlFor="high"
                                    className="cursor-pointer"
                                >
                                    High End (Round ≥ 1ct)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="low" />
                                <Label htmlFor="low" className="cursor-pointer">
                                    Low End (Round &lt; 1ct)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="current" id="current" />
                                <Label
                                    htmlFor="current"
                                    className="cursor-pointer"
                                >
                                    Current View ({getCurrentTabDescription()})
                                    <span className="block text-xs text-gray-500 mt-1">
                                        Send with applied filters and sorting
                                    </span>
                                    {category === "current" &&
                                        Object.keys(currentFilters).length >
                                            0 && (
                                            <span className="block text-xs text-blue-600 mt-1 p-2 bg-blue-50 rounded">
                                                Applied filters:{" "}
                                                {getCurrentFiltersDescription()}
                                            </span>
                                        )}
                                </Label>
                            </div>
                        </RadioGroup>
                        {errors.category && (
                            <p className="text-sm text-red-500">
                                {errors.category}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Report
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
