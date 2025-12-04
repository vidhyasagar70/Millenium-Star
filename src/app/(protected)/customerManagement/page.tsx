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
    ChevronDown,
    ChevronUp,
    ShoppingCart,
    Hand,
    FileText,
    User,
    EyeIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { ClientPagination } from "@/components/inventory/client-pagination";

interface User {
    _id: string;
    username: string;
    email: string;
    status: string;
    role: string;
    createdAt: string;
    customerData?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        countryCode: string;
        companyName?: string;
        businessType?: string;
        vatNumber?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface Diamond {
    _id: string;
    certificateNumber: string;
    shape: string;
    size: number;
    color: string;
    clarity: string;
    price: number;
    pricePerCarat: number;
}

interface CartItem {
    cartItem: {
        diamondId: string;
        certificateNumber: string;
        addedAt: string;
        _id: string;
    };
    diamond: Diamond;
}

interface HoldItem {
    holdItem: {
        _id: string;
        diamondId: string;
        certificateNumber: string;
        userId: string;
        status: string;
        rejectionReason: string;
        createdAt: string;
    };
    diamond: Diamond;
}

interface Quotation {
    quotationId: string;
    certificateNo: string;
    carat: number;
    quotePrice: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt: string;
}

interface UserCart {
    email: string;
    username: string;
    userId: string;
    cartItems: CartItem[];
}

interface UserHold {
    email: string;
    username: string;
    userId: string;
    holdItems: HoldItem[];
}

interface UserQuotation {
    userId: string;
    username: string;
    email: string;
    quotations: Quotation[];
}

const CustomerManagementContent = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [allCarts, setAllCarts] = useState<UserCart[]>([]);
    const [allHolds, setAllHolds] = useState<UserHold[]>([]);
    const [allQuotations, setAllQuotations] = useState<UserQuotation[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        recordsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const isAdmin = user?.role === "ADMIN";

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Fetch users with pagination
            const usersRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users?page=${currentPage}&limit=${pageSize}`,
                { credentials: "include" }
            );
            const usersData = await usersRes.json();

            // Fetch all carts
            const cartsRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/cart/admin/all`,
                { credentials: "include" }
            );
            const cartsData = await cartsRes.json();

