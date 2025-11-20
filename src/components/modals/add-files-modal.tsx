"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import { DiamondType } from "@/lib/validations/diamond-schema";
import { Loader2 } from "lucide-react";

interface AddFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    diamond: DiamondType | null;
}

interface FileUrlCounts {
    images: number;
    videos: number;
    certificates: number;
    loading: boolean;
    error?: string;
}

export function AddFilesModal({
    isOpen,
    onClose,
    onSuccess,
    diamond,
}: AddFilesModalProps) {
    const [urlCounts, setUrlCounts] = useState<FileUrlCounts>({
        images: 0,
        videos: 0,
        certificates: 0,
        loading: true,
    });

    useEffect(() => {
        if (!diamond?._id || !isOpen) {
            return;
        }

        const fetchFileUrls = async () => {
            setUrlCounts((prev) => ({
                ...prev,
                loading: true,
                error: undefined,
            }));

            try {
                // Fetch image URLs
                const imageResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/images/${diamond._id}/`,
                    {
                        credentials: "include",
                    }
                );
                const imageData = await imageResponse.json();
                const imageCount = imageData.data?.imagesUrls?.length || 0;

                // Fetch video URLs
                const videoResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/videos/${diamond._id}/`,
                    {
                        credentials: "include",
                    }
                );
                const videoData = await videoResponse.json();
                const videoCount = videoData.data?.videosUrls?.length || 0;

                // Fetch certificate URLs
                const certResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/certificates/${diamond._id}/`,
                    {
                        credentials: "include",
                    }
                );
                const certData = await certResponse.json();
                const certCount = certData.data?.certificatesUrls?.length || 0;

                setUrlCounts({
                    images: imageCount,
                    videos: videoCount,
                    certificates: certCount,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching file URLs:", error);
                setUrlCounts((prev) => ({
                    ...prev,
                    loading: false,
                    error: "Failed to load file information",
                }));
            }
        };

        fetchFileUrls();
    }, [diamond?._id, isOpen]);

    const handleUploadSuccess = () => {
        // Refresh the URL counts after successful upload
        if (diamond?._id) {
            const fetchUpdatedCounts = async () => {
                try {
                    const [imageRes, videoRes, certRes] = await Promise.all([
                        fetch(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/images/${diamond._id}/`,
                            {
                                credentials: "include",
                            }
                        ),
                        fetch(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/videos/${diamond._id}/`,
                            {
                                credentials: "include",
                            }
                        ),
                        fetch(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/certificates/${diamond._id}/`,
                            {
                                credentials: "include",
                            }
                        ),
                    ]);

                    const [imageData, videoData, certData] = await Promise.all([
                        imageRes.json(),
                        videoRes.json(),
                        certRes.json(),
                    ]);

                    setUrlCounts({
                        images: imageData.data?.imagesUrls?.length || 0,
                        videos: videoData.data?.videosUrls?.length || 0,
                        certificates:
                            certData.data?.certificatesUrls?.length || 0,
                        loading: false,
                    });
                } catch (error) {
                    console.error("Error refreshing file counts:", error);
                }
            };

            fetchUpdatedCounts();
        }

        if (onSuccess) {
            onSuccess();
        }
    };

    if (!diamond) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Add Files for Diamond {diamond.certificateNumber}
                    </DialogTitle>
                    <DialogDescription>
                        Upload images, videos, and certificates for this
                        diamond. File uploaders are disabled if files already
                        exist.
                    </DialogDescription>
                </DialogHeader>

                {urlCounts.loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading file information...</span>
                    </div>
                ) : urlCounts.error ? (
                    <div className="text-red-500 text-center py-4">
                        {urlCounts.error}
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Images Uploader */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Images</h3>
                                <span className="text-sm text-gray-500">
                                    Current files: {urlCounts.images}
                                </span>
                            </div>
                            {urlCounts.images >= 1 ? (
                                <div className="p-4 bg-gray-100 rounded-lg border">
                                    <p className="text-sm text-gray-600">
                                        Image upload is disabled. Files already
                                        exist for this diamond.
                                    </p>
                                </div>
                            ) : (
                                <FileUploader
                                    fileType="images"
                                    certificateNumber={diamond._id}
                                    onUploadSuccess={handleUploadSuccess}
                                    maxFiles={1}
                                    maxSizePerFile={2}
                                />
                            )}
                        </div>

                        {/* Videos Uploader */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Videos</h3>
                                <span className="text-sm text-gray-500">
                                    Current files: {urlCounts.videos}
                                </span>
                            </div>
                            {urlCounts.videos >= 1 ? (
                                <div className="p-4 bg-gray-100 rounded-lg border">
                                    <p className="text-sm text-gray-600">
                                        Video upload is disabled. Files already
                                        exist for this diamond.
                                    </p>
                                </div>
                            ) : (
                                <FileUploader
                                    fileType="videos"
                                    certificateNumber={diamond._id}
                                    onUploadSuccess={handleUploadSuccess}
                                    maxFiles={1}
                                    maxSizePerFile={2}
                                />
                            )}
                        </div>

                        {/* Certificates Uploader */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Certificates</h3>
                                <span className="text-sm text-gray-500">
                                    Current files: {urlCounts.certificates}
                                </span>
                            </div>
                            {urlCounts.certificates >= 1 ? (
                                <div className="p-4 bg-gray-100 rounded-lg border">
                                    <p className="text-sm text-gray-600">
                                        Certificate upload is disabled. Files
                                        already exist for this diamond.
                                    </p>
                                </div>
                            ) : (
                                <FileUploader
                                    fileType="certificates"
                                    certificateNumber={diamond._id}
                                    onUploadSuccess={handleUploadSuccess}
                                    maxFiles={1}
                                    maxSizePerFile={2}
                                />
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
