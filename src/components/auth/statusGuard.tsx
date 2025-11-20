"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface UserStatusHandlerProps {
    children: React.ReactNode;
}

const StatusPendingComponent = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Account Under Review
            </h2>
            <p className="text-gray-600 mb-6">
                Your KYC submission is currently being reviewed by our admin
                team. You'll be able to access the inventory once your account
                is approved.
            </p>
            <div className="space-y-3">
                <div className="text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-semibold text-yellow-600">
                        Pending Approval
                    </span>
                </div>
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    </div>
);

const StatusRejectedComponent = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Account Rejected
            </h2>
            <p className="text-gray-600 mb-6">
                Unfortunately, your KYC submission has been rejected. Please
                contact our support team for more information or to resubmit
                your application.
            </p>
            <div className="space-y-3">
                <div className="text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-semibold text-red-600">Rejected</span>
                </div>
                <div className="flex space-x-3 justify-center">
                    <Link
                        href="/"
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/contact"
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const StatusDefaultComponent = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Your Profile
            </h2>
            <p className="text-gray-600 mb-6">
                To access the inventory, you need to complete your KYC (Know
                Your Customer) verification. This helps us ensure a secure
                trading environment.
            </p>
            <div className="space-y-3">
                <div className="text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-semibold text-blue-600">
                        KYC Required
                    </span>
                </div>
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Complete KYC
                </Link>
            </div>
        </div>
    </div>
);

export const UserStatusHandler: React.FC<UserStatusHandlerProps> = ({
    children,
}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // UPDATED: Don't interfere with ADMIN users - let them through regardless of status
    if (!user || user.role === "ADMIN") {
        return <>{children}</>;
    }

    // Only apply status checks for USER role
    if (user.role === "USER") {
        switch (user.status) {
            case "DEFAULT":
                return <StatusDefaultComponent />;
            case "PENDING":
                return <StatusPendingComponent />;
            case "REJECTED":
                return <StatusRejectedComponent />;
            case "APPROVED":
                return <>{children}</>;
            default:
                return <>{children}</>;
        }
    }

    return <>{children}</>;
};
