import {
    Diamond,
    Gem,
    Circle,
    Square,
    Heart,
    Octagon,
    Star as StarIcon,
    Triangle,
} from "lucide-react";

export const shape_options = [
    { value: "Round", label: "Round", icon: Circle },
    { value: "Radiant", label: "Radiant", icon: Square },
    { value: "Pear", label: "Pear", icon: Diamond },
    { value: "Square", label: "Square", icon: Square },
    { value: "Emerald", label: "Emerald", icon: Octagon },
    { value: "Cushion Modified", label: "Cushion", icon: Octagon },
    { value: "Oval", label: "Oval", icon: Circle },
    { value: "Trilliant", label: "Trilliant", icon: Triangle },
    { value: "Heart", label: "Heart", icon: Heart },
    { value: "Princess", label: "Princess", icon: Square },
    { value: "Marquise", label: "Marquise", icon: Diamond },
    { value: "others", label: "others", icon: Gem },
    { value: "Asscher", label: "Asscher", icon: Square },
    { value: "Baguette", label: "Baguette", icon: Square },
    { value: "Tapered Baguette", label: "Tapered Baguette", icon: Square },
    { value: "Square Emerald", label: "Square Emerald", icon: Square },
    // { value: "Tapered Bullet", label: "Tapered Bullet", icon: Diamond },
    // { value: "Calf", label: "Calf", icon: Diamond },
    // { value: "Briolette", label: "Briolette", icon: Diamond },
    // { value: "Bullets", label: "Bullets", icon: Diamond },
    // { value: "Cushion Brilliant", label: "Cushion Brilliant", icon: Square },
    // { value: "Cushion Modified", label: "Cushion Modified", icon: Square },
    // { value: "EuropeanCut", label: "European Cut", icon: Circle },
    // { value: "Epaulette", label: "Epaulette", icon: Diamond },
    // { value: "Flanders", label: "Flanders", icon: Square },
    // { value: "Half Moon", label: "Half Moon", icon: Circle },
    // { value: "Hexagonal", label: "Hexagonal", icon: Octagon },
    // { value: "Kite", label: "Kite", icon: Diamond },
    // { value: "Lozenge", label: "Lozenge", icon: Diamond },
    // { value: "Octagonal", label: "Octagonal", icon: Octagon },
    // { value: "Old Miner", label: "Old Miner", icon: Circle },
    // { value: "Pentagonal", label: "Pentagonal", icon: Octagon },
    // { value: "Square Radiant", label: "Square Radiant", icon: Square },
    // { value: "Rose", label: "Rose", icon: Circle },
    // { value: "Shield", label: "Shield", icon: Diamond },
    // { value: "Star", label: "Star", icon: StarIcon },
    // { value: "Trapezoid", label: "Trapezoid", icon: Square },
    // { value: "Triangle", label: "Triangle", icon: Triangle },
    // { value: "Other", label: "Other", icon: Gem },
];

export const color_options = [
    { value: "D", label: "D", icon: Gem },
    { value: "E", label: "E", icon: Gem },
    { value: "F", label: "F", icon: Gem },
    { value: "G", label: "G", icon: Gem },
    { value: "H", label: "H", icon: Gem },
    { value: "I", label: "I", icon: Gem },
    { value: "J", label: "J", icon: Gem },
    { value: "K", label: "K", icon: Gem },
    { value: "L", label: "L", icon: Gem },
    { value: "M", label: "M", icon: Gem },
    { value: "N", label: "N", icon: Gem },
    { value: "O", label: "O", icon: Gem },
    { value: "P", label: "P", icon: Gem },
    { value: "Q", label: "Q", icon: Gem },
    { value: "R", label: "R", icon: Gem },
    { value: "S", label: "S", icon: Gem },
    { value: "T", label: "T", icon: Gem },
    { value: "U", label: "U", icon: Gem },
    { value: "V", label: "V", icon: Gem },
    { value: "W", label: "W", icon: Gem },
    { value: "X", label: "X", icon: Gem },
    { value: "Y", label: "Y", icon: Gem },
    { value: "Z", label: "Z", icon: Gem },
    // { value: "others", label: "others", icon: Gem },
];

