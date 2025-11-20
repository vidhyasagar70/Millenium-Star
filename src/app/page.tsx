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
    },
];
// const gridCardsData2 = [
//     {
//         id: 1,
//         title: "Search Diamonds",
//         imageUrl: "/assets/diamond2-img.png",
//         description:
//             "Using a mobile or desktop, search and filter our wide range of  diamonds at the ease of your finger tips.",
//         buttonText: "Explore Inventory",
//     },
//     {
//         id: 2,
//         title: "Find Matching Pairs",
//         imageUrl: "/assets/diamond-parcel.jpeg",
//         description:
//             "Using a mobile or desktop, search and filter our wide range of  diamonds at the ease of your finger tips.",
//         buttonText: "Explore Inventory",
//     },
//     {
//         id: 3,
//         title: "View More",
//         imageUrl: "/assets/diamond-parcel.jpeg",
//         description:
//             "Find everything you need to know about the diamond. Access videos, images, certificates and specifications within seconds.",
//         buttonText: "Explore Inventory",
//     },
// ];

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

            {/* Grid Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <GridSection gridData={gridCardsData1}>
                    <Title
                        className={`lg:text-5xl md:text-4xl text-3xl font-semibold text-[#1E1E1E] font-abhaya`}
                    >
                        Your Trusted Diamond Supplier
                    </Title>
                </GridSection>
            </AnimatedContainer>

            {/* Grow your business Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <section className=" flex flex-col lg:flex-row py-10">
                    <div className="flex flex-col lg:flex-row items-center justify-around w-full h-full ">
                        <div className=" px-6 ">
                            <Title
                                className={`mb-6 text-left max-w-md text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                            >
                                Grow Your Business By Sourcing Efficiently
                            </Title>
                            <Description
                                className={`mb-8 text-black max-w-md text-left lg:text-base md:text-base text-base font-maven`}
                            >
                                Serving hundreds of retailers , exporters and private-label jewellery 
                                manufacturer with consistently graded stones.{" "}
                                <span className="font-semibold">
                                    Millennium Star
                                </span>
                            </Description>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <Link href={"/inventory"}>
                                    <Button
                                        variant={"outline"}
                                        className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                                    >
                                        EXPLORE MORE
                                    </Button>
                                </Link>
                                <Link href={"/contact"}>
                                    <Button
                                        variant={"default"}
                                        className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                                    >
                                        SCHEDULE A CALL
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="py-10">
                            <Image
                                src={
                                    "/assets/diamondKnowledge/DiamondIwhtTweezers.jpg"
                                }
                                alt="Close-up of a large, sparkling diamond held by tweezers"
                                width={500}
                                height={450}
                                className="object-contain  rounded-tr-[40%] rounded-bl-[40%]  "
                                priority
                            />
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
                    <div className="flex flex-col lg:flex-row items-center justify-around w-full h-full ">
                        <div className=" px-6 ">
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
                                        className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                                    >
                                        Book a Consultation
                                    </Button>
                                </Link>
                            </AnimatedContainer>
                        </div>
                        <div className="py-10">
                            <AnimatedContainer direction="up" delay={0.3}>
                                <Image
                                    src={"/assets/microscopeLab.png"}
                                    alt="Close-up of a large, sparkling diamond held by tweezers"
                                    width={550}
                                    height={450}
                                    className="object-contain rounded-tl-[40%] rounded-br-[40%]"
                                    priority
                                />
                            </AnimatedContainer>
                        </div>
                    </div>
                </section>
            </AnimatedContainer>

            {/* Video Section */}
            {/* <AnimatedContainer direction="up" delay={0.6}>
                <section className="py-10">
                    <video
                        className="w-full h-96 object-cover"
                        autoPlay
                        loop
                        muted
                    >
                        <source
                            src="/assets/videos/showCaseVideo.mp4"
                            type="video/mp4"
                        />
                    </video>
                </section>
            </AnimatedContainer> */}

            {/* Do more with ease Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <CertificatesCarousel />
            </AnimatedContainer>

            {/* Numbers Section */}
            <AnimatedContainer direction="up" delay={0.6}>
                <section className="py-20 px-6  text-center">
                    <Title className="text-black md:text-3xl lg:text-4xl font-semibold max-w-lg mx-auto">
                        Whether You are Retailer Or WholeSeller You can Rely On
                        Millennium Star
                    </Title>
                    <Description className="text-black text-sm md:text-sm lg:text-sm mt-3 max-w-xl mx-auto">
                        We helps retailers, wholesalers and traders securely
                        source the perfect diamond with complete ease
                    </Description>

                    <div className="flex flex-col lg:flex-row justify-center gap-4 max-w-xl mx-auto  my-7">
                        <Link href={"/inventory"}>
                            <Button
                                variant={"outline"}
                                className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                            >
                                EXPLORE MORE
                            </Button>
                        </Link>
                        <Link href={"/contact"}>
                            <Button
                                variant={"default"}
                                className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                            >
                                SCHEDULE A CALL
                            </Button>
                        </Link>
                    </div>
                </section>
            </AnimatedContainer>

            {/* <Testimonial /> */}
        </div>
    );
};

export default HomePage;
