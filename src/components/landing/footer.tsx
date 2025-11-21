"use client";

import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

const playFair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/inventory", label: "Access Inventory" },
    { href: "/contact", label: "Contact Us" },
    { href: "/diamond-knowledge", label: "Diamond Knowledge" },
];
const promiseLinks = [
    { href: "/about", label: "Conflict Free Diamonds" },
    { href: "/inventory", label: "Custom Design" },
    { href: "/diamond-knowledge", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
];

const socialLinks = [
    { href: "#", icon: <Facebook size={18} /> },
    { href: "#", icon: <Instagram size={18} /> },
    { href: "#", icon: <Linkedin size={18} /> },
    { href: "#", icon: <Twitter size={18} /> },
];

const Footer = () => {
    return (
        <footer className="overflow-hidden bg-[#212121] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div className="w-full flex items-center justify-center pt-6 sm:pt-8 mb-8 sm:mb-20">
                    <Link
                        href="/"
                        className="flex flex-col justify-between items-center space-y-1"
                    >
                        <Image
                            src="/assets/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="h-10 sm:h-16 w-auto"
                        />
                        <h1 className="font-playfair text-base sm:text-xl md:text-2xl font-semibold">
                            MILLENNIUM&nbsp;STAR
                        </h1>
                    </Link>
                </div>

                {/* Links Section - Always in row */}
                <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto mb-6 sm:mb-5 px-2 sm:px-0">
                    {/* Millennium Star Links */}
                    <div className="text-center">
                        <h3 className="font-maven text-sm sm:text-xl md:text-2xl font-medium mb-2 sm:mb-4">
                            Millennium Star
                        </h3>
                        <ul className="space-y-1.5 sm:space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`${inter.className} text-gray-300 hover:text-white transition-colors text-[11px] sm:text-sm font-medium`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Promise Links */}
                    <div className="text-center">
                        <h3 className="font-maven text-sm sm:text-xl md:text-2xl font-medium mb-2 sm:mb-4">
                            Our Promise
                        </h3>
                        <ul className="space-y-1.5 sm:space-y-3">
                            {promiseLinks.map((link) => (
                                <li key={link.href}>
                                    <p
                                        className={`${inter.className} text-gray-300 hover:text-white transition-colors text-[11px] sm:text-sm font-medium`}
                                    >
                                        {link.label}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mx-4 sm:mx-0"></div>

                {/* Bottom Section */}
                <div className="py-4 sm:py-6 flex flex-col sm:flex-row-reverse items-center justify-center gap-3 sm:gap-x-30">
                    {/* Copyright */}
                    <p
                        className={`${inter.className} text-[10px] sm:text-sm text-gray-400 order-2 sm:order-1 text-center`}
                    >
                        &copy; {new Date().getFullYear()} Millennium Star. All
                        rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
                        <h3 className="font-maven text-xs sm:text-lg font-medium">
                            Follow Us
                        </h3>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    <span className="block sm:hidden">
                                        {social.icon.type === Facebook && <Facebook size={14} />}
                                        {social.icon.type === Instagram && <Instagram size={14} />}
                                        {social.icon.type === Linkedin && <Linkedin size={14} />}
                                        {social.icon.type === Twitter && <Twitter size={14} />}
                                    </span>
                                    <span className="hidden sm:block">
                                        {social.icon}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;