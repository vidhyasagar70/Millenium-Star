import React from "react";
import { cn } from "@/lib/utils";

export const Title = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <h1
            className={cn(
                "text-white font-abhaya text-4xl md:text-6xl lg:text-7xl font-normal leading-tight md:leading-[1.1] text-center",
                className
            )}
        >
            {children}
        </h1>
    );
};

export const Description = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <p
            className={cn(
                "text-white/90 text-lg md:text-xl lg:text-2xl font-light font-maven leading-relaxed text-center max-w-4xl mx-auto",
                className
            )}
        >
            {children}
        </p>
    );
};
