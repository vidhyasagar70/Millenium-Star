"use client";

import React from "react";
import Image from "next/image";
import HeroImage from "@/../public/assets/abouHero.jpg";
import Container from "@/components/ui/container";
import { ReactLenis, useLenis } from "lenis/react";

import image1 from "../../../public/assets/aboutus-diamond1.png";
import image2 from "../../../public/assets/aboutus-diamond2.png";
import image3 from "../../../public/assets/aboutus-diamond3.png";
import ContentSection from "@/components/landing/aboutusCard";
// Data for the content sections
// Data for the content sections
const aboutUsData = [
    {
        id: 1,
        title: "Introduction: The Allure and Legacy of Diamonds",
        content:
            "Diamonds have long been symbols of eternal love, wealth, and prestige. Their unmatched hardness, mesmerizing brilliance, and storied histories make them objects of fascination for gem lovers, collectors, and investors alike. In this guide, you will delve into every facet of diamonds—from their formation and scientific grading to market dynamics, ethical sourcing, and global trade centres. Think of this as your one-stop diamond encyclopedia.In the world of gems, some people even call diamonds the precious diamond stone, setting them apart as the ultimate gemstone.",
        image: "/assets/diamondKnowledge/WhiteDiamondOnRock.jpg",
    },
    {
        id: 2,
        title: "Origins & Formation: How Diamonds Are Born",
        content:
            "Diamonds are crystalline forms of carbon, created under immense pressure and heat deep within the Earth’s mantle, typically at depths of 140–190 kilometers. Over billions of years, volcanic eruptions transport these gems upward, embedding them in kimberlite and lamproite rocks.Some diamonds are also discovered in alluvial deposits, carried downstream by natural forces. Each stone may contain inclusions or growth patterns that act as unique fingerprints of its formation. A few rare diamonds even have extraterrestrial origins, forming in meteorite impacts or in space, adding to their mystique.",
        image: "/assets/diamondKnowledge/MultipleBlueDiamonds.jpg",
    },
    {
        id: 3,
        title: "The 4Cs of Diamond Quality",
        content:
            "To assess diamond quality, experts rely on the universally recognized 4Cs: cut, color, clarity, and carat weight.\n\n•	Cut determines brilliance, sparkle, and fire. A well-cut diamond reflects light beautifully.\n\n•	Color ranges from D (colorless) to Z (light yellow or brown), with pure color less diamonds being the rarest.\n\n•	Clarity measures internal inclusions or external blemishes. Grades like Flawless or Internally Flawless are exceptionally rare.\n\n•	Carat reflects weight, with larger diamonds generally commanding higher prices, though cut and clarity are equally important.The balance of these factors determines both beauty and value. A smaller, well-cut stone can appear more radiant than a larger but poorly proportioned one.",
        image: "/assets/diamondKnowledge/4cs.jpg",
    },
    {
        id: 4,
        title: "the4Cs",
        content:
            "Diamonds come in different shapes, sizes, color and clarity. No two diamonds are exactly alike i.e each diamond is unique.\n\nThe 4 C's of diamond (Carat, Color, Clarity, Cut) provide a universal method for assessing diamonds characteristics thereby making each diamond distinctive/ exclusive and special. The 4C is now a universal language that helps to communicate diamond quality, decide the value of the diamond and also helps the customer understand what they are buying.",
        image: "/assets/aboutUs1.jpg",
    },
    {
        id: 5,
        title: "Carat",
        content:
            "The weight of diamond is expressed in carat. One carat equals 200 milligrams or 0.20 grams. Each carat is also sub divided into 100 points that allow precise measurement of diamonds to the hundredth decimal place. For instance a diamond that weighs .50 carat can also be referred as 50 pointers.\n\nA diamond price increases with the increase in weight of the diamond. Two diamonds of the same weight may have different values (Price) depending on the other 4Cs i.e color, clarity and cut.",
        image: "/assets/hero2.png",
    },
    {
        id: 6,
        title: "Color",
        content:
            "Most diamonds range in color from colorless to slightly yellow. A diamond is graded on a scale of D to Z representing colorless, and continues with increasing presence of color to the letter Z.\n\nA diamond price changes with the color. The more colorless the diamond, higher is the price.\n\nDiamonds come in all colors of the rainbow i.e yellow, pink, blue, purple, green, orange and red. These diamonds are called fancy color diamonds and come in different hues of light and vivid. The darker (vivid) the color, the more expensive is the stone. The fancy colored diamonds are rare and exclusive and fetch fancy prices. They are one of the most sought after diamonds for investment. The rare stones are generally auctioned.",
        image: "/assets/Diamond-color.webp",
    },
];