export const clarity_options = [
    { value: "FL", label: "FL", icon: Gem },
    { value: "IF", label: "IF", icon: Gem },
    { value: "LC", label: "LC", icon: Gem },
    { value: "VVS1", label: "VVS1", icon: Gem },
    { value: "VVS2", label: "VVS2", icon: Gem },
    { value: "VS1", label: "VS1", icon: Gem },
    { value: "VS2", label: "VS2", icon: Gem },
    { value: "SI1", label: "SI1", icon: Gem },
    { value: "SI2", label: "SI2", icon: Gem },
    { value: "SI3", label: "SI3", icon: Gem },
    { value: "I1", label: "I1", icon: Gem },
    // { value: "P1", label: "P1", icon: Gem },
    { value: "I2", label: "I2", icon: Gem },
    // { value: "P2", label: "P2", icon: Gem },
    { value: "I3", label: "I3", icon: Gem },
    // { value: "P3", label: "P3", icon: Gem },
];

export const cut_options = [
    { value: "EX", label: "Excellent", icon: Gem },
    { value: "VG", label: "Very Good", icon: Gem },
    { value: "G", label: "Good", icon: Gem },
    { value: "F", label: "Fair", icon: Gem },
    { value: "I", label: "Ideal", icon: Gem },
    { value: "P", label: "Poor", icon: Gem },
];

export const polish_options = [
    { value: "EX", label: "Excellent", icon: Gem },
    { value: "VG", label: "Very Good", icon: Gem },
    { value: "G", label: "Good", icon: Gem },
    { value: "F", label: "Fair", icon: Gem },
    { value: "I", label: "Ideal", icon: Gem },
    { value: "VG-EX", label: "Very Good-Excellent", icon: Gem },
    { value: "G-VG", label: "Good-Very Good", icon: Gem },
    { value: "F-G", label: "Fair-Good", icon: Gem },
    { value: "P", label: "Poor", icon: Gem },
];

export const symmetry_options = [
    { value: "EX", label: "Excellent", icon: Gem },
    { value: "VG", label: "Very Good", icon: Gem },
    { value: "G", label: "Good", icon: Gem },
    { value: "F", label: "Fair", icon: Gem },
    { value: "I", label: "Ideal", icon: Gem },
    { value: "VG-EX", label: "Very Good-Excellent", icon: Gem },
    { value: "G-VG", label: "Good-Very Good", icon: Gem },
    { value: "F-G", label: "Fair-Good", icon: Gem },
    { value: "P", label: "Poor", icon: Gem },
];

// Fluorescence Color options
export const fluorescenceColor_options = [
    { value: "B", label: "Blue", icon: Gem },
    { value: "W", label: "White", icon: Gem },
    { value: "Y", label: "Yellow", icon: Gem },
    { value: "O", label: "Orange", icon: Gem },
    { value: "R", label: "Red", icon: Gem },
    { value: "G", label: "Green", icon: Gem },
    { value: "N", label: "None", icon: Gem },
];

// Fluorescence Intensity options
export const fluorescenceIntensity_options = [
    { value: "VS", label: "V. Strong", icon: Gem },
    { value: "S", label: "Strong", icon: Gem },
    { value: "M", label: "Medium", icon: Gem },
    { value: "SL", label: "Slight", icon: Gem },
    { value: "VSL", label: "V. Slight", icon: Gem },
    { value: "F", label: "Faint", icon: Gem },
    { value: "N", label: "None", icon: Gem },
];

// Keep flou_options for backward compatibility
export const flou_options = fluorescenceColor_options;

export const lab_options = [
    { value: "GIA", label: "GIA", icon: Gem },
    { value: "AGS", label: "AGS", icon: Gem },
    { value: "CGL", label: "CGL", icon: Gem },
    { value: "DCLA", label: "DCLA", icon: Gem },
    { value: "GCAL", label: "GCAL", icon: Gem },
    { value: "GSI", label: "GSI", icon: Gem },
    { value: "HRD", label: "HRD", icon: Gem },
    { value: "IGI", label: "IGI", icon: Gem },
    { value: "NGTC", label: "NGTC", icon: Gem },
    { value: "None", label: "None", icon: Gem },
    { value: "Other", label: "Other", icon: Gem },
    { value: "PGS", label: "PGS", icon: Gem },
    { value: "VGR", label: "VGR", icon: Gem },
    { value: "RDC", label: "RDC", icon: Gem },
    { value: "RDR", label: "RDR", icon: Gem },
    { value: "GHI", label: "GHI", icon: Gem },
    { value: "DBIOD", label: "DBIOD", icon: Gem },
    { value: "SGL", label: "SGL", icon: Gem },
];