            // Fetch all holds
            const holdsRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/hold/admin/all`,
                { credentials: "include" }
            );
            const holdsData = await holdsRes.json();

            // Fetch all quotations
            const quotationsRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/quotations`,
                { credentials: "include" }
            );
            const quotationsData = await quotationsRes.json();

            if (usersData.success) {
                setUsers(usersData.data || []);
                // Set pagination data
                if (usersData.pagination) {
                    setPagination({
                        currentPage: usersData.pagination.currentPage || currentPage,
                        totalPages: usersData.pagination.totalPages || 1,
                        totalRecords: usersData.pagination.totalRecords || 0,
                        recordsPerPage: usersData.pagination.limit || pageSize,
                        hasNextPage: usersData.pagination.hasNextPage || false,
                        hasPrevPage: usersData.pagination.hasPrevPage || false,
                    });
                }
            }
            if (cartsData.success) setAllCarts(cartsData.data || []);
            if (holdsData.success) setAllHolds(holdsData.data || []);
            if (quotationsData.data?.users)
                setAllQuotations(quotationsData.data.users || []);
        } catch (err: any) {
            setError("Failed to fetch data.");
            toast.error("Failed to fetch customer data");
        } finally {
            setLoading(false);
        }
    }, [isAdmin, currentPage, pageSize]);

    useEffect(() => {
        if (!authLoading) {
            fetchAllData();
        }
    }, [authLoading, fetchAllData]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Toggle row expansion
    const toggleRow = (userId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        }
        setExpandedRows(newExpanded);
    };

    // Get user's cart items
    const getUserCart = (userId: string): CartItem[] => {
        const userCart = allCarts.find((cart) => cart.userId === userId);
        return userCart?.cartItems || [];
    };

    // Get user's hold items
    const getUserHolds = (userId: string): HoldItem[] => {
        const userHold = allHolds.find((hold) => hold.userId === userId);
        return userHold?.holdItems || [];
    };

    // Get user's quotations
    const getUserQuotations = (userId: string): Quotation[] => {
        const userQuotations = allQuotations.find((q) => q.userId === userId);
        return userQuotations?.quotations || [];
    };

    // Handle hold action (approve/reject)
    const handleHoldAction = async (
        holdId: string,
        action: "approve" | "reject"
    ) => {
        setActionLoading(holdId);
        try {
            const endpoint =
                action === "approve"
                    ? `/diamonds/hold/${holdId}/approve`
                    : `/diamonds/hold/${holdId}/reject`;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );
            const data = await res.json();

            if (res.ok) {
                toast.success(
                    `Hold ${action === "approve" ? "approved" : "rejected"} successfully`
                );
                await fetchAllData();
            } else {
                toast.error(data.message || `Failed to ${action} hold`);
            }
        } catch (err: any) {
            toast.error("Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    // Handle quotation action (approve/reject)
    const handleQuotationAction = async (
        quotationId: string,
        action: "approve" | "reject"
    ) => {
        setActionLoading(quotationId);
        try {
            const endpoint =
                action === "approve"
                    ? `/quotations/${quotationId}/approve`
                    : `/quotations/${quotationId}/reject`;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            const data = await res.json();

            if (res.ok) {
                toast.success(
                    `Enquiry ${action === "approve" ? "closed" : "rejected"} successfully`
                );
                await fetchAllData();
            } else {
                toast.error(data.message || `Failed to ${action} enquiry`);
            }
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

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    // Calculate stats
    const totalUsers = pagination.totalRecords || users.length;
    const totalCarts = allCarts.reduce(
        (sum, cart) => sum + cart.cartItems.length,
        0
    );
    const totalHolds = allHolds.reduce(
        (sum, hold) => sum + hold.holdItems.length,
        0
    );
    const pendingHolds = allHolds.reduce(
        (sum, hold) =>
            sum +
            hold.holdItems.filter((item) => item.holdItem.status === "pending")
                .length,
        0
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-medium">Customer Management</h1>
                <Button
                    onClick={fetchAllData}
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
                        <BreadcrumbPage>Customer Management</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Stats Cards */}
            <div className="flex items-center justify-start gap-5 my-10">
                <StatsCard
                    icon={User}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-400/20"
                    label="Total Customers"
                    value={loading ? "..." : totalUsers}
                    subtext="Registered users"
                />

                {/* <StatsCard
                    icon={ShoppingCart}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-400/20"
                    label="Items in Cart"
                    value={loading ? "..." : totalCarts}
                    subtext="Across all users"
                /> */}

                <StatsCard
                    icon={Hand}
                    iconColor="text-orange-500"
                    iconBgColor="bg-orange-400/20"
                    label="Pending Holds"
                    value={loading ? "..." : pendingHolds}
                    subtext="Awaiting approval"
                />

                <StatsCard
                    icon={FileText}
                    iconColor="text-purple-500"
                    iconBgColor="bg-purple-400/20"
                    label="Total Holds"
                    value={loading ? "..." : totalHolds}
                    subtext="All hold requests"
                />
            </div>

            {/* Users Table */}
            <div className="rounded-lg border bg-white shadow-sm relative">
                <div className="overflow-x-auto">
                    <Table className="w-full" style={{ minWidth: '1800px' }}>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="text-xs text-center font-medium text-gray-700 px-4" style={{ width: '60px' }}>
                                Sr
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '150px' }}>
                                Name
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '130px' }}>
                                Username
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '200px' }}>
                                Email
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '130px' }}>
                                Phone
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '150px' }}>
                                Company
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '140px' }}>
                                Business Type
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '120px' }}>
                                VAT Number
                            </TableHead>
                            <TableHead className="text-xs text-left font-medium text-gray-700 px-4" style={{ width: '180px' }}>
                                Address
                            </TableHead>
                            <TableHead className="text-xs text-center font-medium text-gray-700 px-4" style={{ width: '100px' }}>
                                Cart Items
                            </TableHead>
                            <TableHead className="text-xs text-center font-medium text-gray-700 px-4" style={{ width: '100px' }}>
                                Hold Items
                            </TableHead>
                            <TableHead className="text-xs text-center font-medium text-gray-700 px-4" style={{ width: '80px' }}>
                                View
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={12}
                                    className="text-center py-12 text-gray-500"
                                >
                                    <User className="mx-auto h-8 w-8 text-gray-300" />
                                    <span>No customers found.</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => {
                                const isExpanded = expandedRows.has(user._id);
                                const cartItems = getUserCart(user._id);
                                const holdItems = getUserHolds(user._id);
                                const quotations = getUserQuotations(user._id);
                                const serialNumber = (currentPage - 1) * pageSize + index + 1;

                                return (
                                    <React.Fragment key={user._id}>
                                        <TableRow className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <TableCell className="text-center text-sm font-medium px-4">
                                                {serialNumber}
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                {user.customerData
                                                    ? `${user.customerData.firstName || ""} ${user.customerData.lastName || ""}`.trim() || "-"
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                {user.username}
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                {user.customerData?.countryCode && user.customerData?.phoneNumber
                                                    ? `${user.customerData.countryCode} ${user.customerData.phoneNumber}`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                <div className="truncate" title={user.customerData?.companyName || "-"}>
                                                    {user.customerData?.companyName || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                <div className="truncate" title={user.customerData?.businessType || "-"}>
                                                    {user.customerData?.businessType || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                {user.customerData?.vatNumber || "-"}
                                            </TableCell>
                                            <TableCell className="text-sm px-4">
                                                <div className="truncate" title={
                                                    user.customerData?.address
                                                        ? [
                                                            user.customerData.address.city,
                                                            user.customerData.address.state,
                                                            user.customerData.address.country
                                                        ].filter(Boolean).join(", ") || "-"
                                                        : "-"
                                                }>
                                                    {user.customerData?.address
                                                        ? [
                                                            user.customerData.address.city,
                                                            user.customerData.address.state,
                                                            user.customerData.address.country
                                                        ].filter(Boolean).join(", ") || "-"
                                                        : "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold px-4">
                                                {cartItems.length}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold px-4">
                                                {holdItems.length}
                                            </TableCell>
                                            <TableCell className="text-center px-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleRow(user._id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expanded Row Content */}
                                        {isExpanded && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={12}
                                                    className="bg-gray-50 p-6"
                                                >
                                                    <div className="space-y-6">
                                                        {/* Cart Items */}
                                                        <div>
                                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                                <ShoppingCart className="h-5 w-5 text-green-600" />
                                                                Cart Items ({cartItems.length})
                                                            </h3>
                                                            {cartItems.length === 0 ? (
                                                                <p className="text-sm text-gray-500">
                                                                    No items in cart
                                                                </p>
                                                            ) : (
                                                                <div className="rounded-lg border bg-white overflow-hidden">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow className="bg-gray-100">
                                                                                <TableHead className="text-xs px-4">Certificate No.</TableHead>
                                                                                <TableHead className="text-xs px-4">Shape</TableHead>
                                                                                <TableHead className="text-xs px-4">Size (ct)</TableHead>
                                                                                <TableHead className="text-xs px-4">Color</TableHead>
                                                                                <TableHead className="text-xs px-4">Clarity</TableHead>
                                                                                <TableHead className="text-xs px-4">Price</TableHead>
                                                                                <TableHead className="text-xs px-4">Added At</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {cartItems.map((item) => (
                                                                                <TableRow key={item.cartItem._id}>
                                                                                    <TableCell className="text-sm flex items-center gap-2 px-4">
                                                                                        {item.diamond.certificateNumber}
                                                                                        <EyeIcon
                                                                                            size={15}
                                                                                            className="cursor-pointer"
                                                                                            onClick={() => router.push(`/${item.diamond.certificateNumber}`)}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.shape}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.size}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.color}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.clarity}</TableCell>
                                                                                    <TableCell className="text-sm font-semibold px-4">${item.diamond.price.toLocaleString()}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{formatDate(item.cartItem.addedAt)}</TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Hold Items */}
                                                        <div>
                                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                                <Hand className="h-5 w-5 text-orange-600" />
                                                                Hold Items ({holdItems.length})
                                                            </h3>
                                                            {holdItems.length === 0 ? (
                                                                <p className="text-sm text-gray-500">No items on hold</p>
                                                            ) : (
                                                                <div className="rounded-lg border bg-white overflow-hidden">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow className="bg-gray-100">
                                                                                <TableHead className="text-xs px-4">Certificate No.</TableHead>
                                                                                <TableHead className="text-xs px-4">Shape</TableHead>
                                                                                <TableHead className="text-xs px-4">Size (ct)</TableHead>
                                                                                <TableHead className="text-xs px-4">Color</TableHead>
                                                                                <TableHead className="text-xs px-4">Clarity</TableHead>
                                                                                <TableHead className="text-xs px-4">Price</TableHead>
                                                                                <TableHead className="text-xs px-4">Status</TableHead>
                                                                                <TableHead className="text-xs px-4">Created At</TableHead>
                                                                                <TableHead className="text-xs text-center px-4">Actions</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {holdItems.map((item) => (
                                                                                <TableRow key={item.holdItem._id}>
                                                                                    <TableCell className="text-sm flex items-center gap-2 px-4">
                                                                                        {item.diamond.certificateNumber}
                                                                                        <EyeIcon
                                                                                            size={15}
                                                                                            className="cursor-pointer"
                                                                                            onClick={() => router.push(`/${item.diamond.certificateNumber}`)}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.shape}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.size}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.color}</TableCell>
                                                                                    <TableCell className="text-sm px-4">{item.diamond.clarity}</TableCell>
                                                                                    <TableCell className="text-sm font-semibold px-4">${item.diamond.price.toLocaleString()}</TableCell>
                                                                                    <TableCell className="px-4">
                                                                                        <span className={`inline-flex items-center gap-2 px-2 py-0.5 text-xs rounded ${
                                                                                            item.holdItem.status === "pending" ? "text-orange-600 bg-orange-50" :
                                                                                            item.holdItem.status === "approved" ? "text-green-700 bg-green-50" :
                                                                                            "text-red-700 bg-red-50"
                                                                                        }`}>
                                                                                            {item.holdItem.status === "pending" ? <Clock className="h-3 w-3" /> :
                                                                                             item.holdItem.status === "approved" ? <Check className="h-3 w-3" /> :
                                                                                             <X className="h-3 w-3" />}
                                                                                            {item.holdItem.status.toUpperCase()}
                                                                                        </span>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-sm px-4">{formatDate(item.holdItem.createdAt)}</TableCell>
                                                                                    <TableCell className="text-center px-4">
                                                                                        {item.holdItem.status === "pending" && (
                                                                                            <div className="flex items-center justify-center space-x-2">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => handleHoldAction(item.holdItem._id, "approve")}
                                                                                                    disabled={actionLoading === item.holdItem._id}
                                                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                                                                >
                                                                                                    <Check className="h-4 w-4 mr-1" />
                                                                                                    {actionLoading === item.holdItem._id ? "..." : "Approve"}
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => handleHoldAction(item.holdItem._id, "reject")}
                                                                                                    disabled={actionLoading === item.holdItem._id}
                                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                                                >
                                                                                                    <X className="h-4 w-4 mr-1" />
                                                                                                    {actionLoading === item.holdItem._id ? "..." : "Reject"}
                                                                                                </Button>
                                                                                            </div>
                                                                                        )}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            )}
                                                        </div>
{/* Enquiries */}
                                                        <div>
                                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                                <FileText className="h-5 w-5 text-purple-600" />
                                                                Enquiries ({quotations.length})
                                                            </h3>
                                                            {quotations.length === 0 ? (
                                                                <p className="text-sm text-gray-500">No enquiries</p>
                                                            ) : (
                                                                <div className="rounded-lg border bg-white overflow-hidden">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow className="bg-gray-100">
                                                                                <TableHead className="text-xs px-4">Certificate No.</TableHead>
                                                                                <TableHead className="text-xs px-4">Carat</TableHead>
                                                                                <TableHead className="text-xs px-4">Quote Price</TableHead>
                                                                                <TableHead className="text-xs px-4">Status</TableHead>
                                                                                <TableHead className="text-xs px-4">Submitted</TableHead>
                                                                                <TableHead className="text-xs text-center px-4">Actions</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {quotations.map((q) => (
                                                                                <TableRow key={q.quotationId}>
                                                                                    <TableCell className="text-sm flex items-center gap-2 px-4">
                                                                                        {q.certificateNo}
                                                                                        <EyeIcon
                                                                                            size={15}
                                                                                            className="cursor-pointer"
                                                                                            onClick={() => router.push(`/${q.certificateNo}`)}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-sm px-4">{q.carat} ct</TableCell>
                                                                                    <TableCell className="text-sm font-semibold px-4">${q.quotePrice.toLocaleString()}</TableCell>
                                                                                    <TableCell className="px-4">
                                                                                        <span className={`inline-flex items-center gap-2 px-2 py-0.5 text-xs rounded ${
                                                                                            q.status === "PENDING" ? "text-orange-600 bg-orange-50" :
                                                                                            q.status === "APPROVED" ? "text-green-700 bg-green-50" :
                                                                                            "text-red-700 bg-red-50"
                                                                                        }`}>
                                                                                            {q.status === "PENDING" ? <Clock className="h-3 w-3" /> :
                                                                                             q.status === "APPROVED" ? <Check className="h-3 w-3" /> :
                                                                                             <X className="h-3 w-3" />}
                                                                                            {q.status === "PENDING" ? "Pending" : q.status === "APPROVED" ? "Closed" : "Rejected"}
                                                                                        </span>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-sm px-4">{formatDate(q.submittedAt)}</TableCell>
                                                                                    <TableCell className="text-center px-4">
                                                                                        {q.status === "PENDING" && (
                                                                                            <div className="flex items-center justify-center">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => handleQuotationAction(q.quotationId, "approve")}
                                                                                                    disabled={actionLoading === q.quotationId}
                                                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                                                                >
                                                                                                    <Check className="h-4 w-4 mr-1" />
                                                                                                    {actionLoading === q.quotationId ? "..." : "Close"}
                                                                                                </Button>
                                                                                            </div>
                                                                                        )}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                </div>
                
                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                            <p className="text-sm text-gray-600">Loading customers...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {users.length > 0 && (
                <ClientPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[10, 20, 30, 50]}
                    showPageSizeSelector={true}
                />
            )}
        </div>
    );
};

const CustomerManagementPage = () => {
    return (
        <AdminGuard>
            <div className="min-h-screen py-8 px-4">
                <CustomerManagementContent />
            </div>
        </AdminGuard>
    );
};

export default CustomerManagementPage;