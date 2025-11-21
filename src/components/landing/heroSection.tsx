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
        <div className="flex items-center justify-center overflow-hidden lg:min-h-[80vh] sm:min-h-fit w-full relative pt-8 lg:pt-0">
            {/* Desktop Background Image - Hidden on mobile */}
            <div className="hidden lg:block absolute inset-0">
                <Image
                    src={BannerImage}
                    alt="Hero Background"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>
            
            {/* Mobile Background - White */}
            <div className="lg:hidden absolute inset-0 bg-white" />
            
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
                            <div className="flex flex-col lg:flex-row items-center justify-start w-full h-full">
                                <div className="px-6 lg:px-6 w-full lg:w-auto">
                                    <TextAnimation
                                        text="Certified & Non Certified Diamonds Designed for Business"
                                        className={`mb-4 lg:mb-6 text-left max-w-lg text-black font-semibold text-2xl md:text-4xl lg:text-5xl font-abhaya`}
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
                                            className="cursor-pointer border-black rounded-full px-8 py-3 font-medium transition-colors mb-6 lg:mb-0"
                                        >
                                            Partner With Us
                                        </Button>
                                        
                                        {/* Mobile Image - Only visible on mobile */}
                                        <div className="block lg:hidden">
                                            <Image
                                                src={"/assets/home/home.png"}
                                                alt="Diamond collection showcase"
                                                width={400}
                                                height={300}
                                                className="object-contain w-full rounded-lg"
                                                priority
                                            />
                                        </div>
                                    </AnimatedContainer>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>

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