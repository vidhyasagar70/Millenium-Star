"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface RouteGuardProps {
    children: React.ReactNode;
    requiredRole?: "USER" | "ADMIN";
    requiredStatus?: "DEFAULT" | "PENDING" | "APPROVED" | "REJECTED";
    fallbackPath?: string;
    loadingComponent?: React.ReactNode;
    unauthorizedComponent?: React.ReactNode;
    allowAdminBypass?: boolean;
    showLoginMessage?: boolean; // New prop for showing login message
}

const DefaultLoadingComponent = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
);

const DefaultUnauthorizedComponent = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Access Denied
            </h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
                onClick={() => window.history.back()}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
                Go Back
            </button>
        </div>
    </div>
);

// New component for login required message
const LoginRequiredComponent = () => {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Login Required
                </h2>
                <p className="text-gray-600 mb-6">
                    Please login first to access the inventory. You need to be
                    authenticated to view our diamond collection.
                </p>
                <div className="space-y-3">
                    <div className="text-sm text-gray-500 mb-4">
                        Redirecting to home page in{" "}
                        <span className="font-semibold text-black text-lg">
                            {countdown}
                        </span>{" "}
                        seconds...
                    </div>
                    <div className="flex space-x-3 justify-center">
                        <button
                            onClick={() => router.push("/")}
                            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Go to Home
                        </button>
                        <button
                            onClick={() => router.push("/contact")}
                            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RouteGuard: React.FC<RouteGuardProps> = ({
    children,
    requiredRole,
    requiredStatus,
    fallbackPath = "/",
    loadingComponent = <DefaultLoadingComponent />,
    unauthorizedComponent,
    allowAdminBypass = false,
    showLoginMessage = false,
}) => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [showingLoginMessage, setShowingLoginMessage] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated()) {
                if (showLoginMessage) {
                    setShowingLoginMessage(true);
                    return;
                } else {
                    router.push(fallbackPath);
                    return;
                }
            }

            // Admin bypass logic - if user is ADMIN and bypass is allowed, skip all checks
            if (allowAdminBypass && user?.role === "ADMIN") {
                return;
            }

            // Check role requirement
            if (requiredRole && user?.role !== requiredRole) {
                if (!unauthorizedComponent) {
                    router.push(fallbackPath);
                }
                return;
            }

            // Check status requirement
            if (requiredStatus && user?.status !== requiredStatus) {
                if (!unauthorizedComponent) {
                    router.push(fallbackPath);
                }
                return;
            }
        }
    }, [
        loading,
        user,
        isAuthenticated,
        requiredRole,
        requiredStatus,
        router,
        fallbackPath,
        unauthorizedComponent,
        allowAdminBypass,
        showLoginMessage,
    ]);

    if (loading) {
        return <>{loadingComponent}</>;
    }

    if (!isAuthenticated()) {
        if (showingLoginMessage) {
            return <LoginRequiredComponent />;
        }
        return null; // Will redirect
    }

    // Admin bypass logic - if user is ADMIN and bypass is allowed, render children
    if (allowAdminBypass && user?.role === "ADMIN") {
        return <>{children}</>;
    }

    // Check role requirement
    if (requiredRole && user?.role !== requiredRole) {
        if (unauthorizedComponent) {
            return <>{unauthorizedComponent}</>;
        }
        return (
            <DefaultUnauthorizedComponent
                message={`This page requires ${requiredRole} role access.`}
            />
        );
    }

    // Check status requirement
    if (requiredStatus && user?.status !== requiredStatus) {
        if (unauthorizedComponent) {
            return <>{unauthorizedComponent}</>;
        }

        let statusMessage = "";
        switch (requiredStatus) {
            case "APPROVED":
                statusMessage =
                    "This page requires approved account status. Please wait for admin approval.";
                break;
            case "PENDING":
                statusMessage = "This page requires pending account status.";
                break;
            default:
                statusMessage = `This page requires ${requiredStatus} account status.`;
        }

        return <DefaultUnauthorizedComponent message={statusMessage} />;
    }

    return <>{children}</>;
};

// Specific guard components for common use cases
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => <RouteGuard requiredRole="ADMIN">{children}</RouteGuard>;

// Updated: Allow both ADMIN users and APPROVED USER users with login message
export const InventoryGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <RouteGuard
        requiredRole="USER"
        requiredStatus="APPROVED"
        allowAdminBypass={true}
        showLoginMessage={true} // Enable login message for inventory
    >
        {children}
    </RouteGuard>
);

// Keeping the old component for backward compatibility, but it's now an alias
export const ApprovedUserGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => <InventoryGuard>{children}</InventoryGuard>;
