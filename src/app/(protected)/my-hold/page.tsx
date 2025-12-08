"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EyeIcon, Hand, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/ui/container";
import { InventoryGuard } from "@/components/auth/routeGuard";
import { UserStatusHandler } from "@/components/auth/statusGuard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ClientPagination } from "@/components/inventory/client-pagination";

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

const MyHoldPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [holdItems, setHoldItems] = useState<HoldItem[]>([]);
    const [allHoldItems, setAllHoldItems] = useState<HoldItem[]>([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchHoldItems();
    }, []);

    const fetchHoldItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/hold`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();

            if (data.success) {
                const items = data.data || [];
                setAllHoldItems(items);
                updatePaginatedItems(items, currentPage, pageSize);
            }
        } catch (error) {
            console.error("Error fetching holds:", error);
            toast.error("Failed to load hold items");
        } finally {
            setLoading(false);
        }
    };

    const updatePaginatedItems = (items: HoldItem[], page: number, size: number) => {
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedItems = items.slice(startIndex, endIndex);
        
        setHoldItems(paginatedItems);
        setPagination({
            currentPage: page,
            totalPages: Math.ceil(items.length / size),
            totalRecords: items.length,
            recordsPerPage: size,
            hasNextPage: endIndex < items.length,
            hasPrevPage: page > 1,
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePaginatedItems(allHoldItems, page, pageSize);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
        updatePaginatedItems(allHoldItems, 1, size);
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Clock className="h-4 w-4 text-orange-500" />;
            case "approved":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "text-orange-600 bg-orange-50 border-orange-200";
            case "approved":
                return "text-green-600 bg-green-50 border-green-200";
            case "rejected":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (loading) {
        return (
            <InventoryGuard>
                <UserStatusHandler>
                    <div className="min-h-screen bg-gray-50 py-12">
                        <Container>
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
                    <Container className="max-w-[1800px]">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-medium">My Hold Requests</h1>
                        </div>

                        <Breadcrumb className="mb-6">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">HOME</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>My Hold</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        {holdItems.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <Hand className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No hold requests
                                </h3>
                                <p className="text-gray-600">
                                    You haven't requested to hold any diamonds yet
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop View */}
                                <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-100">
                                                    <TableHead className="text-xs font-semibold text-center min-w-[140px]">Certificate No.</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[100px]">Shape</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[100px]">Size (ct)</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[80px]">Color</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[80px]">Clarity</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">Total Price</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">Status</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">Requested At</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {holdItems.map((item) => {
                                                    if (!item.diamond) return null;
                                                    return (
                                                        <TableRow key={item.holdItem._id} className="hover:bg-gray-50">
                                                            <TableCell className="text-sm text-center py-4">
                                                                <span 
                                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                                                    onClick={() => router.push(`/${item.diamond.certificateNumber}`)}
                                                                >
                                                                    {item.diamond.certificateNumber || '-'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-center py-4">{item.diamond.shape || '-'}</TableCell>
                                                            <TableCell className="text-sm text-center py-4">{item.diamond.size || '-'}</TableCell>
                                                            <TableCell className="text-sm text-center py-4">{item.diamond.color || '-'}</TableCell>
                                                            <TableCell className="text-sm text-center py-4">{item.diamond.clarity || '-'}</TableCell>
                                                            <TableCell className="text-sm font-semibold text-center py-4">${item.diamond.price?.toLocaleString() || '0'}</TableCell>
                                                            <TableCell className="text-center py-4">
                                                                <div className="flex items-center justify-center">
                                                                    <span className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded border ${getStatusColor(item.holdItem.status)}`}>
                                                                        {getStatusIcon(item.holdItem.status)}
                                                                        {item.holdItem.status.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-center py-4">{formatDate(item.holdItem.createdAt)}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="text-xs font-semibold text-left px-3 py-2">Certificate No.</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Shape</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Size</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Color</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Clarity</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Price</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Status</th>
                                                    <th className="text-xs font-semibold text-center px-3 py-2">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {holdItems.map((item) => {
                                                    if (!item.diamond) return null;
                                                    return (
                                                        <tr key={item.holdItem._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="text-xs px-3 py-3">
                                                                <span 
                                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                                                    onClick={() => router.push(`/${item.diamond.certificateNumber}`)}
                                                                >
                                                                    {item.diamond.certificateNumber}
                                                                </span>
                                                            </td>
                                                            <td className="text-xs text-center px-3 py-3">{item.diamond.shape}</td>
                                                            <td className="text-xs text-center px-3 py-3">{item.diamond.size}</td>
                                                            <td className="text-xs text-center px-3 py-3">{item.diamond.color}</td>
                                                            <td className="text-xs text-center px-3 py-3">{item.diamond.clarity}</td>
                                                            <td className="text-xs font-semibold text-center px-3 py-3">${item.diamond.price?.toLocaleString()}</td>
                                                            <td className="text-center px-3 py-3">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${getStatusColor(item.holdItem.status)}`}>
                                                                    {getStatusIcon(item.holdItem.status)}
                                                                    {item.holdItem.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="text-xs text-center px-3 py-3 whitespace-nowrap">{formatDate(item.holdItem.createdAt)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        {allHoldItems.length > 0 && (
                            <div className="mt-6">
                                <ClientPagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                    pageSizeOptions={[10, 20, 30, 50]}
                                    showPageSizeSelector={true}
                                    recordLabel="items"
                                />
                            </div>
                        )}
                    </Container>
                </div>
            </UserStatusHandler>
        </InventoryGuard>
    );
};

export default MyHoldPage;