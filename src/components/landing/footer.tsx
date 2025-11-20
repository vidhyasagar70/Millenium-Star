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
        <footer className=" overflow-hidden bg-[#212121] text-white">
            <div className=" max-w-7xl mx-auto px-6 lg:px-8 ">
                <div className="w-full flex items-center justify-center pt-8 mb-20">
                    <Link
                        href="/"
                        className="flex flex-col justify-between  items-center space-y-1"
                    >
                        <Image
                            src="/assets/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="h-16 w-auto"
                        />
                        <h1 className="font-playfair text-xl md:text-2xl font-semibold">
                            MILLENNIUM&nbsp;STAR
                        </h1>
                    </Link>
                </div>
                {/* Top section */}
                <div className="flex flex-wrap justify-around items-center  max-w-6xl mx-auto mb-5">
                    {/* Quick Links */}
                    <div className="text-center">
                        <h3 className={`font-maven text-2xl font-medium mb-4`}>
                            Millennium Star
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`${inter.className} text-gray-300 hover:text-white transition-colors text-sm font-medium`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* <div className="text-center">
                        <h3 className={`font-maven text-2xl font-medium mb-4`}>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`${inter.className} text-gray-300 hover:text-white transition-colors text-sm font-medium`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                    <div className="text-center">
                        <h3 className={`font-maven text-2xl font-medium mb-4`}>
                            Our Promise
                        </h3>
                        <ul className="space-y-3">
                            {promiseLinks.map((link) => (
                                <li key={link.href}>
                                    <p
                                        className={`${inter.className} text-gray-300 hover:text-white transition-colors text-sm font-medium`}
                                    >
                                        {link.label}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className=" py-6 flex flex-col sm:flex-row-reverse items-center justify-center gap-x-30">
                    <p
                        className={`${inter.className} text-sm text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0`}
                    >
                        &copy; {new Date().getFullYear()} Millennium Star. All
                        rights reserved.
                    </p>
                    {/* <div
                        className={`${inter.className} flex items-center space-x-6 text-sm text-gray-400 order-1 sm:order-2`}
                    >
                        <Link
                            href="/privacy"
                            className="hover:text-white transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Terms
                        </Link>
                    </div> */}
                    {/* Follow Us */}
                    <div className="flex justify-center items-center gap-3">
                        <h3 className={`font-maven text-lg font-medium `}>
                            Follow Us
                        </h3>
                        <div className="flex justify-center items-center space-x-4">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="text-gray-300  hover:text-white transition-colors text-xl"
                                >
                                    {social.icon}
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
