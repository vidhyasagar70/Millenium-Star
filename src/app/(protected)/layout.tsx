"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedLayout;
