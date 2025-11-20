import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
    _id: string;
    username: string;
    email: string;
    status: "DEFAULT" | "PENDING" | "APPROVED" | "REJECTED";
    role: "USER" | "ADMIN";
    kyc?: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        phoneNumber: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
        businessInfo?: {
            companyName: string;
            businessType: string;
            registrationNumber: string;
        };
        submittedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    // Load user from localStorage
    const loadUserFromStorage = useCallback(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);

                // Optional: Add timestamp validation
                const currentTime = new Date().getTime();
                const userTimestamp = new Date(
                    userData.timestamp || 0
                ).getTime();
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

                // If data is older than 24 hours, clear it
                if (currentTime - userTimestamp > TWENTY_FOUR_HOURS) {
                    localStorage.removeItem("user");
                    setAuthState({ user: null, loading: false, error: null });
                    return;
                }

                setAuthState({
                    user: userData,
                    loading: false,
                    error: null,
                });
            } else {
                setAuthState({ user: null, loading: false, error: null });
            }
        } catch (error) {
            console.error("Error loading user from storage:", error);
            localStorage.removeItem("user"); // Clear corrupted data
            setAuthState({ user: null, loading: false, error: null });
        }
    }, []);

    // Optional: Fetch fresh user data from backend (for sync)
    const fetchUserProfile = useCallback(async () => {
        try {
            setAuthState((prev) => ({ ...prev, loading: true, error: null }));

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    // User not authenticated, clear localStorage
                    localStorage.removeItem("user");
                    setAuthState({ user: null, loading: false, error: null });
                    return;
                }
                throw new Error(
                    `Failed to fetch user profile: ${response.status}`
                );
            }

            const result = await response.json();

            if (result.success && result.data?.user) {
                const userData = {
                    ...result.data.user,
                    timestamp: new Date().toISOString(),
                };

                // Update localStorage with fresh data
                localStorage.setItem("user", JSON.stringify(userData));

                setAuthState({
                    user: userData,
                    loading: false,
                    error: null,
                });
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Don't clear localStorage on network errors, just use cached data
            setAuthState((prev) => ({
                ...prev,
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Authentication failed",
            }));
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setAuthState((prev) => ({ ...prev, loading: true }));

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/logout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log("Logout response:", data);
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            // Always clear local state and storage
            setAuthState({ user: null, loading: false, error: null });
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("authToken");
            sessionStorage.clear();
            window.location.href = "/"; // Redirect to login
        }
    }, []);

    // Load from localStorage on mount
    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    // Helper functions for permission checking
    const isAuthenticated = () => !!authState.user;

    const isAdmin = () => authState.user?.role === "ADMIN";

    const isApprovedUser = () =>
        authState.user?.role === "USER" &&
        authState.user?.status === "APPROVED";

    const hasStatus = (status: User["status"]) =>
        authState.user?.status === status;

    const hasRole = (role: User["role"]) => authState.user?.role === role;

    return {
        user: authState.user,
        loading: authState.loading,
        error: authState.error,
        isAuthenticated,
        isAdmin,
        isApprovedUser,
        hasStatus,
        hasRole,
        logout,
        refreshUser: fetchUserProfile, // Renamed for clarity
        loadFromStorage: loadUserFromStorage,
    };
};
