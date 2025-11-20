"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DiamondImageProps {
    certificateNumber: string;
    className?: string;
    size?: number; // px, default 80
    clickable?: boolean; // for modal preview
}

const fallbackUrl = "/assets/hero-3.png";

export const DiamondImage: React.FC<DiamondImageProps> = ({
    certificateNumber,
    className,
    size = 10000000000,
    clickable = false,
}) => {
    const [imageUrl, setImageUrl] = useState<string>(fallbackUrl);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/images/${certificateNumber}/`,
            {
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                // console.log("Fetched diamond images:", data);
                if (
                    isMounted &&
                    data.data?.imagesUrls &&
                    Array.isArray(data.data.imagesUrls) &&
                    data.data.imagesUrls.length > 0
                ) {
                    // Try to get the highest quality image (usually the first one)
                    // console.log("Setting image URL:", data.data.imagesUrls[0]);
                    setImageUrl(data.data.imagesUrls[0]);
                } else {
                    // console.log("not Setting image URL:");
                    setImageUrl(fallbackUrl);
                }
            })
            .catch((err) => {
                setError("Failed to load image");
                setImageUrl(fallbackUrl);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [certificateNumber]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (isLoading) {
        return (
            <div
                className={cn("bg-white animate-pulse rounded", className)}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <>
            <Image
                src={imageUrl}
                alt={`Diamond ${certificateNumber}`}
                width={size}
                height={size}
                // Change from object-cover to object-contain to preserve aspect ratio
                className={cn(
                    "object-contain rounded",
                    clickable && "cursor-pointer",
                    className
                )}
                onClick={clickable ? openModal : undefined}
                onError={() => setImageUrl(fallbackUrl)}
                // Add quality settings for better image rendering
                quality={95}
                priority={false}
                // Prevent image optimization that might reduce quality
                unoptimized={false}
            />
            {clickable && isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <Image
                        src={imageUrl}
                        alt={`Diamond ${certificateNumber} Enlarged`}
                        width={600}
                        height={600}
                        className="object-contain rounded shadow-lg max-w-[90vw] max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                        onError={() => setImageUrl(fallbackUrl)}
                        quality={100}
                        priority={true}
                    />
                </div>
            )}
        </>
    );
};
