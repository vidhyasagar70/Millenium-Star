"use client";
import DiamondCards from "@/components/landing/certificates";
import GridSection from "@/components/landing/gridSection";
import Navbar from "@/components/landing/header";
import HeroSection from "@/components/landing/heroSection";
import Testimonial from "@/components/landing/testimonial";
import { Button } from "@/components/ui/button";
import { Description, Title } from "@/components/ui/typography";
import Image from "next/image";
import React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import CertificatesCarousel from "@/components/landing/certificatesCarousel";
import Link from "next/link";
import AnimatedContainer from "@/components/ui/AnimatedContainer";
import { TextAnimation } from "@/components/ui/TextAnimation";

const gridCardsData1 = [
    {
        id: 1,
        title: "Fancy Shape Diamonds",
        imageUrl: "/assets/diamond2-img.png",
        description:
            "Fancy Shape Diamonds - Available from 0.05 carat to 0.50 carat, in a wide collection of different shapes. Offered in a complete range of colors and clarities, each diamond is precisely cut to highlight its unique brilliance.",
        buttonText: "Explore Inventory",
    },
    {
        id: 2,
        title: "Loose Diamond Parcels",
        imageUrl: "/assets/diamond-parcel.jpeg",
        description:
            "Loose Parcel of Round Brilliant Diamonds - Available in sizes ranging from 0.80 mm to 5.50 mm, in a complete range of color and clarity grades.",
        buttonText: "Explore Inventory",
    },
];

