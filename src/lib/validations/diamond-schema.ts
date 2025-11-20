import { z } from "zod";

export const diamondSchema = z.object({
    _id: z.string(),

    color: z.enum([
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ]),

    clarity: z.enum([
        "FL",
        "IF",
        "Loupe Clean",
        "LC",
        "VVS1",
        "VVS2",
        "VS1",
        "VS2",
        "SI1",
        "SI2",
        "SI3",
        "I1",
        "P1",
        "I2",
        "P2",
        "I3",
        "P3",
    ]),

    rapList: z.number().min(0).optional(),

    pricePerCarat: z.number().min(0).optional(),

    rapnetAmount: z.number().min(0).optional(),

    discount: z.number().max(100).optional(),
    // .min(0)
    cut: z.enum(["I", "EX", "VG", "G", "F", "P"]).optional(),

    polish: z
        .enum(["I", "EX", "VG-EX", "VG", "G-VG", "G", "F-G", "F", "P"])
        .optional(),

    symmetry: z
        .enum(["I", "EX", "VG-EX", "VG", "G-VG", "G", "F-G", "F", "P"])
        .optional(),

    fluorescenceColor: z
        .enum(["B", "W", "Y", "O", "R", "G", "N"])
        .optional()
        .default("N"),

    fluorescenceIntensity: z
        .enum(["VS", "S", "M", "SL", "VSL", "N", "F"])
        .optional()
        .default("N"),

    fluorescence: z.enum(["B", "W", "Y", "O", "R", "G", "N"]).optional(),

    fancyColor: z
        .enum([
            "BK",
            "B",
            "BN",
            "CH",
            "CM",
            "CG",
            "GY",
            "G",
            "O",
            "P",
            "PL",
            "R",
            "V",
            "Y",
            "W",
            "X",
        ])
        .optional()
        .default("X"),

    fancyColorOvertone: z
        .enum([
            "Black",
            "Brown",
            "Brownish",
            "Champagne",
            "Cognac",
            "Chameleon",
            "Violetish",
            "White",
            "Brown-Greenish",
            "Green",
            "Greenish",
            "Purple",
            "Purplish",
            "Orange",
            "Orangey",
            "Violet",
            "Gray",
            "Grayish",
            "None",
            "Yellow",
            "Yellowish",
            "Pink",
            "Pinkish",
            "Blue",
            "Bluish",
            "Red",
            "Reddish",
            "Gray-Greenish",
            "Gray-Yellowish",
            "Orange-Brown",
            "Other",
        ])
        .optional()
        .default("Other"),

    fancyColorIntensity: z
        .enum(["F", "VL", "L", "FCL", "FC", "FCD", "I", "FV", "D", "N"])
        .optional()
        .default("N"),

    laboratory: z
        .enum([
            "GIA",
            "AGS",
            "CGL",
            "DCLA",
            "GCAL",
            "GSI",
            "HRD",
            "IGI",
            "NGTC",
            "None",
            "Other",
            "PGS",
            "VGR",
            "RDC",
            "RDR",
            "GHI",
            "DBIOD",
            "SGL",
        ])
        .optional()
        .default("None"),

    shape: z.enum([
        "Round",
        "Pear",
        "Emerald",
        "Square Emerald",
        "Princess",
        "Marquise",
        "Asscher",
        "Baguette",
        "Tapered Baguette",
        "Tapered Bullet",
        "Calf",
        "Briolette",
        "Bullets",
        "Cushion Brilliant",
        "Cushion Modified",
        "EuropeanCut",
        "Epaulette",
        "Flanders",
        "Half Moon",
        "Heart",
        "Hexagonal",
        "Kite",
        "Lozenge",
        "Octagonal",
        "Old Miner",
        "Oval",
        "Pentagonal",
        "Radiant",
        "Square Radiant",
        "Rose",
        "Shield",
        "Square",
        "Star",
        "Trapezoid",
        "Triangle",
        "Trilliant",
        "Other",
    ]),

    measurements: z.object({
        length: z.number().min(0).optional(),
        width: z.number().min(0).optional(),
        depth: z.number().min(0).optional(),
    }),

    totalDepth: z.number().min(0).max(100).optional(),

    table: z.number().min(0).max(100).optional(),

    certificateNumber: z.string(),

    price: z.number().min(0).optional(),

    size: z.number(),

    noBgm: z.enum(["yes", "no", "bgm"]).optional().default("no"),

    fromTab: z.string().optional().default(""),

    isAvailable: z.enum(["G", "S", "M", "NA"]).optional().default("G"),

    imageUrls: z.array(z.string()).optional().default([]),

    videoUrls: z.array(z.string()).optional().default([]),

    certificateUrls: z.array(z.string()).optional().default([]),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type DiamondType = z.infer<typeof diamondSchema>;
