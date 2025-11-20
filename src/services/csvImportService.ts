import axios from "axios";

export interface CSVImportResponse {
    success: boolean;
    error?: string;
    message: string;
    replaced?: boolean;
    // New fields for detailed error handling
    results?: Array<{
        file: string;
        status: "success" | "error";
        message: string;
        count?: number;
        duplicates?: string[];
        errors?: Array<{
            type: "column" | "row";
            message?: string;
            certificateNumber?: string;
            errorFields?: string[];
            expected?: string[];
        }>;
    }>;
    totalDiamondsAdded?: number;
    duplicates?: string[];
    duplicatesByFile?: Array<{
        file: string;
        duplicates: string[];
    }>;
}

export interface BatchImportResponse {
    success: boolean;
    error?: string;
    message: string;
    totalFiles?: number;
    totalSuccess?: number;
    totalFailed?: number;
    results?: Array<{
        file: string;
        status: "success" | "error";
        message: string;
        count?: number;
        duplicates?: string[];
        errors?: Array<{
            type: "column" | "row";
            message?: string;
            certificateNumber?: string;
            errorFields?: string[];
            expected?: string[];
        }>;
    }>;
    totalDiamondsAdded?: number;
    duplicates?: string[];
    duplicatesByFile?: Array<{
        file: string;
        duplicates: string[];
    }>;
}

export interface ImportError {
    type: "column" | "row";
    message?: string;
    certificateNumber?: string;
    errorFields?: string[];
    expected?: string[];
}

export interface FileResult {
    file: string;
    status: "success" | "error";
    message: string;
    count?: number;
    duplicates?: string[];
    errors?: ImportError[];
}

export const importCSV = async (file: File): Promise<CSVImportResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post<CSVImportResponse>(
            `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/import-csv`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );

        console.log("CSV import response:", response);
        return response.data;
    } catch (error) {
        console.error("CSV import error:", error);

        // Handle axios errors
        if (axios.isAxiosError(error) && error.response) {
            // Return the error response data if available
            return error.response.data as CSVImportResponse;
        }

        // Fallback error response
        throw new Error(
            error instanceof Error ? error.message : "Import failed"
        );
    }
};

export const importMultipleCSV = async (
    files: File[]
): Promise<BatchImportResponse> => {
    const formData = new FormData();

    // Append all files to the same form data
    files.forEach((file) => {
        formData.append("file", file);
    });

    try {
        const response = await axios.post<BatchImportResponse>(
            `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/import-csv`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log("Batch CSV import response:", response);
        return response.data;
    } catch (error) {
        console.error("Batch import error:", error);

        // Handle axios errors
        if (axios.isAxiosError(error) && error.response) {
            // Return the error response data if available
            return error.response.data as BatchImportResponse;
        }

        // Fallback error response
        throw new Error(
            error instanceof Error ? error.message : "Batch import failed"
        );
    }
};
