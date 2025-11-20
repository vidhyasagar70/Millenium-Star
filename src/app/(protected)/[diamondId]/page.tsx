"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/ui/container";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestQuoteModal } from "@/components/modals/request-quote-modal";
import { DiamondImage } from "@/components/diamond-image";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
    Trash2,
    Eye,
    Video,
    FileText,
    Gem,
    Shield,
    Award,
    MapPin,
} from "lucide-react";
import axios from "axios";
import DiamondCertificate from "@/components/media/DiamondCertificate ";
import DiamondVideo from "@/components/media/DiamondVideo";

interface Diamond {
    rapList: number;
    _id: string;
    certificateNumber: string;
    shape: string;
    size: number;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescenceColor: string;
    laboratory: string;
    price: number;
    discount?: number;
    isAvailable: boolean;
    measurements?: {
        length: number;
        width: number;
        depth: number;
    };
    fancyColor: string;
    fancyColorOvertone: string;
    fancyColorIntensity: string;
    depth?: number;
    table?: number;
    girdle?: string;
    culet?: string;
    length?: number;
    width?: number;
    height?: number;
}

interface ApiResponse {
    data: Diamond[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    recordsPerPage: number;
}

interface FileUrls {
    images: string[];
    videos: string[];
    certificates: string[];
}

export default function DiamondDetailPage() {
    const params = useParams();
    const diamondId = params.diamondId as string;

    const [diamond, setDiamond] = useState<Diamond | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [fileUrls, setFileUrls] = useState<FileUrls>({
        images: [],
        videos: [],
        certificates: [],
    });
    const [fileLoading, setFileLoading] = useState<Record<string, boolean>>({});
    const [previewFile, setPreviewFile] = useState<{
        url: string;
        type: string;
    } | null>(null);

    const { isAdmin } = useAuth();

    useEffect(() => {
        if (diamondId) {
            fetchDiamond();
        }
    }, [diamondId]);

    useEffect(() => {
        if (diamond && isAdmin()) {
            fetchAllFiles();
        }
    }, [diamond]);

    const fetchDiamond = async () => {
        try {
            setLoading(true);
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/search?searchTerm=${diamondId}`;
            const response = await fetch(url, { credentials: "include" });

            if (!response.ok) {
                throw new Error("Failed to fetch diamond details");
            }

            const data: ApiResponse = await response.json();

            if (data.data && data.data.length > 0) {
                setDiamond(data.data[0]);
            } else {
                setError("Diamond not found");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllFiles = async () => {
        if (!diamond?._id) return;

        const fileTypes = ["images", "videos", "certificates"] as const;

        for (const fileType of fileTypes) {
            try {
                setFileLoading((prev) => ({ ...prev, [fileType]: true }));

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/${fileType}/${diamond._id}`,
                    {
                        withCredentials: true,
                    }
                );
                console.log(
                    `File URLs response: ${fileType}`,
                    response.data.data
                );

                if (response.data.status === 200) {
                    const urls = response.data.data[`${fileType}Urls`] || [];
                    setFileUrls((prev) => ({
                        ...prev,
                        [fileType]: urls,
                    }));
                }
            } catch (error) {
                console.error(`Error fetching ${fileType}:`, error);
                // Don't show error toast for file fetching as it's expected that some diamonds might not have files
            } finally {
                setFileLoading((prev) => ({ ...prev, [fileType]: false }));
            }
        }
    };

    const deleteFile = async (fileType: string, fileUrl: string) => {
        if (!diamond?._id) return;

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/delete/${fileType}/${diamond._id}`,
                { urls: [fileUrl] },
                { withCredentials: true }
            );

            if (response.data.status === 200) {
                // Remove the deleted file from the state
                setFileUrls((prev) => ({
                    ...prev,
                    [fileType]: prev[fileType as keyof FileUrls].filter(
                        (url) => url !== fileUrl
                    ),
                }));
                toast.success(`${fileType.slice(0, -1)} deleted successfully`);
            } else {
                throw new Error(`Failed to delete ${fileType.slice(0, -1)}`);
            }
        } catch (error) {
            console.error(`Error deleting ${fileType}:`, error);
            toast.error(`Failed to delete ${fileType.slice(0, -1)}`);
        }
    };

    const openPreview = (url: string, type: string) => {
        setPreviewFile({ url, type });
    };

    const closePreview = () => {
        setPreviewFile(null);
    };

    const renderFileList = (
        files: string[],
        fileType: string,
        icon: React.ReactNode
    ) => {
        return (
            <Card className="mt-4">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {icon}
                        {fileType.charAt(0).toUpperCase() + fileType.slice(1)} (
                        {files.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {fileLoading[fileType] ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : files.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No {fileType} available
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {files.map((url, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {icon}
                                        <span className="text-sm font-bold truncate max-w-[200px]">
                                            {fileType.slice(0, -1)} {index + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                openPreview(url, fileType)
                                            }
                                            className="h-8 w-8 p-0"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteFile(fileType, url)
                                            }
                                            className="h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const handleRequestQuote = () => {
        setIsQuoteModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Container>
                    <div className="py-8">
                        <Skeleton className="h-4 w-64 mb-6" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Skeleton className="h-96 w-full" />
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !diamond) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-600">
                        {error || "Diamond not found"}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        The diamond with ID "{diamondId}" could not be found.
                    </p>
                    <Button
                        onClick={() => window.history.back()}
                        className="mt-4"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const discountedPrice = diamond.discount
        ? diamond.price * (1 - diamond.discount / 100)
        : diamond.price;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Container>
                <div className="py-8">
                    {/* Diamond Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sticky top-30 ">
                        {/* Diamond Image/Visual */}
                        <div className="relative">
                            <div className="bg-transparent rounded-lg  sticky top-30">
                                <div className="aspect-square bg-transparent rounded-lg flex items-center justify-center">
                                    <DiamondImage
                                        certificateNumber={diamond._id}
                                        className="w-full shadow-2xl border-gray-500 rounded-lg overflow-hidden"
                                        clickable
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-10  mt-1  ">
                                    <DiamondCertificate
                                        certificateNumber={diamond._id}
                                        index={0}
                                    />
                                    <DiamondVideo
                                        certificateNumber={diamond._id}
                                        index={0}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Diamond Information */}
                        <div className="space-y-3">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {diamond.shape} Diamond
                                </h1>
                                <p className="text-gray-600">
                                    Certificate Number:{" "}
                                    {diamond.certificateNumber}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                        variant={
                                            diamond.isAvailable
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={""}
                                    >
                                        {diamond.isAvailable
                                            ? "Available"
                                            : "Unavailable"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {diamond.discount ? (
                                        <>
                                            <span className="text-2xl font-bold text-gray-600">
                                                ${diamond.price}
                                            </span>
                                            {/* <span className="text-lg text-gray-500 line-through">
                                                ${diamond.rapList}
                                            </span>
                                            <Badge variant="outline">
                                                {diamond.discount}% OFF
                                            </Badge> */}
                                        </>
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${diamond.price}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Specifications */}
                            <h1 className="text-lg font-semibold pl-1">
                                Specifications
                            </h1>
                            <Card className="py-3 px-0">
                                <CardContent className="py-0 px-0">
                                    <div className="flex flex-col text-base">
                                        <div className="flex justify-between px-5 items-center py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Carat:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.size} ct
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Color:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.color}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Clarity:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.clarity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Cut:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.cut}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Polish:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.polish}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Symmetry:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.symmetry}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Fluorescence Color:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.fluorescenceColor}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Fancy Color:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.fancyColor}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Fancy Color Intensity:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.fancyColorIntensity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Fancy Color Overtone:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.fancyColorOvertone}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Laboratory:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.laboratory}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Length:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.measurements?.length}{" "}
                                                mm
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Width:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.measurements?.width} mm
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                            <span className="text-gray-600 font-bold">
                                                Depth:
                                            </span>
                                            <span className="font-normal text-gray-400">
                                                {diamond.measurements?.depth} mm
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-gray-700 hover:bg-gray-900"
                                    disabled={!diamond.isAvailable}
                                    onClick={handleRequestQuote}
                                >
                                    {diamond.isAvailable
                                        ? "Request Quote"
                                        : "Not Available"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin File Management Panel */}
                {isAdmin() && (
                    <div className="mt-12">
                        <Separator className="mb-8" />
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="destructive"
                                    className="bg-red-100 text-red-800"
                                >
                                    ADMIN PANEL
                                </Badge>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    File Management
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    {renderFileList(
                                        fileUrls.images,
                                        "images",
                                        <Gem className="h-5 w-5 text-blue-500" />
                                    )}
                                </div>
                                <div>
                                    {renderFileList(
                                        fileUrls.videos,
                                        "videos",
                                        <Video className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                                <div>
                                    {renderFileList(
                                        fileUrls.certificates,
                                        "certificates",
                                        <FileText className="h-5 w-5 text-purple-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Preview Modal */}
                {previewFile && (
                    <div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={closePreview}
                    >
                        <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                            <button
                                onClick={closePreview}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
                                aria-label="Close preview"
                            >
                                <span className="text-2xl">✕</span>
                            </button>

                            <div onClick={(e) => e.stopPropagation()}>
                                {previewFile.type === "images" && (
                                    <img
                                        src={previewFile.url}
                                        alt="Preview"
                                        className="object-contain w-full h-full max-w-full max-h-full"
                                    />
                                )}
                                {previewFile.type === "videos" && (
                                    <video
                                        src={previewFile.url}
                                        controls
                                        className="max-w-full max-h-full"
                                        style={{
                                            maxWidth: "800px",
                                            maxHeight: "600px",
                                        }}
                                    />
                                )}
                                {previewFile.type === "certificates" && (
                                    <iframe
                                        src={previewFile.url}
                                        className="w-full h-full border-0"
                                        style={{
                                            minWidth: "600px",
                                            minHeight: "800px",
                                        }}
                                        title="Certificate Preview"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Learn More Section */}
                <div className="mt-12 mb-12 h-full flex flex-col justify-between text-center">
                    <p className="text-gray-600 mb-4">
                        Want to learn more about diamond quality and
                        characteristics?
                    </p>
                    <Button
                        variant="outline"
                        className="max-w-full mx-auto"
                        asChild
                    >
                        <a href="/diamond-knowledge">Learn about Diamonds</a>
                    </Button>
                </div>
            </Container>

            {/* Request Quote Modal */}
            <RequestQuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                diamond={diamond}
            />
        </div>
    );
}
