"use client";

import React, { useState, useEffect } from "react";
import { X, Play, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiamondVideoProps {
    certificateNumber: string;
    index?: number;
    className?: string;
}

const DiamondVideo = ({
    certificateNumber,
    index = 0,
    className,
}: DiamondVideoProps) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchVideoUrl = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/videos/${certificateNumber}/`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();
                console.log(
                    "Video response for diamond",
                    certificateNumber,
                    ":",
                    data
                );

                if (isMounted) {
                    if (
                        data?.data?.videosUrls &&
                        Array.isArray(data.data.videosUrls)
                    ) {
                        const urls = data.data.videosUrls;
                        console.log(
                            "Found",
                            urls.length,
                            "video URLs for diamond",
                            certificateNumber
                        );

                        if (urls.length > index) {
                            const vidUrl = urls[index];
                            console.log("Using video URL:", vidUrl);
                            setVideoUrl(vidUrl);
                        } else {
                            console.log("No video found at index", index);
                            setVideoUrl(null);
                        }
                    } else {
                        console.log("No videos found");
                        setVideoUrl(null);
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to fetch video for",
                    certificateNumber,
                    ":",
                    error
                );
                setError(
                    error instanceof Error ? error.message : "Unknown error"
                );
                if (isMounted) {
                    setVideoUrl(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchVideoUrl();

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
                <Video className="h-8 w-8 text-gray-400" />
            </div>
        );
    }

    if (!videoUrl || error) {
        return (
            <div className=" w-35 aspect-square bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Video className="h-8 w-8 text-gray-400" />
            </div>
        );
    }

    return (
        <>
            {/* Video Thumbnail */}
            <div
                className={cn(
                    " w-35 aspect-square flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-500  relative group shadow-xl border boprder-gray-500 rounded-lg overflow-hidden bg-black",
                    className
                )}
                onClick={openModal}
            >
                <video
                    src={videoUrl}
                    autoPlay
                    className="max-w-35 aspect-square"
                />
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

                    {/* Video Player */}
                    <div
                        className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={closeModal}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                className="max-w-full max-h-full"
                                style={{
                                    maxWidth: "800px",
                                    maxHeight: "600px",
                                }}
                            />
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-lg font-medium">Diamond Video</p>
                        <p className="text-sm text-gray-300">
                            Certificate: {certificateNumber}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default DiamondVideo;