export const availability_options = [
    { value: "G", label: "Good/Available", icon: Gem },
    { value: "S", label: "Sold", icon: Gem },
    { value: "M", label: "Memo", icon: Gem },
    { value: "NA", label: "Not Available", icon: Gem },
];

export const fancyColor_options = [
    { value: "BK", label: "Black", icon: Gem },
    { value: "B", label: "Blue", icon: Gem },
    { value: "BN", label: "Brown", icon: Gem },
    { value: "CH", label: "Champagne", icon: Gem },
    { value: "CM", label: "Cognac", icon: Gem },
    { value: "CG", label: "Chameleon", icon: Gem },
    { value: "GY", label: "Gray", icon: Gem },
    { value: "G", label: "Green", icon: Gem },
    { value: "O", label: "Orange", icon: Gem },
    { value: "P", label: "Pink", icon: Gem },
    { value: "PL", label: "Purple", icon: Gem },
    { value: "R", label: "Red", icon: Gem },
    { value: "V", label: "Violet", icon: Gem },
    { value: "Y", label: "Yellow", icon: Gem },
    { value: "W", label: "White", icon: Gem },
    { value: "X", label: "Other", icon: Gem },
];

// FANCY COLOR OVERTONE OPTIONS
export const fancyColorOvertone_options = [
    { value: "Black", label: "Black", icon: Gem },
    { value: "Brown", label: "Brown", icon: Gem },
    { value: "Brownish", label: "Brownish", icon: Gem },
    { value: "Champagne", label: "Champagne", icon: Gem },
    { value: "Cognac", label: "Cognac", icon: Gem },
    { value: "Chameleon", label: "Chameleon", icon: Gem },
    { value: "Violetish", label: "Violetish", icon: Gem },
    { value: "White", label: "White", icon: Gem },
    { value: "Brown-Greenish", label: "Brown-Greenish", icon: Gem },
    { value: "Green", label: "Green", icon: Gem },
    { value: "Greenish", label: "Greenish", icon: Gem },
    { value: "Purple", label: "Purple", icon: Gem },
    { value: "Purplish", label: "Purplish", icon: Gem },
    { value: "Orange", label: "Orange", icon: Gem },
    { value: "Orangey", label: "Orangey", icon: Gem },
    { value: "Violet", label: "Violet", icon: Gem },
    { value: "Gray", label: "Gray", icon: Gem },
    { value: "Grayish", label: "Grayish", icon: Gem },
    { value: "None", label: "None", icon: Gem },
    { value: "Yellow", label: "Yellow", icon: Gem },
    { value: "Yellowish", label: "Yellowish", icon: Gem },
    { value: "Pink", label: "Pink", icon: Gem },
    { value: "Pinkish", label: "Pinkish", icon: Gem },
    { value: "Blue", label: "Blue", icon: Gem },
    { value: "Bluish", label: "Bluish", icon: Gem },
    { value: "Red", label: "Red", icon: Gem },
    { value: "Reddish", label: "Reddish", icon: Gem },
    { value: "Gray-Greenish", label: "Gray-Greenish", icon: Gem },
    { value: "Gray-Yellowish", label: "Gray-Yellowish", icon: Gem },
    { value: "Orange-Brown", label: "Orange-Brown", icon: Gem },
    { value: "Other", label: "Other", icon: Gem },
];

// FANCY COLOR INTENSITY OPTIONS - Updated to match schema
export const fancyColorIntensity_options = [
    { value: "F", label: "Faint", icon: Gem },
    { value: "VL", label: "Very Light", icon: Gem },
    { value: "L", label: "Light", icon: Gem },
    { value: "FCL", label: "Fancy Light", icon: Gem },
    { value: "FC", label: "Fancy", icon: Gem },
    { value: "FCD", label: "Fancy Dark", icon: Gem },
    { value: "I", label: "Intense", icon: Gem },
    { value: "FV", label: "Fancy Vivid", icon: Gem },
    { value: "D", label: "Deep", icon: Gem },
    { value: "N", label: "None", icon: Gem },
];

export const noBgm_options = [
    { value: "yes", label: "Yes", icon: Gem },
    { value: "no", label: "No", icon: Gem },
    { value: "bgm", label: "BGM", icon: Gem },
];
