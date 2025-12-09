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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Trash2 } from "lucide-react";
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

interface CartItem {
    cartItem: {
        diamondId: string;
        certificateNumber: string;
        addedAt: string;
        _id: string;
    };
    diamond: Diamond;
}

const MyCartPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [allCartItems, setAllCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/cart`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();

            if (data.success) {
                const items = data.data.items || [];
                setAllCartItems(items);
                updatePaginatedItems(items, currentPage, pageSize);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            toast.error("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    const updatePaginatedItems = (items: CartItem[], page: number, size: number) => {
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedItems = items.slice(startIndex, endIndex);
        
        setCartItems(paginatedItems);
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
        updatePaginatedItems(allCartItems, page, pageSize);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
        updatePaginatedItems(allCartItems, 1, size);
    };

    const handleRemoveFromCart = async (certificateNumbers: string[]) => {
        if (certificateNumbers.length === 0) {
            toast.error("Please select items to remove");
            return;
        }

        try {
            setRemoving(true);
            
            // Remove items one by one
            const removePromises = certificateNumbers.map(certNumber =>
                fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/cart/${certNumber}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                )
            );

            const responses = await Promise.all(removePromises);
            const allSuccess = responses.every(res => res.ok);

            if (allSuccess) {
                toast.success(`${certificateNumbers.length} item(s) removed from cart`);
                setSelectedItems([]);
                fetchCartItems();
            } else {
                toast.error("Some items could not be removed");
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
            toast.error("Failed to remove items");
        } finally {
            setRemoving(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(cartItems.map(item => item.diamond.certificateNumber));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (certificateNumber: string, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, certificateNumber]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== certificateNumber));
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

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
                            <h1 className="text-3xl font-medium">Your Cart</h1>
                            <Button
                                onClick={() => handleRemoveFromCart(selectedItems)}
                                disabled={removing || selectedItems.length === 0}
                                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
                            >
                                <Trash2 className="h-4 w-4 " />
                                {removing ? "Removing..." : "Remove Selected"}
                            </Button>
                        </div>

                        <Breadcrumb className="mb-6">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">HOME</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Your Cart</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Add some diamonds to your cart to see them here
                                </p>
                                <Button onClick={() => router.push("/inventory")}>
                                    Browse Inventory
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Desktop View */}
                                <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-100">
                                                    <TableHead className="text-xs font-semibold text-center w-[60px]">
                                                        <div className="flex items-center justify-center">
                                                            <Checkbox
                                                                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                                                onCheckedChange={handleSelectAll}
                                                                className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                                            />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[140px]">Certificate No.</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[100px]">Shape</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[100px]">Size (ct)</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[80px]">Color</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[80px]">Clarity</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[110px]">Price/Ct</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">Total Price</TableHead>
                                                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">Added At</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cartItems.map((item) => {
                                                    if (!item.diamond) return null;
                                                    const isSelected = selectedItems.includes(item.diamond.certificateNumber);
                                                    return (
                                                        <TableRow key={item.cartItem._id} className="hover:bg-gray-50">
                                                            <TableCell className="text-center py-4">
                                                                <div className="flex items-center justify-center">
                                                                    <Checkbox
                                                                        checked={isSelected}
                                                                        onCheckedChange={(checked) => 
                                                                            handleSelectItem(item.diamond.certificateNumber, checked as boolean)
                                                                        }
                                                                        className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                                                    />
                                                                </div>
                                                            </TableCell>
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
                                                            <TableCell className="text-sm text-center py-4">${item.diamond.pricePerCarat?.toLocaleString() || '0'}</TableCell>
                                                            <TableCell className="text-sm font-semibold text-center py-4">${item.diamond.price?.toLocaleString() || '0'}</TableCell>
                                                            <TableCell className="text-sm text-center py-4">{formatDate(item.cartItem.addedAt)}</TableCell>
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
                                                    <th className="text-xs font-semibold text-center px-2 py-2 w-12">
                                                        <div className="flex items-center justify-center">
                                                            <Checkbox
                                                                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setSelectedItems(cartItems.map(item => item.diamond.certificateNumber));
                                                                    } else {
                                                                        setSelectedItems([]);
                                                                    }
                                                                }}
                                                                className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="text-xs font-semibold text-left px-3 py-2">Certificate</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">Shape</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">Size</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">Color</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">Clarity</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">$/Ct</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">Total</th>
                                                    <th className="text-xs font-semibold text-center px-2 py-2">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item) => {
                                                    if (!item.diamond) return null;
                                                    const isSelected = selectedItems.includes(item.diamond.certificateNumber);
                                                    return (
                                                        <tr key={item.cartItem._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="text-center px-2 py-3">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={(checked) => 
                                                                        handleSelectItem(item.diamond.certificateNumber, checked as boolean)
                                                                    }
                                                                    className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                                                />
                                                            </td>
                                                            <td className="text-xs px-3 py-3">
                                                                <span 
                                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                                                    onClick={() => router.push(`/${item.diamond.certificateNumber}`)}
                                                                >
                                                                    {item.diamond.certificateNumber}
                                                                </span>
                                                            </td>
                                                            <td className="text-xs text-center px-2 py-3">{item.diamond.shape}</td>
                                                            <td className="text-xs text-center px-2 py-3">{item.diamond.size}</td>
                                                            <td className="text-xs text-center px-2 py-3">{item.diamond.color}</td>
                                                            <td className="text-xs text-center px-2 py-3">{item.diamond.clarity}</td>
                                                            <td className="text-xs text-center px-2 py-3">${item.diamond.pricePerCarat?.toLocaleString()}</td>
                                                            <td className="text-xs font-semibold text-center px-2 py-3">${item.diamond.price?.toLocaleString()}</td>
                                                            <td className="text-xs text-center px-2 py-3 whitespace-nowrap">{formatDate(item.cartItem.addedAt)}</td>
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
                        {allCartItems.length > 0 && (
                            <div className="md:mt-4 -mt-0">
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

export default MyCartPage;