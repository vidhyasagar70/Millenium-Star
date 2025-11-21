"use client";

import Image from "next/image";
import React, { useState } from "react";
import img1 from "@/../public/assets/inventory1.png";
import img2 from "@/../public/assets/search1.png";
import img3 from "@/../public/assets/certificate.jpg";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const certificateData = [
    {
        id: 1,
        image: img1,
        title: "Search Diamonds",
        description:
            "Browse through our extensive collection of certified diamonds. Use advanced filters to find diamonds by cut, clarity, color, and carat weight that match your exact specifications.",
        alt: "Diamond search functionality",
    },
    {
        id: 2,
        image: img2,
        title: "Explore Inventory",
        description:
            "Access our comprehensive diamond inventory with real-time availability. View detailed specifications, high-resolution images, and certification details for every diamond.",
        alt: "Diamond inventory exploration",
    },
    {
        id: 3,
        image: img3,
        title: "View Details",
        description:
            "Find everything you need to know about the diamond. Access videos, images, certificates and specifications within seconds.",
        alt: "Diamond detail viewing",
    },
];

// Mobile Carousel Component
const MobileCarousel = ({ children, length }: { children: React.ReactNode[]; length: number }) => {
    const [current, setCurrent] = useState(0);

    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX = e.changedTouches[0].screenX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > minSwipeDistance) {
            setCurrent((prev) => (prev + 1) % length);
        } else if (touchEndX - touchStartX > minSwipeDistance) {
            setCurrent((prev) => (prev - 1 + length) % length);
        }
    };

    return (
        <div className="w-full relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="w-full flex justify-center items-center">
                {children[current]}
            </div>

            {/* Previous Button */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2">
                <button
                    className="bg-white/80 rounded-full p-1 shadow hover:bg-white"
                    onClick={() => setCurrent((prev) => (prev - 1 + length) % length)}
                    aria-label="Previous"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
            {/* Next Button */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <button
                    className="bg-white/80 rounded-full p-1 shadow hover:bg-white"
                    onClick={() => setCurrent((prev) => (prev + 1) % length)}
                    aria-label="Next"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

interface CertificateCardProps {
    title: string;
    imageUrl: any;
    description?: string;
    alt: string;
}

const CertificateCard = ({
    title,
    imageUrl,
    description,
    alt,
}: CertificateCardProps) => {
    return (
        <div className="group bg-white border-gray-300 border-2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col w-full">
            <div className="aspect-[4/3] relative overflow-hidden w-full">
                <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>
            <div className="p-6 text-center flex flex-col flex-grow">
                <h3 className="text-lg font-maven font-medium text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm font-maven mb-5 text-gray-600 flex-grow leading-relaxed">
                    {description}
                </p>
                <a href="/inventory" className="mt-auto">
                    <Button
                        variant={"default"}
                        className="w-full bg-[#282828] hover:bg-[#1a1a1a] text-white font-maven uppercase text-sm rounded-full transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg"
                    >
                        Explore Inventory
                    </Button>
                </a>
            </div>
        </div>
    );
};

const CertificatesCarousel = ({ className }: { className?: string }) => {
    return (
        <section className={cn("py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#F4F4F5]", className)}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h1
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold font-abhaya text-gray-900 mb-3 sm:mb-4`}
                    >
                        Do More With Ease
                    </h1>
                    <p
                        className={`mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-maven px-2`}
                    >
                        Our platform is designed to simplify your diamond buying
                        experience, making it easier than ever to find the
                        perfect diamond for you.
                    </p>
                </div>

                {/* Mobile Carousel View */}
                <div className="block md:hidden">
                    <MobileCarousel length={certificateData.length}>
                        {certificateData.map((certificate) => (
                            <div key={certificate.id} className="max-w-sm mx-auto px-2">
                                <CertificateCard
                                    title={certificate.title}
                                    imageUrl={certificate.image}
                                    description={certificate.description}
                                    alt={certificate.alt}
                                />
                            </div>
                        ))}
                    </MobileCarousel>
                </div>

                {/* Desktop Carousel View */}
                <div className="hidden md:block">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                            watchDrag: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-8">
                            {certificateData.map((certificate) => (
                                <CarouselItem
                                    key={certificate.id}
                                    className="pl-8 md:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="p-1 h-full">
                                        <CertificateCard
                                            title={certificate.title}
                                            imageUrl={certificate.image}
                                            description={certificate.description}
                                            alt={certificate.alt}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {/* <CarouselPrevious />
                        <CarouselNext /> */}
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default CertificatesCarousel;