"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClientDiamond } from "@/types/client/diamond";
import { useRouter } from "next/navigation";
import { DiamondImage } from "../diamond-image";
import { ClientPagination } from "./client-pagination";


interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ClientDiamondGridProps {
    diamonds: ClientDiamond[];
    loading: boolean;
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    isAuthenticated?: boolean;
    onLoginClick?: () => void;
}

export function ClientDiamondGrid({
    diamonds,
    loading,
    pagination,
    onPageChange,
    onPageSizeChange,
    isAuthenticated = false,
    onLoginClick = () => {},
}: ClientDiamondGridProps) {
    const router = useRouter();

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                        <CardContent className="p-2 sm:p-4">
                            <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                            <div className="flex flex-col gap-1.5">
                                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 sm:h-6 bg-gray-200 rounded w-full mt-1"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (diamonds.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                    <div className="text-4xl mb-4">💎</div>
                    <p className="text-lg font-medium">No diamonds found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="space-y-6">
            {/* Diamond Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {diamonds.map((diamond: any) => (
                    <Card
                        key={diamond._id}
                        className="hover:shadow-lg cursor-pointer transition-all duration-200 border h-full border-gray-200"
                        onClick={() =>
                            router.push(`/${diamond.certificateNumber}`)
                        }
                    >
                        <CardContent className="p-2 sm:p-4">
                            {/* Image Placeholder */}
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                <DiamondImage
                                    certificateNumber={diamond._id}
                                    className="w-full aspect-square object-cover"
                                />
                            </div>

                            {/* Diamond Details */}
                            <div className="flex flex-col gap-1.5 sm:gap-3">
                                {/* Color and Shape */}
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <div className="font-medium text-gray-700 truncate">
                                        <span className="hidden sm:inline">Color: </span>
                                        <span className="font-bold">
                                            {diamond.color ||
                                                diamond["Color"] ||
                                                "-"}
                                        </span>
                                    </div>
                                    <div className="font-medium text-gray-700 truncate">
                                        <span className="font-bold">
                                            {diamond.shape ||
                                                diamond["Shape"] ||
                                                "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Price - Only show if authenticated */}
                                {isAuthenticated && (
                                    <div className="text-center">
                                        <div className="text-sm sm:text-lg font-bold text-gray-900">
                                            {formatPrice(diamond.price || 0)}
                                        </div>
                                    </div>
                                )}

                                {/* Certificate Info - Only show if authenticated */}
                                {isAuthenticated && (
                                    <div className="text-[10px] sm:text-xs text-gray-500 text-center truncate">
                                        ID: {diamond.certificateNumber}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <ClientPagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={[10, 20, 30, 50, 100]}
                showPageSizeSelector={!!onPageSizeChange}
            />
        </div>
    );
}