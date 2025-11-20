// // Centralized API URL constants & helpers

// // Base pieces (adjust here if version/path changes)
// export const API_BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || "";

// // Core builder (kept simple to avoid edge cases with the optional chain above)
// const build = (...parts: string[]) => {
//     const url = parts
//         .map((p) => p.replace(/^\/+|\/+$/g, ""))
//         .filter(Boolean)
//         .join("/");

//     // Don't prepend slash if it's an absolute URL
//     if (url.startsWith("http")) {
//         return url;
//     }

//     return "/" + url;
// };

// // Grouped endpoint constants / factories
// export const API_URLS = {
//     ADMIN: {
//         CREATE: build(API_BASE_PATH, "tenant"),
//         BY_ID: (tenantId: string) => build(API_BASE_PATH, "tenant", tenantId),
//     },
//     USER: {
//         EXISTS: build(API_BASE_PATH, "user", "exists?"),
//         LOGIN: build(API_BASE_PATH, "users", "login"),
//         LOGIN_VIP: build(API_BASE_PATH, "users", "login", "vip"),
//         REGISTER: build(API_BASE_PATH, "users", "register"),
//         PROFILE: build(API_BASE_PATH, "users", "profile"),
//         APPROVE: (userId: string) =>
//             build(API_BASE_PATH, "users", userId, "approve"),
//     },
//     KYC: {
//         SUBMIT: build(API_BASE_PATH, "users", "kyc"),
//         PENDING: build(API_BASE_PATH, "users", "kyc-pending"),
//         APPROVE: (userId: string) =>
//             build(API_BASE_PATH, "users", userId, "approve"), // Assuming this is the correct endpoint for KYC approval
//     },
//     OTP: {
//         VERIFY: build(API_BASE_PATH, "otp", "verify"),
//         RESEND: build(API_BASE_PATH, "otp", "resend"),
//     },
//     DIAMONDS: {
//         ALL: build(API_BASE_PATH, "diamonds", "all"),
//         SEARCH: build(API_BASE_PATH, "diamonds", "search"),
//         FILTER_OPTIONS: build(API_BASE_PATH, "diamonds", "filter-options"),
//         CREATE: build(API_BASE_PATH, "diamonds", "create"),
//         BY_ID: (diamondId: string) =>
//             build(API_BASE_PATH, "diamonds", diamondId),
//         GET_FILES: (diamondId: string, fileType: string) =>
//             build(API_BASE_PATH, "diamonds", "S3Bucket", fileType, diamondId),
//         DELETE_FILE: (diamondId: string, fileType: string) =>
//             build(
//                 API_BASE_PATH,
//                 "diamonds",
//                 "S3Bucket",
//                 "delete",
//                 fileType,
//                 diamondId
//             ),
//     },
//     QUOTATIONS: {
//         ALL: build(API_BASE_PATH, "quotations"),
//         CREATE: build(API_BASE_PATH, "quotations"),
//         BY_ID: (quotationId: string) =>
//             build(API_BASE_PATH, "quotations", quotationId),
//         APPROVE: (quotationId: string) =>
//             build(API_BASE_PATH, "quotations", quotationId, "approve"),
//         REJECT: (quotationId: string) =>
//             build(API_BASE_PATH, "quotations", quotationId, "reject"),
//     },
//     FILES: {
//         UPLOAD_IMAGE: (diamondId: string) =>
//             build(API_BASE_PATH, "files", "upload", "images", diamondId),
//         GET_URL: (fileKey: string) =>
//             build(API_BASE_PATH, "files", "url", fileKey),
//         DELETE: (fileKey: string) => build(API_BASE_PATH, "files", fileKey),
//     },
//     HEALTH: {
//         CHECK: build(API_BASE_PATH, "health"),
//     },
// } as const;

// // Optional: query helper (useful for services building dynamic query strings)
// export const withQuery = (
//     base: string,
//     params?: Record<string, string | number | boolean | undefined>
// ): string => {
//     if (!params) return base;
//     const usp = new URLSearchParams();
//     Object.entries(params).forEach(([k, v]) => {
//         if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
//     });
//     const qs = usp.toString();
//     return qs ? `${base}?${qs}` : base;
// };

// export type ApiUrlMap = typeof API_URLS;