const HomePage = () => {
    const lenis = useLenis((lenis) => {
        // called every scroll
        console.log(lenis);
    });
    return (
        <div>
            <ReactLenis root />
            {/* Hero Section */}
            <HeroSection />
            {/* Reduce gap below HeroSection */}
            <div className="h-2 md:h-4" />

            {/* Grid Section - Desktop View */}
            <div className="hidden md:block">
                <AnimatedContainer direction="up" delay={0.6}>
                    <GridSection gridData={gridCardsData1}>
                        <Title
                            className={`lg:text-5xl md:text-4xl text-3xl font-semibold text-[#1E1E1E] font-abhaya`}
                        >
                            Your Trusted Diamond Supplier
                        </Title>
                    </GridSection>
                </AnimatedContainer>
            </div>

            {/* Grid Section - Mobile View (2 cards in row) */}
            <div className="block md:hidden">
                <AnimatedContainer direction="up" delay={0.6}>
                    <section className="py-10 px-6">
                        <Title
                            className={`text-3xl font-semibold text-[#1E1E1E] font-abhaya text-center mb-8`}
                        >
                            Your Trusted Diamond Supplier
                        </Title>
                        <div className="grid grid-cols-2 gap-4">
                            {gridCardsData1.map((card) => (
                                <div
                                    key={card.id}
                                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
                                >
                                    <div className="relative h-40">
                                        <Image
                                            src={card.imageUrl}
                                            alt={card.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-3 flex flex-col flex-grow">
                                        <h3 className="text-sm font-semibold text-[#1E1E1E] mb-2 font-abhaya">
                                            {card.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-3 flex-grow font-maven line-clamp-4">
                                            {card.description}
                                        </p>
                                        {card.buttonText && (
                                            <Link href="/inventory">
                                                <Button
                                                    variant="outline"
                                                    className="w-full text-xs py-2 border-black rounded-full"
                                                >
                                                    {card.buttonText}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </AnimatedContainer>
            </div>

            {/* Grow your business Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <section className="flex flex-col lg:flex-row py-10">
                    <div className="flex flex-col lg:flex-row items-center justify-around w-full h-full">
                        <div className="pl-4 pr-6 md:px-6 w-full">
                            <div className="block lg:hidden px-4">
                                <Title
                                    className={`mb-6 text-left max-w-md text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                                >
                                    Grow Your Business By Sourcing Efficiently
                                </Title>
                                <Description
                                    className={`mb-8 text-black max-w-md text-left lg:text-base md:text-base text-base font-maven`}
                                >
                                    Serving hundreds of retailers, exporters and private-label jewellery 
                                    manufacturer with consistently graded stones.{" "}
                                    <span className="font-semibold">
                                        Millennium Star
                                    </span>
                                </Description>
                                <div className="flex flex-row gap-2 mb-4">
                                    <Link href={"/inventory"}>
                                        <Button
                                            variant={"outline"}
                                            className="cursor-pointer border-black rounded-full px-4 py-2 text-xs font-medium transition-colors"
                                        >
                                            EXPLORE MORE
                                        </Button>
                                    </Link>
                                    <Link href={"/contact"}>
                                        <Button
                                            variant={"default"}
                                            className="cursor-pointer border-black rounded-full px-4 py-2 text-xs font-medium transition-colors"
                                        >
                                            SCHEDULE A CALL
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                            <Title
                                className={`mb-6 text-left max-w-md text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                            >
                                Grow Your Business By Sourcing Efficiently
                            </Title>
                            <Description
                                className={`mb-8 text-black max-w-md text-left lg:text-base md:text-base text-base font-maven`}
                            >
                                Serving hundreds of retailers, exporters and private-label jewellery 
                                manufacturer with consistently graded stones.{" "}
                                <span className="font-semibold">
                                    Millennium Star
                                </span>
                            </Description>
                            <div className="flex flex-row gap-4">
                                <Link href={"/inventory"}>
                                    <Button
                                        variant={"outline"}
                                        className="cursor-pointer border-black rounded-full px-8 py-3 font-medium transition-colors"
                                    >
                                        EXPLORE MORE
                                    </Button>
                                </Link>
                                <Link href={"/contact"}>
                                    <Button
                                        variant={"default"}
                                        className="cursor-pointer border-black rounded-full px-8 py-3 font-medium transition-colors"
                                    >
                                        SCHEDULE A CALL
                                    </Button>
                                </Link>
                            </div>
                            </div>
                        </div>
                        {/* Desktop Image */}
                        <div className="py-10 hidden lg:block">
                            <Image
                                src={"/assets/diamondKnowledge/DiamondIwhtTweezers.jpg"}
                                alt="Close-up of a large, sparkling diamond held by tweezers"
                                width={500}
                                height={450}
                                className="object-contain rounded-tr-[40%] rounded-bl-[40%]"
                                priority
                            />
                        </div>
                        {/* Mobile Image */}
                        <div className="py-10 block lg:hidden">
                            <div className="px-4">
                                <Image
                                    src={"/assets/home/home2.png"}
                                    alt="Diamond showcase"
                                    width={500}
                                    height={450}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedContainer>

            {/* Diamond Certificates */}
            <AnimatedContainer direction="up" delay={0.6}>
                <DiamondCards />
            </AnimatedContainer>

            <AnimatedContainer direction="up" delay={0.6}>
                <section>
                    <div className="flex flex-col lg:flex-row items-center justify-around w-full h-full">
                        <div className="px-6">
                            <Title
                                className={`mb-6 text-left max-w-lg text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                            >
                                Retail Ready Diamonds Trusted Globally
                            </Title>
                            <AnimatedContainer direction="up" delay={0.6}>
                                <Description
                                    className={`mb-8 text-black max-w-lg text-left lg:text-base md:text-base text-base font-maven`}
                                >
                                    Specialize in retail-ready diamonds for
                                    high-end and private-label jewellery brands.
                                    Color: D-E-F | Clarity: IF-VVS, ideal for
                                    premium diamonds.
                                </Description>
                                <Link href={"/contact"}>
                                    <Button
                                        variant={"outline"}
                                        className="cursor-pointer border-black rounded-full px-8 py-3 font-medium transition-colors"
                                    >
                                        Book a Consultation
                                    </Button>
                                </Link>
                            </AnimatedContainer>
                        </div>
                        <div className="py-10">
                            <AnimatedContainer direction="up" delay={0.3}>
                                <div className="px-4 lg:px-0">
                                    <Image
                                        src={"/assets/microscopeLab.png"}
                                        alt="Close-up of a large, sparkling diamond held by tweezers"
                                        width={550}
                                        height={450}
                                        className="object-contain rounded-tl-[40%] rounded-br-[40%]"
                                        priority
                                    />
                                </div>
                            </AnimatedContainer>
                        </div>
                    </div>
                </section>
            </AnimatedContainer>

            {/* Do more with ease Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <CertificatesCarousel />
            </AnimatedContainer>

            {/* Numbers Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <section className="py-16 px-4 md:py-20 md:px-6 text-center">
                    <Title className="text-black text-2xl font-semibold max-w-xs mx-auto md:text-3xl lg:text-4xl md:max-w-lg">
                        Whether You are Retailer Or WholeSeller You can Rely On Millennium Star
                    </Title>
                    <Description className="text-black text-xs mt-2 max-w-xs mx-auto md:text-sm md:mt-3 md:max-w-xl">
                        We help retailers, wholesalers and traders securely source the perfect diamond with complete ease
                    </Description>

                    {/* Mobile Buttons */}
                    <div className="flex flex-row justify-center gap-2 max-w-xs mx-auto my-5 md:hidden">
                        <Link href={"/inventory"}>
                            <Button
                                variant={"outline"}
                                className="cursor-pointer border-black rounded-full px-4 py-2 text-xs font-medium transition-colors min-w-[110px]"
                            >
                                Explore More
                            </Button>
                        </Link>
                        <Link href={"/contact"}>
                            <Button
                                variant={"default"}
                                className="cursor-pointer border-black rounded-full px-4 py-2 text-xs font-medium transition-colors min-w-[110px]"
                            >
                                Schedule a Call
                            </Button>
                        </Link>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex flex-row justify-center gap-4 max-w-xl mx-auto my-7">
                        <Link href={"/inventory"}>
                            <Button
                                variant={"outline"}
                                className="cursor-pointer border-black rounded-full px-8 py-3 font-medium transition-colors"
                            >
                                EXPLORE MORE
                            </Button>
                        </Link>
                        <Link href={"/contact"}>
                            <Button
                                variant={"default"}
                                className="cursor-pointer border-black rounded-full px-8 py-3 font-medium transition-colors"
                            >
                                SCHEDULE A CALL
                            </Button>
                        </Link>
                    </div>
                </section>
            </AnimatedContainer>

            {/* <Testimonial />*/}
        </div>
    );
};

export default HomePage;