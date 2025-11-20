import React from "react";
import * as Motion from "motion/react-client";
import { cn } from "@/lib/utils";

const getAnimationProperties = (direction: string, distance: number) => {
    let initial = {};
    let animate = {};

    switch (direction) {
        case "left":
            initial = { x: -distance, opacity: 0 };
            animate = { x: 0, opacity: 1 };
            break;
        case "right":
            initial = { x: distance, opacity: 0 };
            animate = { x: 0, opacity: 1 };
            break;
        case "up":
            initial = { y: distance, opacity: 0 };
            animate = { y: 0, opacity: 1 };
            break;
        case "down":
            initial = { y: -distance, opacity: 0 };
            animate = { y: 0, opacity: 1 };
            break;
        case "none":
        default:
            initial = { opacity: 0 };
            animate = { opacity: 1 };
            break;
    }
    return [initial, animate];
};

const AnimatedContainer = ({
    children,
    className,
    direction = "up",
    distance = 50,
    delay = 0,
    duration = 0.7,
    once = true,
    ...rest
}: {
    children: React.ReactNode;
    className?: string;
    direction?: string;
    distance?: number;
    delay?: number;
    duration?: number;
    once?: boolean;
}) => {
    const [initial, animate] = getAnimationProperties(direction, distance);

    const transition = {
        duration,
        delay,
        ease: "easeOut",
    };

    return (
        <Motion.div
            className={cn("w-full", className)}
            initial={initial}
            // animate={animate}
            transition={transition as any}
            whileInView={animate}
            viewport={{ once: true }}
            {...rest}
        >
            {children}
        </Motion.div>
    );
};

export default AnimatedContainer;
