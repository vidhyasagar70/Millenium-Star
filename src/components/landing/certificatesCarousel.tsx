"use client";

import Image from "next/image";
import React from "react";
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
        <div className="group bg-white border-gray-300 border-2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col min-w-sm">
            <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className="object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-110"
                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>
            <div className="p-6 text-center flex flex-col flex-grow">
                <h3 className="text-lg font-maven font-medium text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm font-maven mb-5 text-gray-600 flex-grow">
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
        <section className={cn("py-20 px-6 bg-[#F4F4F5]", className)}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1
                        className={`text-3xl sm:text-4xl lg:text-5xl font-semibold font-abhaya text-gray-900 mb-4`}
                    >
                        Do More With Ease
                    </h1>
                    <p
                        className={`mt-4 text-lg text-gray-600 max-w-2xl mx-auto font-maven`}
                    >
                        Our platform is designed to simplify your diamond buying
                        experience, making it easier than ever to find the
                        perfect diamond for you.
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                        watchDrag: false,
                    }}
                    className="w-full "
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
        </section>
    );
};

export default CertificatesCarousel;
