"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
    ShoppingCart,
    Hand,
    Trash2,
    RefreshCcw,
    Package,
} from "lucide-react";
import { clientDiamondAPI, CartItem, HoldItem } from "@/services/client-api";
import { ClientDiamond } from "@/types/client/diamond";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { InventoryGuard } from "@/components/auth/routeGuard";
import { UserStatusHandler } from "@/components/auth/statusGuard";

interface CartItemWithDetails extends CartItem {
    diamond?: ClientDiamond;
}

interface HoldItemWithDetails extends HoldItem {
    diamond?: ClientDiamond;
}

function CartAndHoldContent() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
    const [holdItems, setHoldItems] = useState<HoldItemWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCartItems, setSelectedCartItems] = useState<string[]>([]);
    const [cartPage, setCartPage] = useState(1);
    const [holdPage, setHoldPage] = useState(1);
    const [cartPageSize, setCartPageSize] = useState(10);
    const [holdPageSize, setHoldPageSize] = useState(10);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchCartItems(), fetchHoldItems()]);
        } catch (error: any) {
            console.error("Error fetching data:", error);
            
            // Check if error is authentication related
            if (error.message?.includes("401") || error.message?.toLowerCase().includes("unauthorized")) {
                toast.error("Session expired. Please login again.");
                router.push("/login");
                return;
            }
            
            toast.error(error.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchCartItems = async () => {
        try {
            const cartResponse: any = await clientDiamondAPI.getCart();
            
            console.log("Full Cart Response:", JSON.stringify(cartResponse, null, 2));
            
            // Backend returns data.items array with nested cartItem and diamond objects
            const items = cartResponse?.data?.items || [];

            console.log("Extracted items:", items);
            console.log("Items length:", items.length);

            if (items.length > 0) {
                // Map the nested structure to our expected format
                const itemsWithDetails = items.map((item: any) => {
                    console.log("Mapping item:", item);
                    return {
                        _id: item.cartItem._id,
                        diamondId: item.cartItem.diamondId,
                        certificateNumber: item.cartItem.certificateNumber,
                        addedAt: item.cartItem.addedAt,
                        diamond: item.diamond
                    };
                });

                console.log("Final Mapped Cart Items:", itemsWithDetails);

                setCartItems(itemsWithDetails);
            } else {
                console.log("No items found in cart");
                setCartItems([]);
            }
        } catch (error: any) {
            console.error("Error fetching cart:", error);
            setCartItems([]);
        }
    };

    const fetchHoldItems = async () => {
        try {
            const holdResponse: any = await clientDiamondAPI.getHoldItems();
            
            console.log("Hold Response:", holdResponse);
            
            // The getHoldItems returns the array directly (result.data from API)
            // Each item has: { holdItem: {...}, diamond: {...}, user: {...} }
            const items = Array.isArray(holdResponse) ? holdResponse : [];
            
            console.log("Hold Items:", items);
            
            if (items.length > 0) {
                // Map the nested structure to our expected format
                const itemsWithDetails = items.map((item: any) => ({
                    _id: item.holdItem._id,
                    diamondId: item.holdItem.diamondId,
                    certificateNumber: item.holdItem.certificateNumber,
                    userId: item.holdItem.userId,
                    status: item.holdItem.status,
                    rejectionReason: item.holdItem.rejectionReason,
                    createdAt: item.holdItem.createdAt,
                    updatedAt: item.holdItem.updatedAt,
                    __v: item.holdItem.__v,
                    diamond: item.diamond
                }));
                
                console.log("Mapped Hold Items:", itemsWithDetails);
                
                setHoldItems(itemsWithDetails);
            } else {
                setHoldItems([]);
            }
        } catch (error: any) {
            console.error("Error fetching hold items:", error);
            setHoldItems([]);
        }
    };

    const handleRemoveFromCart = async (certificateNumber: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/cart/${certificateNumber}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove item from cart");
            }

            toast.success("Item removed from cart");
            await fetchCartItems();
        } catch (error: any) {
            console.error("Error removing from cart:", error);
            toast.error(error.message || "Failed to remove item from cart");
        }
    };

    const handleBulkRemoveFromCart = async () => {
        if (selectedCartItems.length === 0) {
            toast.error("Please select items to remove");
            return;
        }

        try {
            setRemoving(true);
            let successCount = 0;
            let failedCount = 0;

            for (const certificateNumber of selectedCartItems) {
                try {
                    await handleRemoveFromCart(certificateNumber);
                    successCount++;
                } catch (error) {
                    failedCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} item(s) removed from cart`);
                setSelectedCartItems([]);
            }
            if (failedCount > 0) {
                toast.error(`Failed to remove ${failedCount} item(s)`);
            }
        } catch (error: any) {
            console.error("Error in bulk remove:", error);
            toast.error("Failed to remove items");
        } finally {
            setRemoving(false);
        }
    };

    const handleSelectAllCart = () => {
        if (selectedCartItems.length === paginatedCartItems.length) {
            setSelectedCartItems([]);
        } else {
            setSelectedCartItems(paginatedCartItems.map(item => item.certificateNumber));
        }
    };

    const handleSelectCartItem = (certificateNumber: string) => {
        setSelectedCartItems(prev => {
            if (prev.includes(certificateNumber)) {
                return prev.filter(cert => cert !== certificateNumber);
            } else {
                return [...prev, certificateNumber];
            }
        });
    };

    // Pagination logic
    const paginatedCartItems = cartItems.slice(
        (cartPage - 1) * cartPageSize,
        cartPage * cartPageSize
    );

    const paginatedHoldItems = holdItems.slice(
        (holdPage - 1) * holdPageSize,
        holdPage * holdPageSize
    );

    const cartTotalPages = Math.ceil(cartItems.length / cartPageSize);
    const holdTotalPages = Math.ceil(holdItems.length / holdPageSize);

    const handleRemoveFromHold = async (certificateNumber: string) => {
        try {
            await clientDiamondAPI.removeFromHold(certificateNumber);
            toast.success("Item removed from hold");
            await fetchHoldItems();
        } catch (error: any) {
            console.error("Error removing from hold:", error);
            toast.error(error.message || "Failed to remove item from hold");
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
        toast.success("Data refreshed");
    };

    const renderCartTable = () => {
        console.log("renderCartTable called");
        console.log("Loading:", loading);
        console.log("Cart items:", cartItems);
        console.log("Cart items length:", cartItems.length);
        console.log("Paginated cart items:", paginatedCartItems);
        console.log("Paginated cart items length:", paginatedCartItems.length);

        if (loading) {
            return (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            );
        }

        if (cartItems.length === 0) {
            return (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add diamonds to your cart to see them here</p>
                    <Button
                        onClick={() => router.push("/inventory")}
                        className="mt-6"
                    >
                        Browse Diamonds
                    </Button>
                </div>
            );
        }

        return (
            <div>
                <div className="flex items-center justify-end mb-4">
                    <Button
                        onClick={handleBulkRemoveFromCart}
                        disabled={selectedCartItems.length === 0 || removing}
                        className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
                        size="sm"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove Selected
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCartItems.length === paginatedCartItems.length && paginatedCartItems.length > 0}
                                            onChange={handleSelectAllCart}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                    </div>
                                </TableHead>
                                <TableHead>Certificate #</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Lab</TableHead>
                                <TableHead>Shape</TableHead>
                                <TableHead>Carat</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Purity</TableHead>
                                <TableHead>Cut</TableHead>
                                <TableHead>Pol</TableHead>
                                <TableHead>Rap.($)</TableHead>
                                <TableHead>Length</TableHead>
                                <TableHead>Width</TableHead>
                                <TableHead>Depth</TableHead>
                                <TableHead>$/Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCartItems.map((item) => {
                                console.log("Rendering row for item:", item);
                                return (
                                <TableRow key={item._id}>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedCartItems.includes(item.certificateNumber)}
                                                onChange={() => handleSelectCartItem(item.certificateNumber)}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.certificateNumber || "-"}
                                    </TableCell>
                                    <TableCell>{item.diamond?.isAvailable || "-"}</TableCell>
                                    <TableCell>{item.diamond?.laboratory || "-"}</TableCell>
                                    <TableCell>{item.diamond?.shape || "-"}</TableCell>
                                    <TableCell>{item.diamond?.size ? item.diamond.size.toFixed(2) : "-"}</TableCell>
                                    <TableCell>{item.diamond?.color || "-"}</TableCell>
                                    <TableCell>{item.diamond?.clarity || "-"}</TableCell>
                                    <TableCell>{item.diamond?.cut || "-"}</TableCell>
                                    <TableCell>{item.diamond?.polish || "-"}</TableCell>
                                    <TableCell>{item.diamond?.rapList ? `$${item.diamond.rapList.toLocaleString()}` : "-"}</TableCell>
                                    <TableCell>{item.diamond?.measurements?.length ? item.diamond.measurements.length.toFixed(2) : "-"}</TableCell>
                                    <TableCell>{item.diamond?.measurements?.width ? item.diamond.measurements.width.toFixed(2) : "-"}</TableCell>
                                    <TableCell>{item.diamond?.measurements?.depth ? item.diamond.measurements.depth.toFixed(2) : "-"}</TableCell>
                                    <TableCell className="font-semibold">{item.diamond?.price ? `$${item.diamond.price.toLocaleString()}` : "-"}</TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
                {/* Cart Pagination */}
                {cartItems.length > cartPageSize && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rows per page:</span>
                            <select
                                value={cartPageSize}
                                onChange={(e) => {
                                    setCartPageSize(Number(e.target.value));
                                    setCartPage(1);
                                }}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Page {cartPage} of {cartTotalPages}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCartPage(1)}
                                    disabled={cartPage === 1}
                                >
                                    First
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCartPage(prev => Math.max(1, prev - 1))}
                                    disabled={cartPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCartPage(prev => Math.min(cartTotalPages, prev + 1))}
                                    disabled={cartPage === cartTotalPages}
                                >
                                    Next
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCartPage(cartTotalPages)}
                                    disabled={cartPage === cartTotalPages}
                                >
                                    Last
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderHoldTable = () => {
        if (loading) {
            return (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            );
        }

        if (holdItems.length === 0) {
            return (
                <div className="text-center py-12">
                    <Hand className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No items on hold</p>
                    <p className="text-gray-400 text-sm mt-2">Place diamonds on hold to reserve them</p>
                    <Button
                        onClick={() => router.push("/inventory")}
                        className="mt-6"
                    >
                        Browse Diamonds
                    </Button>
                </div>
            );
        }

        return (
            <div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Certificate #</TableHead>
                                <TableHead>Shape</TableHead>
                                <TableHead>Carat</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Clarity</TableHead>
                                <TableHead>Cut</TableHead>
                                <TableHead>Polish</TableHead>
                                <TableHead>Symmetry</TableHead>
                                <TableHead>Lab</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Hold Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedHoldItems.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">
                                        {item.certificateNumber}
                                    </TableCell>
                                    <TableCell>{item.diamond?.shape || "-"}</TableCell>
                                    <TableCell>{item.diamond?.size || "-"} ct</TableCell>
                                    <TableCell>{item.diamond?.color || "-"}</TableCell>
                                    <TableCell>{item.diamond?.clarity || "-"}</TableCell>
                                    <TableCell>{item.diamond?.cut || "-"}</TableCell>
                                    <TableCell>{item.diamond?.polish || "-"}</TableCell>
                                    <TableCell>{item.diamond?.symmetry || "-"}</TableCell>
                                    <TableCell>{item.diamond?.laboratory || "-"}</TableCell>
                                    <TableCell className="font-semibold">
                                        ${item.diamond?.price?.toLocaleString() || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.status === "pending"
                                                    ? "default"
                                                    : item.status === "approved"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                item.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : item.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Hold Pagination */}
                {holdItems.length > holdPageSize && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rows per page:</span>
                            <select
                                value={holdPageSize}
                                onChange={(e) => {
                                    setHoldPageSize(Number(e.target.value));
                                    setHoldPage(1);
                                }}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Page {holdPage} of {holdTotalPages}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setHoldPage(1)}
                                    disabled={holdPage === 1}
                                >
                                    First
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setHoldPage(prev => Math.max(1, prev - 1))}
                                    disabled={holdPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setHoldPage(prev => Math.min(holdTotalPages, prev + 1))}
                                    disabled={holdPage === holdTotalPages}
                                >
                                    Next
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setHoldPage(holdTotalPages)}
                                    disabled={holdPage === holdTotalPages}
                                >
                                    Last
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Container>
                <div className="py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                My Cart & Hold Items
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage your cart and hold requests
                            </p>
                        </div>
                        <Button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <RefreshCcw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>

                    {/* Cart Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ShoppingCart className="w-5 h-5" />
                                Cart Items ({cartItems.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>{renderCartTable()}</CardContent>
                    </Card>

                    {/* Hold Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Hand className="w-5 h-5" />
                                Hold Items ({holdItems.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>{renderHoldTable()}</CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}

export default function CartAndHoldPage() {
    return (
        <InventoryGuard>
            <UserStatusHandler>
                <CartAndHoldContent />
            </UserStatusHandler>
        </InventoryGuard>
    );
}