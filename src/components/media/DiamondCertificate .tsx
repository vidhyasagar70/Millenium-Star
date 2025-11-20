"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiamondCertificateProps {
    certificateNumber: string;
    index?: number;
    className?: string;
}

const DiamondCertificate = ({
    certificateNumber,
    index = 0,
    className,
}: DiamondCertificateProps) => {
    const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPdf, setIsPdf] = useState(false);

    // Function to check if URL is a PDF
    const checkIfPdf = (url: string): boolean => {
        const urlLower = url.toLowerCase();
        return urlLower.endsWith(".pdf") || urlLower.includes(".pdf");
    };

    // Function to check if URL is an image
    const checkIfImage = (url: string): boolean => {
        const urlLower = url.toLowerCase();
        const imageExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".bmp",
            ".svg",
        ];
        return imageExtensions.some(
            (ext) => urlLower.endsWith(ext) || urlLower.includes(ext)
        );
    };

    useEffect(() => {
        let isMounted = true;

        const fetchCertificateUrl = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/certificates/${certificateNumber}/`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();
                console.log(
                    "Certificate response for diamond",
                    certificateNumber,
                    ":",
                    data
                );

                if (isMounted) {
                    if (
                        data?.data?.certificatesUrls &&
                        Array.isArray(data.data.certificatesUrls)
                    ) {
                        const urls = data.data.certificatesUrls;
                        console.log(
                            "Found",
                            urls.length,
                            "certificate URLs for diamond",
                            certificateNumber
                        );

                        if (urls.length > index) {
                            const certUrl = urls[index];
                            console.log("Using certificate URL:", certUrl);
                            setCertificateUrl(certUrl);
                            setIsPdf(checkIfPdf(certUrl));
                        } else {
                            console.log("No certificate found at index", index);
                            setCertificateUrl(null);
                        }
                    } else {
                        console.log("No certificates found");
                        setCertificateUrl(null);
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to fetch certificate for",
                    certificateNumber,
                    ":",
                    error
                );
                setError(
                    error instanceof Error ? error.message : "Unknown error"
                );
                if (isMounted) {
                    setCertificateUrl(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchCertificateUrl();

        return () => {
            isMounted = false;
        };
    }, [certificateNumber, index]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="w-35 aspect-square bg-gray-200 animate-pulse flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
            </div>
        );
    }

    if (!certificateUrl || error) {
        return (
            <div className="w-35 aspect-square bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <FileText className="h-8 w-8 text-gray-400" />
            </div>
        );
    }

    return (
        <>
            {/* Certificate Thumbnail */}
            <div
                className={cn(
                    " aspect-square w-35  cursor-pointer hover:scale-105 transition-all duration-500 border  rounded-lg overflow-hidden bg-white relative shadow-xl border-gray-500",
                    className
                )}
                onClick={openModal}
            >
                {isPdf ? (
                    // PDF Thumbnail - Show a document icon with PDF label
                    <div className=" aspect-square flex flex-col items-center justify-center ">
                        <FileText className=" text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500 font-semibold">
                            PDF
                        </span>
                        <span className="text-xs text-gray-500 text-center px-2">
                            Certificate {index + 1}
                        </span>
                    </div>
                ) : (
                    // Image Thumbnail
                    <Image
                        src={certificateUrl}
                        alt={`Diamond Certificate ${index + 1}`}
                        width={300}
                        height={300}
                        className="object-cover aspect-square"
                        onError={(e) => {
                            console.error(
                                "Certificate image failed to load:",
                                certificateUrl,
                                "for diamond:",
                                certificateNumber
                            );
                            setError("Failed to load certificate image");
                        }}
                    />
                )}
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-[#00000082] flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
                        aria-label="Close modal"
                    >
                        <X size={32} />
                    </button>

                    {/* Certificate Viewer */}
                    <div
                        className="relative max-w-4xl max-h-[90vh] w-auto h-auto flex items-center justify-center"
                        onClick={closeModal}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full h-full"
                        >
                            {isPdf ? (
                                // PDF Viewer - Use iframe for PDF display
                                <iframe
                                    src={certificateUrl}
                                    className="w-full h-full border-0 bg-white rounded-lg"
                                    style={{
                                        minWidth: "800px",
                                        minHeight: "600px",
                                        maxWidth: "90vw",
                                        maxHeight: "90vh",
                                    }}
                                    title={`Diamond Certificate PDF ${
                                        index + 1
                                    }`}
                                />
                            ) : (
                                // Image Viewer
                                <Image
                                    alt={`Diamond Certificate ${index + 1}`}
                                    src={certificateUrl}
                                    className="w-full h-full border-0 bg-white rounded-lg object-contain"
                                    style={{
                                        minWidth: "600px",
                                        minHeight: "800px",
                                        maxWidth: "90vw",
                                        maxHeight: "90vh",
                                    }}
                                    height={800}
                                    width={600}
                                    title="Certificate Preview"
                                />
                            )}
                        </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-lg font-medium">
                            Diamond Certificate {isPdf ? "(PDF)" : "(Image)"}
                        </p>
                        <p className="text-sm text-gray-300">
                            Certificate: {certificateNumber}
                        </p>
                    </div>

                    {/* Download Button for PDF */}
                    {isPdf && (
                        <div className="absolute bottom-4 right-4">
                            <a
                                href={certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Open PDF
                            </a>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DiamondCertificate;
