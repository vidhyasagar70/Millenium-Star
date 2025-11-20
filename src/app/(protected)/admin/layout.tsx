"use client";
import Navbar from "@/components/admin/navbar";
import { AdminGuard } from "@/components/auth/routeGuard";

import React from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50">
                {/* <Navbar /> */}
                <main className="p-4">{children}</main>
            </div>
        </AdminGuard>
    );
}
