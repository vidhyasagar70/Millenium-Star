"use client";
import React from "react";
import * as motion from "motion/react-client";

export function TextAnimation({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const textVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.02, // Reduced for smoother animation
            },
        },
    };

    const wordVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.03,
            },
        },
    };

    const charVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
            filter: "blur(0px)",
        },
    };

    // Split text into words, preserving spaces
    const words = text.split(" ");

    return (
        <motion.div
            className={className}
            variants={textVariants}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, wordIndex) => (
                <motion.span
                    key={`word-${wordIndex}`}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.03,
                                delayChildren: wordIndex * 0.1, // Delay based on word index
                            },
                        },
                    }}
                    className="inline-block mr-[0.25em]" // Add consistent spacing between words
                >
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={`${word}-${charIndex}`}
                            variants={charVariants}
                            className="inline-block font-abhaya"
                            style={{ willChange: "transform, opacity, filter" }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.span>
            ))}
        </motion.div>
    );
}
