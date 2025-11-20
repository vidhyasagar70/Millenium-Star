"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Check,
    X,
    RefreshCw,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    Info,
    EyeIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Container from "@/components/ui/container";
import { toast } from "sonner";
import { AdminGuard } from "@/components/auth/routeGuard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StatsCard } from "@/components/cards/stats-card";

import { useRouter } from "next/navigation";

type TabType = "pending" | "approved" | "rejected";

interface Quotation {
    quotationId: string;
    certificateNo: string;
    carat: number;
    noOfPieces: number;
    quotePrice: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt: string;
    username?: string;
    email?: string;
    rejectionReason?: string;
}

interface AdminQuotation {
    userId: string;
    username: string;
    email: string;
    phoneNumber: string;
    quotations: Quotation[];
}

const QuotationsPageContent = () => {
    const { isAdmin, loading: authLoading } = useAuth();

    const [adminQuotations, setAdminQuotations] = useState<AdminQuotation[]>(
        []
    );
    const [activeTab, setActiveTab] = useState<TabType>("pending");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    // Fetch quotations from API
    // The useCallback hook is used to memoize the function.
    // By removing isAdmin from the dependency array, the function is not re-created
    // when isAdmin changes, preventing the useEffect from re-running unnecessarily.
    const fetchQuotations = useCallback(async () => {
        if (!isAdmin) {
            setLoading(false); // Make sure to set loading to false if not admin
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/quotations`,
                {
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (data.data && data.data.users) {
                console.log(data.data.users);
                setAdminQuotations(data.data.users);
            } else {
                setAdminQuotations([]);
            }
        } catch (err: any) {
            setError("Failed to fetch quotations.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means this function is created only once.

    // This useEffect now depends only on authLoading.
    // It will run once when authLoading becomes false, triggering the fetch.
    useEffect(() => {
        if (!authLoading) {
            fetchQuotations();
        }
    }, [authLoading, fetchQuotations]); // Keep fetchQuotations here to satisfy the linter, but it won't cause re-runs because it's memoized.

    // Accept/Reject quotation
    const handleAction = async (
        quotationId: string,
        action: "approve" | "reject"
    ) => {
        setActionLoading(quotationId);
        try {
            if (action === "approve") {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/quotations/${quotationId}/approve`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (res.ok) {
                    toast.success("Quotation approved successfully");
                } else {
                    toast.error(data.message || "Failed to approve quotation");
                }
            } else {
                // Prompt for rejection reason

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/quotations/${quotationId}/reject`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await res.json();
                if (res.ok) {
                    toast.success("Quotation rejected successfully");
                } else {
                    toast.error(data.message || "Failed to reject quotation");
                }
            }
            // After a successful action, re-fetch the data to update the UI
            await fetchQuotations();
        } catch (err: any) {
            toast.error("Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    // Flatten quotations for table
    const getFilteredQuotations = useCallback(() => {
        const allQuotes = adminQuotations.flatMap((user) =>
            user.quotations.map((q) => ({
                ...q,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
            }))
        );
        switch (activeTab) {
            case "approved":
                return allQuotes.filter((q) => q.status === "APPROVED");
            case "rejected":
                return allQuotes.filter((q) => q.status === "REJECTED");
            case "pending":
            default:
                return allQuotes.filter((q) => q.status === "PENDING");
        }
    }, [adminQuotations, activeTab]); // Memoize this function to avoid re-creation

    if (authLoading || loading) {
        return <div className="text-center p-12">Loading...</div>;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const filtered = getFilteredQuotations();
    // Flatten all quotations once and compute top-level stats for the cards
    const allQuotes = adminQuotations.flatMap((user) =>
        user.quotations.map((q) => ({
            ...q,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
        }))
    );

    const pendingCount = allQuotes.filter((q) => q.status === "PENDING").length;
    const approvedCount = allQuotes.filter(
        (q) => q.status === "APPROVED"
    ).length;
    const rejectedCount = allQuotes.filter(
        (q) => q.status === "REJECTED"
    ).length;
    const expiredCount = allQuotes.filter((q) =>
        // counts as expired only when expiresAt exists and is in the past
        (q as any).expiresAt
            ? new Date((q as any).expiresAt) < new Date()
            : false
    ).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl  font-medium">Offer Enquiry </h1>
                <Button
                    onClick={fetchQuotations}
                    variant="outline"
                    disabled={loading}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                    Refresh
                </Button>
            </div>

            <Breadcrumb className="my-3">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">HOME</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/quotations">
                            Offer Enquiry
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Top stat cards (matches screenshot layout) */}
            <div className="flex items-center justify-start gap-5 my-10">
                <StatsCard
                    icon={Clock}
                    iconColor="text-orange-500"
                    iconBgColor="bg-orange-400/20"
                    label="Pending Offers"
                    value={loading ? "..." : pendingCount}
                    subtext="Awaiting response"
                />

                <StatsCard
                    icon={CheckCircle}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-400/20"
                    label="Closed Offers"
                    value={loading ? "..." : approvedCount}
                    subtext="Successfully closed"
                />

                {/* <StatsCard
                    icon={XCircle}
                    iconColor="text-red-500"
                    iconBgColor="bg-red-400/20"
                    label="Rejected Offers"
                    value={loading ? "..." : rejectedCount}
                    subtext="Declined offers"
                /> */}
            </div>

            <div className="flex space-x-1 bg-gray-200 text-gray-600 p-1 rounded-lg w-fit">
                <Button
                    variant={activeTab === "pending" ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("pending")}
                >
                    Pending
                </Button>
                <Button
                    variant={activeTab === "approved" ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("approved")}
                >
                    Closed
                </Button>
                {/* <Button
                    variant={activeTab === "rejected" ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("rejected")}
                >
                    Rejected
                </Button> */}
            </div>
            <div className="rounded-lg border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            {/* <TableHead className="text-xs text-center  font-medium text-gray-700">
                                Offer ID
                            </TableHead> */}
                            <TableHead className="text-xs text-center font-medium text-gray-700">
                                Customer
                            </TableHead>
                            <TableHead className="text-xs text-center font-medium text-gray-700">
                                Phone No.
                            </TableHead>
                            <TableHead className="text-xs text-center  font-medium text-gray-700">
                                Diamond
                            </TableHead>
                            <TableHead className="text-xs text-center  font-medium text-gray-700">
                                Cert. No.
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                Inquiry
                            </TableHead>

                            <TableHead className="text-xs font-medium text-gray-700 text-center">
                                Status
                            </TableHead>
                            <TableHead className="text-xs text-center  font-medium text-gray-700">
                                Submitted
                            </TableHead>
                            {activeTab === "pending" && (
                                <TableHead className="text-center text-xs font-medium text-gray-700">
                                    Actions
                                </TableHead>
                            )}
                            {activeTab === "rejected" && (
                                <TableHead className="text-xs font-medium text-gray-700">
                                    Reason
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow className="py-3">
                                <TableCell
                                    colSpan={
                                        activeTab === "pending"
                                            ? 9
                                            : activeTab === "rejected"
                                            ? 9
                                            : 8
                                    }
                                    className="text-center py-12 text-gray-500"
                                >
                                    <Eye className="mx-auto h-8 w-8 text-gray-300" />
                                    <span>No quotations found.</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((q) => (
                                <TableRow
                                    key={q.quotationId}
                                    className="odd:bg-white even:bg-gray-50"
                                >
                                    {/* <TableCell className="font-mono text-sm">
                                        {q.quotationId.slice(0, 8) + "..."}
                                    </TableCell> */}

                                    <TableCell className="py-2">
                                        <div className="text-sm font-medium">
                                            {q.username}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {q.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {q.phoneNumber || "N/A"}
                                    </TableCell>

                                    <TableCell>
                                        <div className="text-sm font-medium">
                                            {q.carat} ct
                                        </div>
                                        {/* <div className="text-xs text-gray-500">
                                            {q.noOfPieces} pcs
                                        </div> */}
                                    </TableCell>

                                    <TableCell>
                                        <span className="flex justify-center items-center gap-2  px-2 py-0.5 text-xs font-medium cursor-pointer  rounded">
                                            {q.certificateNo || "-"}
                                            <EyeIcon
                                                size={15}
                                                onClick={() =>
                                                    router.push(
                                                        `/${q.certificateNo}`
                                                    )
                                                }
                                            />
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-center font-semibold">
                                        {q.quotePrice.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {q.status === "PENDING" && (
                                            <span className="inline-flex items-center gap-2 px-2 py-0.5 text-xs rounded text-orange-600 bg-orange-50">
                                                <Clock className="h-3 w-3" />{" "}
                                                Pending
                                            </span>
                                        )}
                                        {q.status === "APPROVED" && (
                                            <span className="inline-flex items-center gap-2 px-2 py-0.5 text-xs rounded text-green-700 bg-green-50">
                                                <Check className="h-3 w-3" />{" "}
                                                Closed
                                            </span>
                                        )}
                                        {q.status === "REJECTED" && (
                                            <span className="inline-flex items-center gap-2 px-2 py-0.5 text-xs rounded text-red-700 bg-red-50">
                                                <X className="h-3 w-3" />{" "}
                                                Rejected
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(q.submittedAt)}
                                    </TableCell>

                                    {activeTab === "pending" && (
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleAction(
                                                            q.quotationId,
                                                            "approve"
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        q.quotationId
                                                    }
                                                    className={`text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200`}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    {actionLoading ===
                                                    q.quotationId
                                                        ? "..."
                                                        : "Close"}
                                                </Button>

                                                {/* <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleAction(
                                                            q.quotationId,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        q.quotationId
                                                    }
                                                    className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200`}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    {actionLoading ===
                                                    q.quotationId
                                                        ? "..."
                                                        : "Reject"}
                                                </Button> */}
                                            </div>
                                        </TableCell>
                                    )}

                                    {activeTab === "rejected" && (
                                        <TableCell>
                                            {q.rejectionReason || "-"}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const QuotationsPage = () => {
    return (
        <AdminGuard>
            <Container className="min-h-screen py-8">
                <QuotationsPageContent />
            </Container>
        </AdminGuard>
    );
};

export default QuotationsPage;
