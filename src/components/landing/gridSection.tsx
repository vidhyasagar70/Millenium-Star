"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface GridSectionProps {
    children?: React.ReactNode;
    className?: string;
    gridData: {
        id: number;
        title: string;
        imageUrl: string;
        description?: string;
        buttonText?: string;
    }[];
}

const GridSection = ({ children, className, gridData }: GridSectionProps) => {
    // Calculate grid columns based on data length
    const getGridCols = () => {
        const dataLength = gridData.length;

        if (dataLength === 1) {
            return "grid-cols-1";
        } else if (dataLength === 2) {
            return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
        } else {
            // For 3 or more items, max 3 columns
            return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        }
    };

    return (
        <section className={cn("my-0 py-20 px-6 bg-[#F4F4F5]", className)}>
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                {children && <div className="text-center mb-1">{children}</div>}

                {/* Cards Grid - Dynamic columns based on data length */}
                <div
                    className={cn(
                        "grid  max-w-5xl mx-auto max-h-fit gap-12 p-10 md:px-30",
                        getGridCols()
                    )}
                >
                    {gridData.map((card) => (
                        <GridCard
                            key={card.id}
                            title={card.title}
                            imageUrl={card.imageUrl}
                            buttonText={card.buttonText}
                            description={card.description}
                            onButtonClick={() =>
                                console.log(`${card.title} clicked`)
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GridSection;

interface GridCardProps {
    title: string;
    imageUrl: string;
    buttonText?: string;
    description?: string;
    onButtonClick?: () => void;
    usePlaceholder?: boolean;
}

export const GridCard = ({
    title,
    imageUrl,
    description,
    buttonText = "Order Now",
    onButtonClick,
    usePlaceholder = false,
}: GridCardProps) => {
    return (
        <div className="group bg-white border-gray-300 border-2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ">
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden">
                // Actual image
                <>
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="w-full h-full"
                    />
                </>
            </div>

            {/* Content */}
            <div className="p-6 text-center flex flex-col items-center justify-between  h-fit">
                <h3 className="text-lg font-maven font-medium text-gray-900 mb-4">
                    {title}
                </h3>
                <p className="text-sm font-maven mb-5 text-gray-600">
                    {description}
                </p>
                <a href="/inventory">
                    <button
                        onClick={onButtonClick}
                        className="bg-[#2B2B2B] text-sm cursor-pointer text-white px-6 py-2 rounded-full font-normal hover:bg-[#2b2b2be8] transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 uppercase"
                    >
                        {buttonText}
                    </button>
                </a>
            </div>
        </div>
    );
};
