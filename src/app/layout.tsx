import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display, Abhaya_Libre, Maven_Pro } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/layout/ConditionalHeader"; // Import the new component
import Head from "next/head";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/landing/footer";
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});
const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});
const abhaya = Abhaya_Libre({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-abhaya",
});
const maven = Maven_Pro({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-maven",
});

export const metadata: Metadata = {
    title: "Millennium Star - Belgium's Certified Diamond Supplier",
    description:
        "Discover Millennium Star, Belgium's certified diamond supplier. Supplying premium, authentic diamonds with expert craftsmanship to clients across Europe & globally.",
    alternates: {
        canonical: "https://www.millenniumstar.be",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${playfair.variable} ${abhaya.variable} ${maven.variable} antialiased`}
            >
                <ConditionalHeader /> {/* Use the conditional header here */}
                {children}
                <Toaster />
                <Footer />
            </body>
        </html>
    );
}
