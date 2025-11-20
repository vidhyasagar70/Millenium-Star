"use client";

import { InventoryGuard } from "@/components/auth/routeGuard";
import { UserStatusHandler } from "@/components/auth/statusGuard";
import Container from "@/components/ui/container";
import { useAuth } from "@/hooks/useAuth";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Globe,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
    Briefcase,
    Edit3,
    X,
    Send,
    Loader2,
    Key,
    Lock,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    role: "USER" | "ADMIN";
    status: "DEFAULT" | "PENDING" | "APPROVED" | "REJECTED";
    customerData?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        countryCode: string;
        address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
        businessInfo: {
            companyName?: string;
            businessType?: string;
            vatNumber?: string;
            websiteUrl?: string;
        };
        submittedAt: string;
    };
    quotations: Array<{
        quotationId: string;
        carat: number;
        noOfPieces: number;
        quotePrice: number;
        status: "PENDING" | "APPROVED" | "REJECTED";
        submittedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

const ProfilePage = () => {
    const { user: authUser, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Email change states
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [emailChangeLoading, setEmailChangeLoading] = useState(false);
    const [emailChangeError, setEmailChangeError] = useState<string | null>(
        null
    );
    const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);

    // Password change states
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordOtp, setPasswordOtp] = useState("");
    const [passwordOtpSent, setPasswordOtpSent] = useState(false);
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState<
        string | null
    >(null);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();
                if (data.success) {
                    console.log("Profile data:", data.data.user);
                    setProfile(data.data.user);
                } else {
                    throw new Error(data.message || "Failed to fetch profile");
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated() && profile === null) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    const sendOTP = async () => {
        if (!newEmail || !newEmail.includes("@")) {
            setEmailChangeError("Please enter a valid email address");
            return;
        }

        if (newEmail === profile?.email) {
            setEmailChangeError(
                "New email cannot be the same as current email"
            );
            return;
        }

        setEmailChangeLoading(true);
        setEmailChangeError(null);

        try {
            const response = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/users/otp?email=${encodeURIComponent(newEmail)}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setOtpSent(true);
                setEmailChangeError(null);
            } else {
                throw new Error(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setEmailChangeError(
                err instanceof Error ? err.message : "Failed to send OTP"
            );
        } finally {
            setEmailChangeLoading(false);
        }
    };

    const updateEmail = async () => {
        if (!otp || otp.length < 4) {
            setEmailChangeError("Please enter a valid OTP");
            return;
        }

        setEmailChangeLoading(true);
        setEmailChangeError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-email`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newEmail: newEmail,
                        otp: otp,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                // Update profile with new email
                setProfile((prev) =>
                    prev ? { ...prev, email: newEmail } : null
                );
                setEmailChangeSuccess(true);
                setEmailChangeError(null);

                // Reset form after short delay
                setTimeout(() => {
                    handleCloseEmailModal();
                }, 2000);
            } else {
                throw new Error(data.message || "Failed to update email");
            }
        } catch (err) {
            setEmailChangeError(
                err instanceof Error ? err.message : "Failed to update email"
            );
        } finally {
            setEmailChangeLoading(false);
        }
    };

    const sendPasswordOTP = async () => {
        if (!profile?.email) {
            setPasswordChangeError("No email found in profile");
            return;
        }

        setPasswordChangeLoading(true);
        setPasswordChangeError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/otp`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: profile.email,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setPasswordOtpSent(true);
                setPasswordChangeError(null);
            } else {
                throw new Error(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setPasswordChangeError(
                err instanceof Error ? err.message : "Failed to send OTP"
            );
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    const updatePassword = async () => {
        // Validation
        if (!newPassword || newPassword.length < 6) {
            setPasswordChangeError(
                "Password must be at least 6 characters long"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordChangeError("Passwords do not match");
            return;
        }

        if (!passwordOtp || passwordOtp.length < 4) {
            setPasswordChangeError("Please enter a valid OTP");
            return;
        }

        setPasswordChangeLoading(true);
        setPasswordChangeError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-password`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newPassword: newPassword,
                        email: profile?.email,
                        otp: passwordOtp,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setPasswordChangeSuccess(true);
                setPasswordChangeError(null);

                // Reset form after short delay
                setTimeout(() => {
                    handleClosePasswordModal();
                }, 2000);
            } else {
                throw new Error(data.message || "Failed to update password");
            }
        } catch (err) {
            setPasswordChangeError(
                err instanceof Error ? err.message : "Failed to update password"
            );
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    const handleCloseEmailModal = () => {
        setIsEmailModalOpen(false);
        setNewEmail("");
        setOtp("");
        setOtpSent(false);
        setEmailChangeLoading(false);
        setEmailChangeError(null);
        setEmailChangeSuccess(false);
    };

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setPasswordOtp("");
        setPasswordOtpSent(false);
        setPasswordChangeLoading(false);
        setPasswordChangeError(null);
        setPasswordChangeSuccess(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "REJECTED":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "PENDING":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "text-green-600 bg-green-50 border-green-200";
            case "REJECTED":
                return "text-red-600 bg-red-50 border-red-200";
            case "PENDING":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (loading) {
        return (
            <InventoryGuard>
                <UserStatusHandler>
                    <div className="min-h-screen bg-gray-50 py-12">
                        <Container className="max-w-4xl">
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mt-6"></div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </UserStatusHandler>
            </InventoryGuard>
        );
    }

    if (error) {
        return (
            <InventoryGuard>
                <UserStatusHandler>
                    <div className="min-h-screen bg-gray-50 py-12">
                        <Container className="max-w-4xl">
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="text-red-600 mb-4">
                                    <XCircle className="h-12 w-12 mx-auto" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Error Loading Profile
                                </h2>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        </Container>
                    </div>
                </UserStatusHandler>
            </InventoryGuard>
        );
    }

    if (!profile) {
        return (
            <InventoryGuard>
                <UserStatusHandler>
                    <div className="min-h-screen bg-gray-50 py-12">
                        <Container className="max-w-4xl">
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <p className="text-gray-600">
                                    No profile data available
                                </p>
                            </div>
                        </Container>
                    </div>
                </UserStatusHandler>
            </InventoryGuard>
        );
    }

    return (
        <InventoryGuard>
            <UserStatusHandler>
                <div className="min-h-screen bg-gray-50 py-12">
                    <Container className="max-w-4xl">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-white px-8 py-6 border-b border-gray-200">
                                <h1 className="text-3xl font-playfair font-semibold text-center text-gray-900">
                                    MY ACCOUNT
                                </h1>
                            </div>

                            {/* Content */}
                            <div className="px-8 py-8">
                                {/* Account Information Card */}
                                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Account Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                User Name
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <User className="h-5 w-5 text-gray-400" />
                                                <span className="text-gray-900 text-lg">
                                                    {profile.username}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email ID
                                            </label>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                    <span className="text-gray-900 text-lg">
                                                        {profile.email}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setIsEmailModalOpen(
                                                            true
                                                        )
                                                    }
                                                    className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Change Email"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                    <span className="text-gray-900 text-lg">
                                                        ••••••••
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setIsPasswordModalOpen(
                                                            true
                                                        )
                                                    }
                                                    className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Change Password"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Status
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(profile.status)}
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                                        profile.status
                                                    )}`}
                                                >
                                                    {profile.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <Building className="h-5 w-5 text-gray-400" />
                                                <span className="text-gray-900 text-lg">
                                                    {profile.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information Card */}
                                {profile.customerData && (
                                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                            <User className="h-5 w-5 mr-2 text-blue-600" />
                                            Personal Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <p className="text-gray-900 text-lg font-medium">
                                                    {
                                                        profile.customerData
                                                            .firstName
                                                    }{" "}
                                                    {
                                                        profile.customerData
                                                            .lastName
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <p className="text-gray-900 text-lg">
                                                        {
                                                            profile.customerData
                                                                .countryCode
                                                        }{" "}
                                                        {
                                                            profile.customerData
                                                                .phoneNumber
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Address Information Card */}
                                {profile.customerData && (
                                    <div className="bg-green-50 rounded-lg p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                            <MapPin className="h-5 w-5 mr-2 text-green-600" />
                                            Address Information
                                        </h2>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Complete Address
                                            </label>
                                            <div className="bg-white rounded-md p-4 border border-green-200">
                                                <p className="text-gray-900 leading-relaxed">
                                                    <span className="block font-medium">
                                                        {
                                                            profile.customerData
                                                                .address.street
                                                        }
                                                    </span>
                                                    <span className="block">
                                                        {
                                                            profile.customerData
                                                                .address.city
                                                        }
                                                        ,{" "}
                                                        {
                                                            profile.customerData
                                                                .address.state
                                                        }{" "}
                                                        {
                                                            profile.customerData
                                                                .address
                                                                .postalCode
                                                        }
                                                    </span>
                                                    <span className="block font-medium text-gray-700">
                                                        {
                                                            profile.customerData
                                                                .address.country
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Business Information Card */}
                                {profile.customerData && (
                                    <div className="bg-purple-50 rounded-lg p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                            <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                                            Business Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {profile.customerData.businessInfo
                                                ?.companyName && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Company Name
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <Building className="h-4 w-4 text-gray-400" />
                                                        <p className="text-gray-900 text-lg font-medium">
                                                            {
                                                                profile
                                                                    .customerData
                                                                    .businessInfo
                                                                    .companyName
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.customerData.businessInfo
                                                ?.businessType && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Business Type
                                                    </label>
                                                    <p className="text-gray-900 text-lg">
                                                        {
                                                            profile.customerData
                                                                .businessInfo
                                                                .businessType
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {profile.customerData.businessInfo
                                                ?.vatNumber && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        VAT/Tax Number
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <CreditCard className="h-4 w-4 text-gray-400" />
                                                        <p className="text-gray-900 text-lg font-mono">
                                                            {
                                                                profile
                                                                    .customerData
                                                                    .businessInfo
                                                                    .vatNumber
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.customerData.businessInfo
                                                ?.websiteUrl && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Website
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="h-4 w-4 text-gray-400" />
                                                        <a
                                                            href={
                                                                profile
                                                                    .customerData
                                                                    .businessInfo
                                                                    .websiteUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 underline"
                                                        >
                                                            {
                                                                profile
                                                                    .customerData
                                                                    .businessInfo
                                                                    .websiteUrl
                                                            }
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* KYC Submission Date */}
                                        <div className="mt-6 pt-4 border-t border-purple-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                KYC Submitted On
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900">
                                                    {new Date(
                                                        profile.customerData.submittedAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Show message if no customer data */}
                                {!profile.customerData && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                        <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Complete Your Profile
                                        </h3>
                                        <p className="text-gray-600">
                                            Please complete your KYC
                                            verification to access all features
                                            and view your complete profile
                                            information.
                                        </p>
                                    </div>
                                )}

                                {/* Quotations Section */}
                                {profile.quotations &&
                                    profile.quotations.length > 0 && (
                                        <div className="border-t border-gray-200 pt-8 mt-8">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                                My Quotations
                                            </h2>

                                            <div className="space-y-4">
                                                {profile.quotations.map(
                                                    (quotation) => (
                                                        <div
                                                            key={
                                                                quotation.quotationId
                                                            }
                                                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    Quotation
                                                                    ID:{" "}
                                                                    {
                                                                        quotation.quotationId
                                                                    }
                                                                </span>
                                                                <div className="flex items-center space-x-2">
                                                                    {getStatusIcon(
                                                                        quotation.status
                                                                    )}
                                                                    <span
                                                                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                                                                            quotation.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            quotation.status
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Carat:
                                                                    </span>
                                                                    <span className="ml-2 font-medium">
                                                                        {
                                                                            quotation.carat
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Pieces:
                                                                    </span>
                                                                    <span className="ml-2 font-medium">
                                                                        {
                                                                            quotation.noOfPieces
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Quote
                                                                        Price:
                                                                    </span>
                                                                    <span className="ml-2 font-medium">
                                                                        $
                                                                        {quotation.quotePrice.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 text-xs text-gray-500">
                                                                Submitted:{" "}
                                                                {new Date(
                                                                    quotation.submittedAt
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Account Details */}
                                <div className="border-t border-gray-200 pt-8 mt-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Account Timeline
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Member Since
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900 font-medium">
                                                    {new Date(
                                                        profile.createdAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Updated
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900 font-medium">
                                                    {new Date(
                                                        profile.updatedAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>

                    {/* Password Change Modal */}
                    {isPasswordModalOpen && (
                        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Change Password
                                    </h3>
                                    <button
                                        onClick={handleClosePasswordModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {passwordChangeSuccess ? (
                                    <div className="text-center py-4">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            Password Updated Successfully!
                                        </h4>
                                        <p className="text-gray-600">
                                            Your password has been changed
                                            successfully.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="bg-gray-50 rounded-md p-3">
                                                <p className="text-gray-900">
                                                    {profile.email}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                OTP will be sent to this email
                                                address
                                            </p>
                                        </div>

                                        {!passwordOtpSent && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) =>
                                                            setNewPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter new password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        disabled={
                                                            passwordChangeLoading
                                                        }
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Password must be at
                                                        least 6 characters long
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) =>
                                                            setConfirmPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Confirm new password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        disabled={
                                                            passwordChangeLoading
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {passwordOtpSent && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter OTP
                                                </label>
                                                <input
                                                    type="text"
                                                    value={passwordOtp}
                                                    onChange={(e) =>
                                                        setPasswordOtp(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter 4-digit OTP"
                                                    maxLength={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    disabled={
                                                        passwordChangeLoading
                                                    }
                                                />
                                                <p className="text-sm text-gray-600 mt-1">
                                                    OTP has been sent to{" "}
                                                    {profile.email}
                                                </p>
                                            </div>
                                        )}

                                        {passwordChangeError && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                                <div className="flex">
                                                    <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-red-700">
                                                        {passwordChangeError}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={
                                                    handleClosePasswordModal
                                                }
                                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                                disabled={passwordChangeLoading}
                                            >
                                                Cancel
                                            </button>

                                            {!passwordOtpSent ? (
                                                <button
                                                    onClick={sendPasswordOTP}
                                                    disabled={
                                                        passwordChangeLoading ||
                                                        !newPassword ||
                                                        !confirmPassword ||
                                                        newPassword !==
                                                            confirmPassword ||
                                                        newPassword.length < 6
                                                    }
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                                >
                                                    {passwordChangeLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Send className="h-4 w-4 mr-2" />
                                                    )}
                                                    Send OTP
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={updatePassword}
                                                    disabled={
                                                        passwordChangeLoading ||
                                                        !passwordOtp
                                                    }
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                                >
                                                    {passwordChangeLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                    )}
                                                    Update Password
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Email Change Modal */}
                    {isEmailModalOpen && (
                        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Change Email Address
                                    </h3>
                                    <button
                                        onClick={handleCloseEmailModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {emailChangeSuccess ? (
                                    <div className="text-center py-4">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            Email Updated Successfully!
                                        </h4>
                                        <p className="text-gray-600">
                                            Your email has been changed to{" "}
                                            <span className="font-medium">
                                                {newEmail}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Email
                                            </label>
                                            <div className="bg-gray-50 rounded-md p-3">
                                                <p className="text-gray-900">
                                                    {profile.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) =>
                                                    setNewEmail(e.target.value)
                                                }
                                                placeholder="Enter new email address"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                disabled={
                                                    otpSent ||
                                                    emailChangeLoading
                                                }
                                            />
                                        </div>

                                        {otpSent && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter OTP
                                                </label>
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) =>
                                                        setOtp(e.target.value)
                                                    }
                                                    placeholder="Enter 4-digit OTP"
                                                    maxLength={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    disabled={
                                                        emailChangeLoading
                                                    }
                                                />
                                                <p className="text-sm text-gray-600 mt-1">
                                                    OTP has been sent to{" "}
                                                    {newEmail}
                                                </p>
                                            </div>
                                        )}

                                        {emailChangeError && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                                <div className="flex">
                                                    <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-red-700">
                                                        {emailChangeError}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={handleCloseEmailModal}
                                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                                disabled={emailChangeLoading}
                                            >
                                                Cancel
                                            </button>

                                            {!otpSent ? (
                                                <button
                                                    onClick={sendOTP}
                                                    disabled={
                                                        emailChangeLoading ||
                                                        !newEmail
                                                    }
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                                >
                                                    {emailChangeLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Send className="h-4 w-4 mr-2" />
                                                    )}
                                                    Send OTP
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={updateEmail}
                                                    disabled={
                                                        emailChangeLoading ||
                                                        !otp
                                                    }
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                                >
                                                    {emailChangeLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                    )}
                                                    Update Email
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </UserStatusHandler>
        </InventoryGuard>
    );
};

export default ProfilePage;
