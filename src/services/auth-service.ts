import axios from "axios";

// Interfaces based on your API structure

interface User {
    _id: string;
    username: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";
    role: "USER" | "ADMIN";
    kyc: object | null; // Define a more specific KYC interface if needed
}

interface LoginRequest {
    email: string;
    password?: string;
    otp?: string;
}

interface LoginSuccessResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token?: string; // If you use tokens
    };
}

interface ApiErrorResponse {
    success: boolean;
    error: string;
    message?: string;
}

class AuthService {
    async login(credentials: LoginRequest): Promise<User> {
        try {
            const response = await axios.post<LoginSuccessResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
                credentials,
                {
                    withCredentials: true, // Important for cookie-based auth with Axios
                }
            );
            return response.data.data.user;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data as ApiErrorResponse;
                throw new Error(
                    errorData.error ||
                        errorData.message ||
                        "Login failed. Please try again."
                );
            }
            throw new Error("An unexpected error occurred during login.");
        }
    }
}

export const authService = new AuthService();
export type { User, LoginRequest, LoginSuccessResponse, ApiErrorResponse };
