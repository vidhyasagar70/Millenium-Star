import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export interface EmailExportRequest {
    emails: string[];
    category?: "fancy" | "high" | "low";
    filters?: any;
    sortField?: string;
    sortOrder?: "asc" | "desc";
}

export interface EmailExportResponse {
    success: boolean;
    message: string;
}

class EmailService {
    private api;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 30000, // 30 seconds timeout
        });
    }

    /**
     * Send CSV export email to multiple recipients
     * @param data - Email export request data
     * @returns Promise with the response
     */
    async sendCsvExport(
        data: EmailExportRequest
    ): Promise<EmailExportResponse> {
        try {
            let url = "/diamonds/email-export-csv";

            // If we have filters (current view), append them as query parameters
            if (data.filters && Object.keys(data.filters).length > 0) {
                const params = new URLSearchParams();

                // Add sorting parameters
                if (data.sortField) {
                    params.set("sortBy", data.sortField);
                }
                if (data.sortOrder) {
                    params.set("sortOrder", data.sortOrder);
                }

                // Add filter parameters
                Object.entries(data.filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        // Handle array values - append each value separately
                        if (Array.isArray(value)) {
                            value.forEach((val) => {
                                params.append(key, val.toString());
                            });
                        } else {
                            params.set(key, value.toString());
                        }
                    }
                });

                url += `?${params.toString()}`;
            }
            // If we have a category (predefined filters), add it as query parameter
            else if (data.category) {
                url += `?category=${data.category}`;
            }

            console.log("🔍 Email export URL:", url);
            console.log("🔍 Email export body:", { emails: data.emails });

            const response = await this.api.post<EmailExportResponse>(url, {
                emails: data.emails, // Only send emails in body
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                if (error.response) {
                    // Server responded with error status
                    const errorMessage =
                        error.response.data?.message ||
                        "Failed to send email report";
                    throw new Error(errorMessage);
                } else if (error.request) {
                    // Request was made but no response received
                    throw new Error(
                        "Network error: Unable to reach the server"
                    );
                } else {
                    // Something else happened
                    throw new Error("Request failed: " + error.message);
                }
            }

            // Handle non-Axios errors
            throw new Error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        }
    }

    /**
     * Validate email addresses
     * @param emails - Array of email addresses to validate
     * @returns Object with validation result and invalid emails
     */
    validateEmails(emails: string[]): {
        isValid: boolean;
        invalidEmails: string[];
    } {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter(
            (email) => !emailRegex.test(email.trim())
        );

        return {
            isValid: invalidEmails.length === 0,
            invalidEmails,
        };
    }

    /**
     * Parse comma-separated email string into array
     * @param emailString - Comma-separated email string
     * @returns Array of trimmed email addresses
     */
    parseEmailString(emailString: string): string[] {
        return emailString
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email.length > 0);
    }
}

export const emailService = new EmailService();