const clarityGrades = [
    {
        name: "Flawless",
        description:
            "No inclusions and no blemishes visible under 10x magnification",
    },
    {
        name: "Internally Flawless (IF)",
        description: "No inclusions visible under 10x magnification",
    },
    {
        name: "Very, Very Slightly Included (VVS1 and VVS2)",
        description:
            "Inclusions so slight they are difficult for a skilled grader to see under 10x magnification",
    },
    {
        name: "Very Slightly Included (VS1 and VS2)",
        description:
            "Inclusions are observed with effort under 10x magnification, but can be characterized as minor",
    },
    {
        name: "Slightly Included (SI1 and SI2)",
        description: "Inclusions are noticeable under 10x magnification.",
    },
    {
        name: "Included (I1, I2, and I3)",
        description:
            "Inclusions are obvious under 10x magnification which may affect transparency and brilliance. Also the inclusions are so obvious that they are generally visible through the naked eyes.",
    },
];

const ClaritySection = () => (
    <div className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Clarity</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
            With clarity, we define a diamond's purity. Diamonds occur naturally
            and are a result of carbon exposed to extreme heat and pressure deep
            in the earth. This process can result in a variety of internal
            characteristics called 'inclusions' and external characteristics
            called 'blemishes.
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
            Following are the 6 categories into which the clarity is divided,
            some of which are sub- divided, for a total of 11 specific grades.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left Column: Text Content */}
            <div className="lg:w-1/2 space-y-5">
                {clarityGrades.map((grade) => (
                    <div key={grade.name}>
                        <h3 className="font-semibold text-lg text-gray-800">
                            {grade.name}
                        </h3>
                        <p className="text-gray-600">{grade.description}</p>
                    </div>
                ))}
            </div>

            {/* Right Column: Image */}
            <div className="lg:w-1/2 flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                    <Image
                        src="/assets/dia_know4.jpg"
                        alt="Diamond clarity grades diagram"
                        width={500}
                        height={500}
                        className="object-contain w-full h-auto"
                        quality={100}
                    />
                </div>
            </div>
        </div>

        <p className="text-gray-700 leading-relaxed mt-10">
            Evaluating diamond clarity involves determining the number, size,
            nature, and position of these characteristics, as well as how these
            affect the overall appearance of the stone. While no diamond is
            perfectly pure, the closer it comes to these characteristics, the
            higher its value.
        </p>
    </div>
);

