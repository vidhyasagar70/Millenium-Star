"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/landing/header";

export default function ConditionalHeader() {
    const pathname = usePathname();

    // Do not render the main header on any admin routes
    if (pathname.startsWith("/admin")) {
        return <Navbar />;
    }

    return <Navbar />;
}
