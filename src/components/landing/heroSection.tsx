"use client";
import React, { useState } from "react";
import Image from "next/image";
// import { Abhaya_Libre, Maven_Pro } from "next/font/google";
import { Description, Title } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "./loginCard";
import { RegistrationModal } from "./registrationCard";
import { Button } from "../ui/button";
import BannerImage from "@/../public/assets/Banner1.jpg";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Container from "../ui/container";
import { TextAnimation } from "../ui/TextAnimation";
import AnimatedContainer from "../ui/AnimatedContainer";
// const abhaya = Abhaya_Libre({ subsets: ["latin"], weight: ["400", "700"] });
// const maven = Maven_Pro({ subsets: ["latin"], weight: ["400", "500", "700"] });

const HeroSection = () => {
    const { isAuthenticated } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] =
        useState(false);

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleRegistrationClick = () => {
        setIsRegistrationModalOpen(true);
    };

    const handleCloseRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const handleOpenRegistrationFromLogin = () => {
        setIsLoginModalOpen(false);
        setIsRegistrationModalOpen(true);
    };

    const handleOpenLoginFromRegistration = () => {
        setIsRegistrationModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const accessInventoryClickHandler = () => {
        if (isAuthenticated()) {
            // User is authenticated, navigate to inventory
            window.location.href = "/inventory";
        } else {
            // User is not authenticated, open login modal
            setIsLoginModalOpen(true);
        }
    };

    return (
        <div className="  flex items-center justify-center overflow-hidden min-h-[80vh] w-full relative   ">
            <Image
                src={BannerImage}
                alt="Hero Background"
                layout="fill"
                objectFit="cover"
                priority
            />
            <Container>
                <Carousel
                    className="w-full h-full"
                    opts={{ loop: true, watchDrag: false }}
                    plugins={[
                        Autoplay({
                            delay: 9000,
                            stopOnMouseEnter: true,
                            stopOnInteraction: false,
                        }),
                    ]}
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="flex flex-col lg:flex-row items-center justify-start w-full h-full ">
                                <div className=" px-6 ">
                                    <TextAnimation
                                        text="Certified & Non Certified Diamonds Designed for Business"
                                        className={`mb-6 text-left max-w-lg text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                                    />
                                    <AnimatedContainer
                                        direction="up"
                                        delay={0.6}
                                    >
                                        <Description
                                            className={`mb-8 text-black max-w-lg text-left lg:text-base md:text-base text-base font-maven`}
                                        >
                                            Ethically sourced diamonds crafted
                                            specifically for traders, retailers,
                                            and private labels across the globe.
                                        </Description>
                                        <Button
                                            onClick={() => {
                                                accessInventoryClickHandler();
                                            }}
                                            variant={"outline"}
                                            className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                                        >
                                            Partner With Us
                                        </Button>
                                    </AnimatedContainer>
                                </div>
                                {/* <div className="py-10">
                                    <AnimatedContainer
                                        direction="up"
                                        delay={0.3}
                                    >
                                        <Image
                                            src={"/assets/hero-3.png"}
                                            alt="Close-up of a large, sparkling diamond held by tweezers"
                                            width={500}
                                            height={450}
                                            className="object-contain  rounded-tr-[40%] rounded-bl-[40%]"
                                            priority
                                        />
                                    </AnimatedContainer>
                                </div> */}
                            </div>
                        </CarouselItem>
                        {/* <CarouselItem>
                            <div className="flex flex-col lg:flex-row items-center justify-around w-full h-full ">
                                <div className=" px-6 ">
                                    <Title
                                        className={`mb-6 text-left max-w-md text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                                    >
                                        Certified & non certified diamond
                                        designed for business
                                    </Title>
                                    <Description
                                        className={`mb-8 text-black max-w-md text-left lg:text-base md:text-base text-base font-maven`}
                                    >
                                        Ethically sourced diamonds crafted
                                        specifically for traders, retailers, and
                                        private labels across the globe.
                                    </Description>
                                    <Button
                                        onClick={() => {
                                            accessInventoryClickHandler();
                                        }}
                                        variant={"outline"}
                                        className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                                    >
                                        Partner With Us
                                    </Button>
                                </div>
                                <div className="py-10">
                                    <Image
                                        src={"/assets/hero-3.png"}
                                        alt="Close-up of a large, sparkling diamond held by tweezers"
                                        width={500}
                                        height={450}
                                        className="object-contain  rounded-tr-[40%] rounded-bl-[40%]"
                                        priority
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="flex flex-col lg:flex-row items-center justify-around w-full h-full ">
                                <div className=" px-6 ">
                                    <Title
                                        className={`mb-6 text-left max-w-md text-black font-semibold text-3xl md:text-4xl lg:text-5xl font-abhaya`}
                                    >
                                        Certified & non certified diamond
                                        designed for business
                                    </Title>
                                    <Description
                                        className={`mb-8 text-black max-w-md text-left lg:text-base md:text-base text-base font-maven`}
                                    >
                                        Ethically sourced diamonds crafted
                                        specifically for traders, retailers, and
                                        private labels across the globe.
                                    </Description>
                                    <Button
                                        onClick={() => {
                                            accessInventoryClickHandler();
                                        }}
                                        variant={"outline"}
                                        className=" cursor-pointer border-black rounded-full px-8 py-3 font-medium  transition-colors "
                                    >
                                        Partner With Us
                                    </Button>
                                </div>
                                <div className="py-10">
                                    <Image
                                        src={"/assets/hero-3.png"}
                                        alt="Close-up of a large, sparkling diamond held by tweezers"
                                        width={500}
                                        height={450}
                                        className="object-contain  rounded-tr-[40%] rounded-bl-[40%]"
                                        priority
                                    />
                                </div>
                            </div>
                        </CarouselItem> */}
                    </CarouselContent>
                </Carousel>
                {/* Centered Content */}

                {/* Modals - Only show when not authenticated */}
                {!isAuthenticated() && (
                    <>
                        <LoginModal
                            isOpen={isLoginModalOpen}
                            onClose={handleCloseLoginModal}
                            onOpenRegistration={handleOpenRegistrationFromLogin}
                        />
                        <RegistrationModal
                            isOpen={isRegistrationModalOpen}
                            onClose={handleCloseRegistrationModal}
                        />
                    </>
                )}
            </Container>
        </div>
    );
};

export default HeroSection;
