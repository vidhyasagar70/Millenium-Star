import { cn } from "@/lib/utils";
import React from "react";

const CustomButton = ({
    href,
    as: Tag = "button",
    children,
    className,
    icon,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "dark";
} & (
    | React.ComponentPropsWithoutRef<"a">
    | React.ComponentPropsWithoutRef<"button">
)) => {
    const baseStyles =
        "px-5 py-3 rounded-md shadow-[0px_2px_5px_0px_rgba(0,0,0,0.25)] inline-flex justify-center items-center gap-1 text-sm font-normal font-inter cursor-pointer ";
    const variantStyles = {
        primary: "bg-gradient-to-b from-blue-700 to-blue-400 text-white ",
        secondary: "bg-black/5 text-black",
        dark: "bg-black text-white",
    };
    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {icon && (
                <span className="relative z-10 flex-shrink-0 transform transition-transform duration-300">
                    {icon}
                </span>
            )}
            {children}
        </Tag>
    );
};

export default CustomButton;
