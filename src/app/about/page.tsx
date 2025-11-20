"use client";
import React from "react";
import { Playfair_Display, Inter } from "next/font/google";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import image1 from "../../../public/assets/aboutus-diamond1.png";
import image2 from "../../../public/assets/aboutus-diamond2.png";
import image3 from "../../../public/assets/aboutus-diamond3.png";
import { ReactLenis, useLenis } from "lenis/react";

const playFair = Playfair_Display({
    subsets: ["latin"],
});
const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
const AboutUs = () => {
    const lenis = useLenis((lenis) => {
        // called every scroll
        console.log(lenis);
    });
    return (
        <div className="min-h-screen bg-white">
            <ReactLenis root />

            {/* Our Legacy Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Diamond Images */}
                        <div className="relative">
                            <div className="relative  w-full h-96 flex items-center justify-center">
                                <Image
                                    src={image3}
                                    alt="Multiple diamonds showcasing our legacy"
                                    width={400}
                                    height={350}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div className="space-y-6">
                            <h2
                                className={`${playFair.className} text-4xl md:text-5xl font-semibold text-gray-900`}
                            >
                                Our Legacy
                            </h2>
                            <div className="space-y-4">
                                <p
                                    className={`${inter.className} text-gray-600 text-lg leading-relaxed`}
                                >
                                    With over 30 years of industry experience,
                                    we have built a trusted name in the global
                                    diamond trade. Our journey began with a
                                    commitment to authenticity, transparency,
                                    and ethical sourcing.
                                </p>
                                <p
                                    className={`${inter.className} text-gray-600 text-lg leading-relaxed`}
                                >
                                    Today, we proudly serve leading jewellers,
                                    manufacturers, and retailers across the
                                    world, delivering unmatched quality and
                                    consistency in every stone.
                                </p>
                            </div>
                            <a href="/contact">
                                <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-base font-medium">
                                    Book a Consultation
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Stand For Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div className="space-y-6">
                            <h2
                                className={`${playFair.className} text-4xl md:text-5xl font-semibold text-gray-900`}
                            >
                                What We Stand For
                            </h2>
                            <div className="space-y-4">
                                <p
                                    className={`${inter.className} text-gray-600 text-lg leading-relaxed`}
                                >
                                    At the heart of our business lies a
                                    dedication to precision and trust. Every
                                    diamond we offer undergoes the most rigorous
                                    certification and thoroughly inspected to
                                    meet the highest standards.
                                </p>
                                <p
                                    className={`${inter.className} text-gray-600 text-lg leading-relaxed`}
                                >
                                    Our loyal partners rely on us not just for
                                    products, but for clarity in communication,
                                    consistency in supply, and integrity in
                                    business.
                                </p>
                            </div>
                            <a href="/inventory">
                                <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-base font-medium">
                                    Explore our inventory
                                </Button>
                            </a>
                        </div>

                        {/* Right - Diamond Shapes */}
                        <div className="relative">
                            <div className="relative w-full h-96 flex items-center justify-center">
                                <Image
                                    src={image1}
                                    alt="Various diamond shapes and cuts"
                                    width={400}
                                    height={350}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Your Competitive Edge Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Diamond Images */}
                        <div className="relative">
                            <div className="relative w-full h-96 flex items-center justify-center">
                                <Image
                                    src={image2}
                                    alt="Premium diamonds representing competitive edge"
                                    width={400}
                                    height={350}
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div className="space-y-6">
                            <h2
                                className={`${playFair.className} text-4xl md:text-5xl font-semibold text-gray-900`}
                            >
                                Your Competitive Edge
                            </h2>
                            <div className="space-y-4">
                                {/* <p
                                    className={`${inter.className} text-gray-600 text-lg leading-relaxed`}
                                >
                                    Our extensive network gives you direct
                                    access with over 5K filter criteria, and
                                    acts as your strategic sourcing partner.
                                </p> */}
                                <p
                                    className={`${inter.className} text-gray-600 text-lg leading-relaxed`}
                                >
                                    From bulk inventory access to lightning
                                    quotation support, our platform is built to
                                    simplify procurement and strengthen your
                                    competitive edge in the evolving diamond
                                    market.
                                </p>
                            </div>
                            <a href="/contact">
                                <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-base font-medium">
                                    Book a Consultation
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
