import React from "react";
import { Playfair_Display, Open_Sans, Mulish } from "next/font/google";
import Image from "next/image";
import test1 from "../../../public/assets/test1.png";
import test2 from "../../../public/assets/test2.png";
import test3 from "../../../public/assets/test3.png";
import test4 from "../../../public/assets/test4.png";

const playFair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const mulish = Mulish({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const testimonials = [
    {
        name: "Amrita",
        desc: "Reliable, transparent, and always on time. They’ve helped scale our inventory effortlessly.",
        src: test1,
    },
    {
        name: "Jasmine",
        desc: "Their B2B service is unmatched — from quality control to quick logistics.",
        src: test2,
    },
    {
        name: "Suzen",
        desc: "We source 80% of our loose diamonds , Consistency and professionalism make them our top vendor.",
        src: test3,
    },
    {
        name: "JMaria",
        desc: "Smooth onboarding and great communication. Perfect for scaling retail operations.",
        src: test4,
    },
];

const Testimonial = () => {
    return (
        <div className="w-full my-20 lg:my-30 px-5">
            <h1
                className={`${playFair.className} text-5xl text-center`}
                style={{
                    background: "linear-gradient(to right, #FFDCBB, #54330C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Testimonial
            </h1>
            <p
                className={`${openSans.className} text-lg font-light text-[#2E2B28CC] text-center mt-2`}
            >
                See What People Say About Us
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mt-10">
                {testimonials.map((item, index) => (
                    <div
                        key={index}
                        className="border border-[#D6C5A066] rounded-xl p-8 flex flex-col items-center text-center"
                    >
                        <Image
                            src={item.src}
                            alt={`testimonial ${index}`}
                            width={100}
                            height={100}
                            className="rounded-full w-24 h-24 object-cover mb-5"
                        />
                        <h1
                            className={`${playFair.className} text-xl font-medium mb-3`}
                        >
                            {item.name}
                        </h1>
                        <p
                            className={`${mulish.className} text-center justify-start text-black/50 text-lg font-light font-['Roboto'] leading-tight`}
                        >
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;
