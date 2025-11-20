"use client";

import React from "react";
import { Playfair_Display, Inter } from "next/font/google";
import Image from "next/image";

const playFair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

interface ContentItem {
    id: number;
    title: string;
    content: string;
    image: string;
}

interface ContentSectionProps {
    data: ContentItem[];
}

const ContentSection: React.FC<ContentSectionProps> = ({ data }) => {
    const formatContent = (content: string) => {
        // Split content by double newlines to separate paragraphs
        const paragraphs = content.split("\n\n");

        return paragraphs.map((paragraph, index) => {
            // Check if paragraph contains bullet points
            if (paragraph.includes("•") || paragraph.includes("*")) {
                // Split by lines and filter out empty lines
                const lines = paragraph
                    .split("\n")
                    .filter((line) => line.trim());
                const bulletItems: string[] = [];
                const regularText: string[] = [];

                lines.forEach((line) => {
                    const trimmedLine = line.trim();
                    if (
                        trimmedLine.startsWith("•") ||
                        trimmedLine.startsWith("*")
                    ) {
                        // Remove the bullet point character and add to bullet items
                        bulletItems.push(trimmedLine.substring(1).trim());
                    } else if (trimmedLine) {
                        regularText.push(trimmedLine);
                    }
                });

                return (
                    <div key={index}>
                        {regularText.length > 0 && (
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {regularText.join(" ")}
                            </p>
                        )}
                        {bulletItems.length > 0 && (
                            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2">
                                {bulletItems.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            } else {
                // Regular paragraph without bullet points
                return (
                    <p
                        key={index}
                        className="text-gray-700 leading-relaxed mb-4"
                    >
                        {paragraph.trim()}
                    </p>
                );
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-20">
            {data.map((item, index) => {
                const isOdd = index % 2 === 0;

                return (
                    <div
                        key={item.id}
                        className="flex flex-col lg:flex-row items-center justify-center lg:items-center gap-8 lg:gap-12"
                    >
                        {/* Image section */}
                        <div
                            className={`lg:w-1/2 flex items-center justify-center ${
                                isOdd
                                    ? "order-1 lg:order-1"
                                    : "order-1 lg:order-2"
                            }`}
                        >
                            <div className="relative w-full max-w-md">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={500}
                                    height={400}
                                    className="object-cover w-full h-auto rounded-xl shadow-lg"
                                    quality={100}
                                />
                            </div>
                        </div>

                        {/* Content section */}
                        <div
                            className={`lg:w-1/2 ${
                                isOdd
                                    ? "order-2 lg:order-2"
                                    : "order-2 lg:order-1"
                            }`}
                        >
                            <h2
                                className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ${playFair.className}`}
                            >
                                {item.title}
                            </h2>
                            <div className={`text-lg ${inter.className}`}>
                                {formatContent(item.content)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ContentSection;
