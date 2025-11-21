"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useEffect } from "react";
import cert1 from "../../../public/assets/cert-1.jpg";
import cert2 from "../../../public/assets/igi-cert.jpg";
import cert3 from "../../../public/assets/hrd-cert2.jpg";
import img1 from "../../../public/assets/Marquee/client_1.png";
import img2 from "../../../public/assets/Marquee/client_2.png";
import img3 from "../../../public/assets/Marquee/client_3.png";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { Button } from "../ui/button";
import Marquee from "react-fast-marquee";

// Simple mobile carousel implementation
const MobileCarousel = ({ children, length }: { children: React.ReactNode[]; length: number }) => {
    const [current, setCurrent] = useState(0);

    // Swipe support (optional, basic)
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
            <div className="absolute top-1/2 left-2 -translate-y-1/2">
                <button
                    className="bg-white/80 rounded-full p-1 shadow hover:bg-white"
                    onClick={() => setCurrent((prev) => (prev - 1 + length) % length)}
                    aria-label="Previous"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <button
                    className="bg-white/80 rounded-full p-1 shadow hover:bg-white"
                    onClick={() => setCurrent((prev) => (prev + 1) % length)}
                    aria-label="Next"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

// Certificate data array with expanded content
const certificateData = [
    {
        id: 2,
        image: cert2,
        title: "IGI CERTIFICATE",
        fullDescription:
            "IGI, established in 1975, is a major global gemological laboratory known for reliable diamond and gemstone grading. Popular in Asian and European markets, their certificates detail diamond quality using advanced technology. IGI is committed to innovation, offering comprehensive documentation for authenticity and characteristics.",
        alt: "IGI Certificate",
    },
    {
        id: 1,
        image: cert1,
        title: "GIA CERTIFICATE",
        fullDescription:
            "GIA certificates are the gold standard for diamond grading, detailing a diamond's quality based on the 4Cs (Color, Clarity, Cut, Carat Weight). Established in 1931, GIA is a nonprofit authority ensuring unbiased, accurate assessments through rigorous processes. Their certificates provide trusted authenticity and quality assurance for buyers and sellers globally.",
        alt: "GIA Certificate",
    },
    {
        id: 3,
        image: cert3,
        title: "HRD CERTIFICATE",
        fullDescription:
            "HRD Antwerp, a leading European gemological institute since 1973, issues highly respected diamond certificates. Renowned for rigorous scientific grading, HRD uses advanced techniques to assess a diamond's quality, origin, and treatment history. Their certificates offer comprehensive, secure, and verifiable documentation, preventing fraud in the diamond trade.",
        alt: "HRD Certificate",
    },
];

const DiamondCards = () => {
    const [expandedCards, setExpandedCards] = useState<{
        [key: number]: boolean;
    }>({});

    const toggleExpanded = (cardId: number) => {
        setExpandedCards((prev) => ({
            ...prev,
            [cardId]: !prev[cardId],
        }));
    };

    const truncateText = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + "...";
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h1
                        className={`text-3xl sm:text-4xl lg:text-5xl font-semibold font-abhaya text-gray-900 mb-4 `}
                    >
                        Certified Diamonds
                    </h1>
                    <p
                        className={`mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-maven`}
                    >
                        Understanding certified diamonds and grading standards
                        from the world's most trusted institutions
                    </p>
                    <Marquee autoFill loop={0}>
                        <Image
                            src={img1}
                            alt="Certificate1"
                            width={150}
                            height={100}
                            className="mx-10"
                        />
                        <Image
                            src={img2}
                            alt="Certificate2"
                            width={150}
                            height={100}
                            className="mx-10"
                        />
                        <Image
                            src={img3}
                            alt="Certificate3"
                            width={180}
                            height={100}
                            className="mx-10"
                        />
                    </Marquee>
                </div>

                {/* Mobile Carousel View */}
                <div className="block md:hidden">
                    <MobileCarousel length={certificateData.length}>
                        {certificateData.map((certificate) => {
                            const isExpanded = expandedCards[certificate.id];
                            return (
                                <div
                                    key={certificate.id}
                                    className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 ease-out overflow-hidden border border-gray-200 max-w-md mx-auto"
                                >
                                    {/* Certificate Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={certificate.image}
                                            alt={certificate.alt}
                                            fill
                                            priority
                                            quality={100}
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
                                    </div>
                                    {/* Card Content */}
                                    <div className="p-6 lg:p-8 transition-all duration-500 ease-out">
                                        <h2 className="text-xl text-center mb-4 font-maven text-gray-900 transition-all duration-300 ease-out group-hover:text-gray-700">
                                            {certificate.title}
                                        </h2>
                                        <div
                                            className={`text-gray-600 text-sm text-center leading-relaxed mb-6 font-maven transition-all duration-1000 ease-out max-w-sm ${
                                                isExpanded ? "max-h-96 opacity-100" : "max-h-24 opacity-90"
                                            }`}
                                        >
                                            <div
                                                className={`transition-all duration-500 ease-out ${
                                                    isExpanded ? "transform translate-y-0" : "transform -translate-y-1"
                                                }`}
                                            >
                                                {isExpanded ? (
                                                    <div className="whitespace-pre-line animate-in fade-in duration-500">
                                                        {certificate.fullDescription}
                                                    </div>
                                                ) : (
                                                    <p className="animate-in fade-in duration-300">
                                                        {truncateText(certificate.fullDescription, 150)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between items-center space-y-4">
                                            <button
                                                className={`px-4 py-2 text-center flex items-center justify-center text-black/80 font-medium font-maven transition-all duration-300 ease-out hover:text-black group-hover:scale-105 rounded-md hover:bg-gray-50`}
                                                onClick={() => toggleExpanded(certificate.id)}
                                            >
                                                <span className="transition-all duration-300 ease-out">
                                                    {isExpanded ? "View Less" : "View More"}
                                                </span>
                                                <svg
                                                    className={`ml-2 w-4 h-4 transition-transform duration-300 ease-out ${
                                                        isExpanded ? "rotate-180" : "rotate-0"
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                            <a href="/inventory" className="w-full">
                                                <Button
                                                    value={"default"}
                                                    className="w-full bg-[#282828] hover:bg-[#1a1a1a] text-white font-maven uppercase text-sm rounded-full transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg"
                                                >
                                                    Explore Inventory
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </MobileCarousel>
                </div>

                {/* Desktop Grid View (unchanged) */}
                <div className="hidden md:flex flex-col items-center md:flex-row gap-8 lg:gap-10">
                    {certificateData.map((certificate) => {
                        const isExpanded = expandedCards[certificate.id];
                        return (
                            <div
                                key={certificate.id}
                                className={`group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 ease-out overflow-hidden border border-gray-200 max-w-md transform hover:-translate-y-2 hover:scale-101`}
                            >
                                {/* Certificate Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={certificate.image}
                                        alt={certificate.alt}
                                        fill
                                        priority
                                        quality={100}
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
                                </div>
                                {/* Card Content */}
                                <div className="p-6 lg:p-8 transition-all duration-500 ease-out">
                                    <h2 className="text-xl text-center mb-4 font-maven text-gray-900 transition-all duration-300 ease-out group-hover:text-gray-700">
                                        {certificate.title}
                                    </h2>
                                    <div
                                        className={`text-gray-600 text-sm text-center leading-relaxed mb-6 font-maven transition-all duration-1000 ease-out max-w-sm ${
                                            isExpanded ? "max-h-96 opacity-100" : "max-h-24 opacity-90"
                                        }`}
                                    >
                                        <div
                                            className={`transition-all duration-500 ease-out ${
                                                isExpanded ? "transform translate-y-0" : "transform -translate-y-1"
                                            }`}
                                        >
                                            {isExpanded ? (
                                                <div className="whitespace-pre-line animate-in fade-in duration-500">
                                                    {certificate.fullDescription}
                                                </div>
                                            ) : (
                                                <p className="animate-in fade-in duration-300">
                                                    {truncateText(certificate.fullDescription, 150)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-center space-y-4">
                                        <button
                                            className={`px-4 py-2 text-center flex items-center justify-center text-black/80 font-medium font-maven transition-all duration-300 ease-out hover:text-black group-hover:scale-105 rounded-md hover:bg-gray-50`}
                                            onClick={() => toggleExpanded(certificate.id)}
                                        >
                                            <span className="transition-all duration-300 ease-out">
                                                {isExpanded ? "View Less" : "View More"}
                                            </span>
                                            <svg
                                                className={`ml-2 w-4 h-4 transition-transform duration-300 ease-out ${
                                                    isExpanded ? "rotate-180" : "rotate-0"
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        <a href="/inventory" className="w-full">
                                            <Button
                                                value={"default"}
                                                className="w-full bg-[#282828] hover:bg-[#1a1a1a] text-white font-maven uppercase text-sm rounded-full transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg"
                                            >
                                                Explore Inventory
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default DiamondCards;