const CutSection = () => (
    <div className="py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            {/* Left Column: Image */}
            <div className="lg:w-1/2 flex items-center justify-center">
                <div className="relative w-full max-w-lg bg-black p-4 rounded-lg shadow-lg">
                    <Image
                        src="/assets/diamond-knowledge5.jpg"
                        alt="Diagram of Diamond Cut and its types"
                        width={600}
                        height={350}
                        className="object-contain w-full h-auto"
                        quality={100}
                    />
                </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Cut</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                        A diamond's cut is essential to its final beauty and
                        value. The cut is divided into 3 grades: Proportion,
                        Polish and Symmetry.
                    </p>
                    <p>
                        Proportions determine the brilliance and 'fire' of a
                        diamond, Symmetry describes the variation of different
                        parameters that define the proportions and Polish
                        describes the finish of the facets. Each grade is
                        evaluated according to four parameters: Excellent, Very
                        Good, Good and Fair.
                    </p>
                    <p>
                        A diamond's cut grade represents how well a diamond's
                        facets interact with light. A perfect cut diamond has
                        more sparkle, brilliance and fire.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const additionalDiamondData = [
    {
        id: 7,
        title: "Famous Diamonds & Record Holders",
        content:
            "The history of diamonds is filled with legendary stones. Among the most celebrated is the Millennium Star, a flawless, pear-shaped diamond weighing over 200 carats. It often appears in discussions of the most precious diamond in the world, admired for both its rarity and unmatched clarity.\n\nOther remarkable diamonds include the Hope Diamond, famed for its striking blue color and mysterious history, and the Cullinan Diamond, which produced several historic stones for the British Crown Jewels. These examples illustrate why diamonds are frequently considered the most expensive stone in the world when sold at auctions or displayed in museums.",
        image: "/assets/diamondKnowledge/ManHoldingDiamond.jpg",
    },
    {
        id: 8,
        title: "Types & Varieties of Diamonds",
        content:
            "While the classic white diamond dominates in popularity, other categories enrich the diamond world.\n\n• Fancy Color Diamonds: Found in hues like pink, blue, and yellow, these gems can exceed the value of colorless stones due to rarity.\n\n• Type IIa Diamonds: Almost free of impurities, these represent some of the purest diamonds ever discovered.\n\n• Industrial Diamonds: Used in cutting, drilling, and grinding for their hardness rather than beauty.\n\n• Lab-Grown Diamonds: Created with advanced technology, chemically identical to natural diamonds, and often more affordable.\n\nEach category adds diversity to the diamond market, catering to collectors, jewellers, and investors.",
        image: "/assets/diamondKnowledge/diamondTypes.png",
    },
    {
        id: 9,
        title: "Certification & Documentation",
        content:
            "Certification is critical in diamond trading. Independent gemological laboratories issue reports that describe a diamond's 4Cs, any treatments, and sometimes its origin. These certificates act as the gemstone's passport, ensuring transparency and trust.\n\nFor buyers interested in certified loose diamonds, a certificate provides assurance of authenticity and helps maintain long-term value. Always match the stone with its report, checking for unique identifiers like laser inscriptions.",
        image: "/assets/cert-2.jpg",
    },
    {
        id: 10,
        title: "Ethical Sourcing in the Diamond Industry",
        content:
            "Diamonds once faced global scrutiny due to the trade in conflict stones. Today, the focus is on responsible sourcing, fair labor practices, and environmentally conscious mining. The role of an ethical diamond supplier is to ensure that every stone is conflict-free and traceable through processes such as the Kimberley Process.\n\nConsumers increasingly want their purchases to reflect their values, making ethical sourcing a major driver in the modern diamond industry.",
        image: "/assets/diamondKnowledge/diamondsOnParcel.jpg",
    },
    {
        id: 11,
        title: "Diamond Trade & Wholesale Markets",
        content:
            "Diamonds flow through complex networks of miners, cutters, wholesalers, and retailers. At the wholesale stage, stones are supplied in bulk to jewellers and dealers worldwide. Wholesale diamonds provide opportunities for professionals to access large inventories at competitive rates.\n\nAntwerp is especially famous as a global diamond hub. Antwerp Belgium diamonds highlight the city's longstanding reputation for excellence. Buyers often seek Antwerp best diamonds because of the region's precise craftsmanship, transparent trade practices, and global credibility.",
        image: "/assets/diamondKnowledge/WhiteDiaondsOnParcels.jpg",
    },
    {
        id: 12,
        title: "Diamonds in Belgium",
        content:
            "Belgium, and particularly Antwerp, remains one of the most trusted centres for diamond trade. It is here that countless stones are sorted, cut, and distributed globally. Discerning buyers often refer to the Best Diamonds in Belgium when searching for stones of superior quality, precise cutting, and verifiable certification.\n\nThe market also caters to collectors and connoisseurs looking for Unique Diamonds in Belgium, whether rare fancy colours, large flawless stones.",
        image: "/assets/diamondKnowledge/diamondHoldind.jpg",
    },
    {
        id: 13,
        title: "Conclusion",
        content:
            "Diamonds are more than stones; they are capsules of geology, craftsmanship, culture, and commerce. Whether your interest is in collecting, gifting, investment, or simply appreciation, a well-chosen diamond is a marvel of nature refined by human skill.\n\nFrom the immaculate brilliance of certified loose diamonds to rare specimens traded in Antwerp, you can approach your acquisition with confidence—armed with knowledge of grading, sourcing, and valuation. May your journey through the world of diamonds lead you to beauty, wisdom, and enduring value.",
        image: "/assets/diamondKnowledge/DiamondIwhtTweezers.jpg",
    },
];

const AboutUs = () => {
    const lenis = useLenis((lenis) => {
        // called every scroll
        console.log(lenis);
    });
    return (
        <div className="min-h-screen bg-white">
            <ReactLenis root />

            {/* Hero Banner */}
            <section className="relative">
                <Image
                    src={HeroImage}
                    width={1200}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                    alt="Legacy Image"
                    className="w-full lg:h-[350px] h-auto object-cover"
                />
                <h1 className="text-3xl md:text-5xl text-white font-semibold font-playfair absolute left-20 top-1/2 -translate-y-1/2">
                    OUR DIAMONDS
                </h1>
            </section>

            <Container className="my-20 px-10">
                <ContentSection data={aboutUsData} />
                <ClaritySection />
                <CutSection />
                <ContentSection data={additionalDiamondData} />
            </Container>
        </div>
    );
};

export default AboutUs;
