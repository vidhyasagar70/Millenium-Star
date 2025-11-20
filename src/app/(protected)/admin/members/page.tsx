"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    X,
    Eye,
    RefreshCw,
    Clock,
    CheckCircle,
    XCircle,
    UserPlus,
} from "lucide-react";
import { toast } from "sonner";
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

import { AdminGuard } from "@/components/auth/routeGuard";
import { SiteHeader } from "@/components/layout/site-header";
import Container from "@/components/ui/container";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { StatsCard } from "@/components/cards/stats-card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Quotation {
    quotationId: string;
    carat: number;
    noOfPieces: number;
    quotePrice: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt: string;
}

interface CustomerData {
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
        companyName: string;
        businessType: string;
        vatNumber: string;
        websiteUrl?: string;
    };
    submittedAt: string;
}

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    status: "DEFAULT" | "PENDING" | "APPROVED" | "REJECTED";
    role: "USER" | "ADMIN";
    quotations?: Quotation[];
    customerData?: CustomerData;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

type TabType = "pending" | "rejected" | "approved";

export default function MembersEnquiry() {
    const [activeTab, setActiveTab] = useState<TabType>("pending");
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
    const [rejectedUsers, setRejectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberPhone, setNewMemberPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user, logout } = useAuth();
    const router = useRouter();

    // Fetch pending users using the specific KYC pending endpoint
    const fetchPendingUsers = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/customer-data-pending`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();
            console.log("Pending Users Data:", data);

            if (data.success) {
                setPendingUsers(data.data || []);
            } else {
                toast.error("Failed to fetch pending users");
            }
        } catch (error) {
            console.error("Error fetching pending users:", error);
            toast.error("Error fetching pending users");
        }
    };

    // Fetch all users and filter by status on client side
    const fetchAllUsers = async () => {
        try {
            // Fetch multiple pages to get all users
            let allUsers: User[] = [];
            let currentPage = 1;
            let totalPages = 1;

            do {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/users?page=${currentPage}&limit=50`,
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                console.log("All Users Data:", data);

                if (data.success) {
                    allUsers = [...allUsers, ...data.data];
                    totalPages = data.pagination.totalPages;
                    currentPage++;
                } else {
                    toast.error("Failed to fetch users");
                    break;
                }
            } while (currentPage <= totalPages);

            // Filter users by status on client side
            const approved = allUsers.filter(
                (user) => user.status === "APPROVED" && user.customerData
            );
            console.log("Approved Users:", approved);
            const rejected = allUsers.filter(
                (user) => user.status === "REJECTED" && user.customerData
            );
            console.log("Rejected Users:", rejected);

            setApprovedUsers(approved);
            setRejectedUsers(rejected);
        } catch (error) {
            console.error("Error fetching all users:", error);
            toast.error("Error fetching users");
        }
    };

    // Combined refresh helper
    const refreshAll = async () => {
        setLoading(true);
        await Promise.all([fetchPendingUsers(), fetchAllUsers()]);
        setLoading(false);
    };

    // Approve user
    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/approve-customer-data`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            const data = await response.json();

            if (data.success) {
                toast.success("User approved successfully");
                // Refresh all user lists
                await refreshAll();
            } else {
                toast.error(data.message || "Failed to approve user");
            }
        } catch (error) {
            console.error("Error approving user:", error);
            toast.error("Error approving user");
        } finally {
            setActionLoading(null);
        }
    };

    // Reject user
    const handleReject = async (userId: string) => {
        setActionLoading(userId);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/reject-customer-data`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            const data = await response.json();

            if (data.success) {
                toast.success("User rejected successfully");
                // Refresh all user lists
                await refreshAll();
            } else {
                toast.error(data.message || "Failed to reject user");
            }
        } catch (error) {
            console.error("Error rejecting user:", error);
            toast.error("Error rejecting user");
        } finally {
            setActionLoading(null);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Add member via WhatsApp
    const handleAddMember = async () => {
        if (!newMemberName.trim() || !newMemberPhone.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/business-whatsapp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: newMemberName,
                        phoneNo: newMemberPhone,
                    }),
                }
            );
            const data = await response.json();

            if (data.success) {
                toast.success("Member added successfully");
                setIsAddMemberOpen(false);
                setNewMemberName("");
                setNewMemberPhone("");
                await refreshAll();
            } else {
                toast.error(data.message || "Failed to add member");
            }
        } catch (error) {
            console.error("Error adding member:", error);
            toast.error("Error adding member");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchPendingUsers(), fetchAllUsers()]);
            setLoading(false);
        };

        loadData();
    }, []);

    // Top-level stats
    const pendingCount = pendingUsers.length;
    const approvedCount = approvedUsers.length;
    const rejectedCount = rejectedUsers.length;

    // Helper function to render user table rows
    const renderUserRows = (users: User[], showActions: boolean = false) => {
        if (users.length === 0) {
            return (
                <TableRow>
                    <TableCell
                        colSpan={showActions ? 11 : 10}
                        className="text-center py-8 text-gray-500"
                    >
                        <Eye className="mx-auto h-8 w-8 text-gray-300" />
                        No users found
                    </TableCell>
                </TableRow>
            );
        }

        return users.map((user, index) => (
            <TableRow key={user._id} className="hover:bg-gray-50">
                <TableCell className="text-center font-mono">
                    {user._id.slice(-8)}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1 h-12">
                        <div className="text-sm font-medium  flex items-center justify-center">
                            {user.customerData
                                ? `${user.customerData.firstName} ${user.customerData.lastName}`
                                : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {user.customerData?.businessInfo?.companyName || ""}
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    {user.customerData?.businessInfo?.vatNumber || "N/A"}
                </TableCell>
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                    {user.customerData?.countryCode &&
                    user.customerData?.phoneNumber
                        ? `${user.customerData.countryCode} ${user.customerData.phoneNumber}`
                        : "N/A"}
                </TableCell>
                <TableCell className="text-center">
                    {user.customerData?.businessInfo?.companyName || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                    {user.customerData?.businessInfo?.businessType || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                    {formatDate(user.createdAt)}
                </TableCell>
                {showActions && (
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(user._id)}
                                disabled={actionLoading === user._id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                {actionLoading === user._id ? "..." : "Approve"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(user._id)}
                                disabled={actionLoading === user._id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                                <X className="h-4 w-4 mr-1" />
                                {actionLoading === user._id ? "..." : "Reject"}
                            </Button>
                        </div>
                    </TableCell>
                )}
            </TableRow>
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <AdminGuard>
            <Container>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-medium">
                                Members Enquiry
                            </h1>
                            <Breadcrumb className="my-2">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">
                                            HOME
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        {"/"}
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin/members">
                                            Members
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* <Button
                                onClick={() => setIsAddMemberOpen(true)}
                                variant="default"
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Member
                            </Button> */}
                            <Button
                                onClick={refreshAll}
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
                    </div>

                    {/* Top stat cards */}
                    <div className="flex items-center justify-start gap-5 my-6">
                        <StatsCard
                            icon={Clock}
                            iconColor="text-orange-500"
                            iconBgColor="bg-orange-400/20"
                            label="Waiting Authorization"
                            value={loading ? "..." : pendingCount}
                            subtext="Pending KYC"
                        />

                        <StatsCard
                            icon={CheckCircle}
                            iconColor="text-green-500"
                            iconBgColor="bg-green-400/20"
                            label="Authorized Members"
                            value={loading ? "..." : approvedCount}
                            subtext="KYC approved"
                        />

                        <StatsCard
                            icon={XCircle}
                            iconColor="text-red-500"
                            iconBgColor="bg-red-400/20"
                            label="Rejected Members"
                            value={loading ? "..." : rejectedCount}
                            subtext="KYC rejected"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-200 text-gray-600 p-1 rounded-lg w-fit">
                        <Button
                            variant={
                                activeTab === "pending" ? "outline" : "ghost"
                            }
                            size="sm"
                            onClick={() => setActiveTab("pending")}
                        >
                            Waiting Authorization ({pendingUsers.length})
                        </Button>
                        <Button
                            variant={
                                activeTab === "approved" ? "outline" : "ghost"
                            }
                            size="sm"
                            onClick={() => setActiveTab("approved")}
                        >
                            Authorized ({approvedUsers.length})
                        </Button>
                        <Button
                            variant={
                                activeTab === "rejected" ? "outline" : "ghost"
                            }
                            size="sm"
                            onClick={() => setActiveTab("rejected")}
                        >
                            Rejected ({rejectedUsers.length})
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        ID
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-700">
                                        Name (Company)
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        VAT Number
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        Username
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        Email
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        Phone
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        Company
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        Business Type
                                    </TableHead>
                                    <TableHead className="text-center text-xs font-medium text-gray-700">
                                        Joined
                                    </TableHead>
                                    {activeTab === "pending" && (
                                        <TableHead className="text-center text-xs font-medium text-gray-700">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeTab === "pending" &&
                                    renderUserRows(pendingUsers, true)}
                                {activeTab === "approved" &&
                                    renderUserRows(approvedUsers, false)}
                                {activeTab === "rejected" &&
                                    renderUserRows(rejectedUsers, false)}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Status summary */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>
                            {activeTab === "pending" &&
                                `Showing ${pendingUsers.length} pending users`}
                            {activeTab === "approved" &&
                                `Showing ${approvedUsers.length} approved users`}
                            {activeTab === "rejected" &&
                                `Showing ${rejectedUsers.length} rejected users`}
                        </div>
                        <div className="text-xs text-gray-500">
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Add Member Dialog */}
                <Dialog
                    open={isAddMemberOpen}
                    onOpenChange={setIsAddMemberOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Member</DialogTitle>
                            <DialogDescription>
                                Enter the member's details to send them a
                                WhatsApp invitation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={newMemberName}
                                    onChange={(e) =>
                                        setNewMemberName(e.target.value)
                                    }
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+918271442359"
                                    value={newMemberPhone}
                                    onChange={(e) =>
                                        setNewMemberPhone(e.target.value)
                                    }
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500">
                                    Include country code (e.g., +91 for India)
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddMemberOpen(false);
                                    setNewMemberName("");
                                    setNewMemberPhone("");
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddMember}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Member"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Container>
        </AdminGuard>
    );
}
