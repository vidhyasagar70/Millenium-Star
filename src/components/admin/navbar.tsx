import React from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ContainerIcon } from "lucide-react";
import Container from "../ui/container";
import Link from "next/link";
const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <Container className="">
            <div className=" flex items-center justify-between  px-10">
                <SiteHeader />
                <div className="flex items-center space-x-4 h-16  border-b">
                    <a href="/admin/members-enquiry">
                        <Button variant="outline">Member Enquiry</Button>
                    </a>
                    <Button
                        onClick={logout}
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                    >
                        Logout
                    </Button>
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-900  hover:bg-gray-900 border-none p-4 text-white hover:text-white rounded-full space-x-2 flex justify-center items-center"
                        >
                            <div className="h-5 w-5 bg-white/50 hover:bg-white/50 rounded-full"></div>
                            {user?.username || "User"}
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    );
};

export default Navbar;
