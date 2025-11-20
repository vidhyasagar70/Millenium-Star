"use client";
import React, { useState } from "react";
import Container from "../ui/container";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LoginModal } from "./loginCard";
import { RegistrationModal } from "./registrationCard";
import { Menu, X, User, LogOut, Settings, Power } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import * as Motion from "motion/react";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] =
        useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollYProgress } = Motion.useScroll();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    Motion.useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            const currentScrollY =
                current *
                (document.documentElement.scrollHeight - window.innerHeight);

            if (currentScrollY < 50) {
                setVisible(true);
            } else {
                const direction = currentScrollY - lastScrollY;
                if (direction < 0) {
                    setVisible(true);
                } else if (direction > 0) {
                    setVisible(false);
                }
            }
            setLastScrollY(currentScrollY);
        }
    });
    // Add authentication state
    const { user, isAuthenticated, logout, loading } = useAuth();

    const accessInventoryClickHandler = () => {
        if (isAuthenticated()) {
            window.location.href = "/inventory";
        } else {
            setIsLoginModalOpen(true);
        }
    };

    // Base nav items
    const baseNavItems = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About us" },
        {
            href: "/inventory",
            label: "Inventory",
            onClick: () => accessInventoryClickHandler(),
        },
        ...(user?.role !== "ADMIN"
            ? [
                  { href: "/diamond-knowledge", label: "Diamond Knowledge" },
                  { href: "/contact", label: "Contact us" },
              ]
            : []),
    ];

    // Admin-only nav items
    const adminNavItems = [
        { href: "/admin", label: "Admin Panel" },
        { href: "/admin/members", label: "Members" },
        { href: "/admin/quotations", label: "Offer Enquiry" },
    ];

    // Combined nav items based on authentication and role
    const navItems = isAuthenticated()
        ? user?.role === "ADMIN"
            ? [...baseNavItems, ...adminNavItems]
            : baseNavItems
        : baseNavItems;

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleRegistrationClick = () => {
        setIsRegistrationModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const handleCloseRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const handleOpenRegistrationFromLogin = () => {
        setIsLoginModalOpen(false);
        setIsRegistrationModalOpen(true);
    };

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    const handleProfileClick = () => {
        // Navigate to appropriate dashboard based on user role
        router.push("/profile");
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <Container className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded=full"></div>
                        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>

                    <div className="flex lg:justify-center  justify-start flex-1">
                        <Link
                            href="/"
                            className="flex flex-col shrink items-center gap-x-2 "
                        >
                            <Image
                                src="/assets/logo.png"
                                alt="Logo"
                                width={200}
                                height={200}
                                className="h-14 w-auto"
                            />
                            <h1 className="font-playfair text-xl  font-semibold">
                                MILLENNIUM&nbsp;STAR
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded=full"></div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <Motion.AnimatePresence mode="wait">
            <Motion.motion.div
                initial={{
                    opacity: 1,
                    y: 0,
                }}
                animate={{
                    y: visible ? 0 : -75,
                    opacity: visible ? 1 : 1,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="sticky top-0 z-50 bg-white "
            >
                <Container className="flex max-w-[1500px] items-center justify-between  py-4">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex flex-1 justify-start">
                        <ul className="hidden lg:flex flex-wrap list-none gap-x-4 gap-y-3 font-sans font-light text-sm">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        // onClick={item.onClick}
                                        href={item.href}
                                        className={`transition-colors duration-200 flex justify-center items-center ${
                                            pathname === item.href
                                                ? "bg-black rounded-xl  px-2 py-1 pb-1.5 text-white font-semibold "
                                                : "text-black hover:text-black"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Logo */}
                    <div className="flex lg:justify-center  justify-start flex-1">
                        <Link
                            href="/"
                            className="flex flex-col shrink items-center gap-x-2 "
                        >
                            <Image
                                src="/assets/logo.png"
                                alt="Logo"
                                width={200}
                                height={200}
                                className="h-14 w-auto"
                            />
                            <h1 className="font-playfair text-xl  font-semibold">
                                MILLENNIUM&nbsp;STAR
                            </h1>
                        </Link>
                    </div>
                    {/* Desktop Auth/Profile Buttons */}
                    <div className="hidden lg:flex flex-1 justify-end space-x-3">
                        {isAuthenticated() ? (
                            // Authenticated user buttons
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleProfileClick}
                                    className="border-2 border-black text-black cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-full flex items-center space-x-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>{user?.username || "Profile"}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="bg-black border-2 border-black cursor-pointer text-white hover:text-white hover:bg-black/80 px-4 py-2 rounded-full flex items-center space-x-2"
                                >
                                    <Power className="h-4 w-4" />
                                    <span>Logout</span>
                                </Button>
                            </>
                        ) : (
                            // Guest user buttons
                            <>
                                <div
                                    className="bg-white  cursor-pointer border-2 rounded-full border-black text-black px-4 py-2 hover:bg-gray-200 transition-colors"
                                    onClick={handleRegistrationClick}
                                >
                                    Register
                                </div>
                                <div
                                    className="bg-black cursor-pointer border-2 rounded-full border-black text-white px-4 py-2 hover:bg-black/80 transition-colors"
                                    onClick={handleLoginClick}
                                >
                                    Login
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6 text-black" />
                        ) : (
                            <Menu className="h-6 w-6 text-black" />
                        )}
                    </button>
                </Container>
                <div className="h-1 border-b border-black mx-auto max-w-100"></div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                        <Container className="py-4">
                            {/* Mobile Navigation Links */}
                            <ul className="space-y-4 mb-6">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`block py-2 transition-colors duration-200 ${
                                                pathname === item.href
                                                    ? "text-[#A6A6A6] font-medium"
                                                    : "text-black hover:text-gray-600"
                                            }`}
                                            onClick={closeMobileMenu}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Mobile Auth/Profile Buttons */}
                            <div className="space-y-3">
                                {isAuthenticated() ? (
                                    // Authenticated user mobile buttons
                                    <>
                                        <Button
                                            onClick={handleProfileClick}
                                            className="w-full bg-white border-2 border-black text-black hover:bg-gray-50 py-3 rounded-[3px] flex items-center justify-center space-x-2"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>
                                                {user?.username || "Profile"}
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            className="w-full bg-[#4D4D4D] border-2 border-black text-white hover:bg-gray-700 py-3 rounded-[3px] flex items-center justify-center space-x-2"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </Button>
                                    </>
                                ) : (
                                    // Guest user mobile buttons
                                    <>
                                        <div
                                            className="w-full text-center bg-white cursor-pointer border-2 rounded-[3px] border-black text-black px-4 py-3 hover:bg-gray-50 transition-colors"
                                            onClick={handleRegistrationClick}
                                        >
                                            Register
                                        </div>
                                        <div
                                            className="w-full text-center bg-[#4D4D4D] cursor-pointer border-2 rounded-[3px] border-black text-white px-4 py-3 hover:bg-gray-700 transition-colors"
                                            onClick={handleLoginClick}
                                        >
                                            Login
                                        </div>
                                    </>
                                )}
                            </div>
                        </Container>
                    </div>
                )}

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
            </Motion.motion.div>
        </Motion.AnimatePresence>
    );
};

export default Navbar;
