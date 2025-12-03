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
            
            // Backend returns data.cart.items which contains cartItem and diamond objects
            const items = cartResponse.data?.cart?.items || cartResponse.cart?.items || [];

            if (items.length > 0) {
                // Map the nested structure to our expected format
                const itemsWithDetails = items.map((item: any) => ({
                    _id: item.cartItem?._id || item._id,
                    diamondId: item.cartItem?.diamondId || item.diamondId,
                    certificateNumber: item.cartItem?.certificateNumber || item.certificateNumber,
                    addedAt: item.cartItem?.addedAt || item.addedAt,
                    diamond: item.diamond
                }));

                setCartItems(itemsWithDetails);
            } else {
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
            await clientDiamondAPI.removeFromCart(certificateNumber);
            toast.success("Item removed from cart");
            await fetchCartItems();
        } catch (error: any) {
            console.error("Error removing from cart:", error);
            toast.error(error.message || "Failed to remove item from cart");
        }
    };

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
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Certificate #</TableHead>
                            <TableHead>Shape</TableHead>
                            <TableHead>Carat</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Clarity</TableHead>
                            <TableHead>Polish</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Added Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">
                                    {item.certificateNumber}
                                </TableCell>
                                <TableCell>{item.diamond?.shape || "-"}</TableCell>
                                <TableCell>{item.diamond?.size ? `${item.diamond.size} ct` : "-"}</TableCell>
                                <TableCell>{item.diamond?.color || "-"}</TableCell>
                                <TableCell>{item.diamond?.clarity || "-"}</TableCell>
                                <TableCell>{item.diamond?.polish || "-"}</TableCell>
                                <TableCell>
                                    {item.diamond?.price ? `${item.diamond.price.toLocaleString()}` : "-"}
                                </TableCell>
                                <TableCell>
                                    {new Date(item.addedAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRemoveFromCart(item.certificateNumber)}
                                            className="h-8 w-8 p-0 border-black hover:bg-black hover:text-white"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Hold Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdItems.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">
                                    {item.certificateNumber}
                                </TableCell>
                                <TableCell>{item.diamond?.shape || "-"}</TableCell>
                                <TableCell>{item.diamond?.size || "-"} ct</TableCell>
                                <TableCell>{item.diamond?.color || "-"}</TableCell>
                                <TableCell>{item.diamond?.clarity || "-"}</TableCell>
                                <TableCell>{item.diamond?.cut || "-"}</TableCell>
                                <TableCell>
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
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRemoveFromHold(item.certificateNumber)}
                                            className="h-8 w-8 p-0 border-black hover:bg-black hover:text-white"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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