"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { X, Send, Loader2, CheckCircle, XCircle } from "lucide-react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRegistration?: () => void;
}

export function LoginModal({
    isOpen,
    onClose,
    onOpenRegistration,
}: LoginModalProps) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const { loadFromStorage } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Forgot Password states
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
    const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordError, setForgotPasswordError] = useState<
        string | null
    >(null);
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState<
        "none" | "email" | "otp" | "success"
    >("none");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            console.log("Attempting login with:", { email: formData.email });
            console.log("Using API URL:", process.env.NEXT_PUBLIC_BASE_URL);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                    credentials: "include",
                }
            );

            const result = await response.json();
            const contentType = response.headers.get("content-type");
            console.log("Content-Type:", contentType);

            if (!response.ok) {
                const errorMessage = result.error;
                throw new Error(
                    errorMessage || "Login failed. Please try again."
                );
            }

            console.log("Login successful:", result);

            if (result.success) {
                const userData = {
                    id: result.data.user._id,
                    username: result.data.user.username,
                    email: result.data.user.email,
                    status: result.data.user.status,
                    role: result.data.user.role,
                    kyc: result.data.user.kyc || null,
                    loggedIn: true,
                    timestamp: new Date().toISOString(),
                };

                localStorage.setItem("user", JSON.stringify(userData));
                await loadFromStorage();

                onClose();

                if (result.data.user.role === "ADMIN") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/inventory";
                }
            } else {
                throw new Error(result.message || "Login failed");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: "", password: "", rememberMe: false });
        setError("");
        onClose();
    };

    const handleRegistrationClick = () => {
        handleClose();
        if (onOpenRegistration) {
            onOpenRegistration();
        }
    };

    const handleForgotPasswordClick = () => {
        setForgotPasswordStep("email");
        setForgotPasswordEmail("");
        setForgotPasswordOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotPasswordOtpSent(false);
        setForgotPasswordError(null);
        setForgotPasswordSuccess(false);
    };

    const handleCloseForgotPassword = () => {
        setForgotPasswordStep("none");
        setForgotPasswordEmail("");
        setForgotPasswordOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotPasswordOtpSent(false);
        setForgotPasswordError(null);
        setForgotPasswordSuccess(false);
    };

    const sendForgotPasswordOTP = async () => {
        if (!forgotPasswordEmail || !forgotPasswordEmail.includes("@")) {
            setForgotPasswordError("Please enter a valid email address");
            return;
        }
        setForgotPasswordLoading(true);
        setForgotPasswordError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: forgotPasswordEmail }),
                }
            );
            const data = await response.json();
            if (response.ok && data.success) {
                setForgotPasswordStep("otp");
                setForgotPasswordError(null);
            } else {
                throw new Error(data.error || "Failed to send OTP");
            }
        } catch (err) {
            setForgotPasswordError(
                err instanceof Error ? err.message : "Failed to send OTP"
            );
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    const verifyOtpAndShowPasswordFields = () => {
        if (!forgotPasswordOtp || forgotPasswordOtp.length < 4) {
            setForgotPasswordError("Please enter a valid OTP");
            return;
        }
        setForgotPasswordError(null);
        setForgotPasswordStep("success"); // Show password fields
    };

    const resetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setForgotPasswordError(
                "Password must be at least 6 characters long"
            );
            return;
        }
        if (newPassword !== confirmPassword) {
            setForgotPasswordError("Passwords do not match");
            return;
        }
        setForgotPasswordLoading(true);
        setForgotPasswordError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-password`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        newPassword,
                        email: forgotPasswordEmail,
                        otp: forgotPasswordOtp,
                    }),
                }
            );
            const data = await response.json();
            if (response.ok && data.success) {
                setForgotPasswordSuccess(true);
                setForgotPasswordError(null);
                setTimeout(() => {
                    handleCloseForgotPassword();
                }, 2000);
            } else {
                throw new Error(data.error || "Failed to reset password");
            }
        } catch (err) {
            setForgotPasswordError(
                err instanceof Error ? err.message : "Failed to reset password"
            );
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md mx-auto bg-white rounded-lg shadow-xl border-0">
                <div className="flex flex-col items-center space-y-6 p-6">
                    <div className="text-center space-y-2">
                        <DialogTitle className="text-3xl font-bold font-playfair tracking-wide text-gray-800">
                            MILLENNIUM&nbsp;STAR
                        </DialogTitle>
                        <h2 className="text-2xl font-light font-playfair text-gray-700">
                            Login
                        </h2>
                    </div>

                    {/* Main Content Switch */}
                    {forgotPasswordStep === "none" ? (
                        // Login Form
                        <form
                            onSubmit={handleSubmit}
                            className="w-full space-y-4"
                        >
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email address*
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password*
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPasswordClick}
                                    className="text-sm  cursor-pointer hover:underline transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black hover:bg-black text-white py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Logging in..." : "Log in"}
                            </Button>
                        </form>
                    ) : forgotPasswordStep === "email" ? (
                        // Forgot Password: Email Step
                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter your email address
                                </label>
                                <input
                                    type="email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) =>
                                        setForgotPasswordEmail(e.target.value)
                                    }
                                    placeholder="Enter your email address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1  focus:border-transparent"
                                    disabled={forgotPasswordLoading}
                                />
                            </div>
                            {forgotPasswordError && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="flex">
                                        <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">
                                            {forgotPasswordError}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleCloseForgotPassword}
                                    className="flex-1 px-4 py-2 text-gray-700 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={forgotPasswordLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendForgotPasswordOTP}
                                    disabled={
                                        forgotPasswordLoading ||
                                        !forgotPasswordEmail
                                    }
                                    className="flex-1 px-4 py-2 bg-black cursor-pointer  text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {forgotPasswordLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Send OTP
                                </button>
                            </div>
                        </div>
                    ) : forgotPasswordStep === "otp" ? (
                        // Forgot Password: OTP Step
                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP sent to {forgotPasswordEmail}
                                </label>
                                <input
                                    type="text"
                                    value={forgotPasswordOtp}
                                    onChange={(e) =>
                                        setForgotPasswordOtp(e.target.value)
                                    }
                                    placeholder="Enter 4-digit OTP"
                                    maxLength={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-transparent"
                                    disabled={forgotPasswordLoading}
                                />
                            </div>
                            {forgotPasswordError && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="flex">
                                        <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">
                                            {forgotPasswordError}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleCloseForgotPassword}
                                    className="flex-1 px-4 py-2 text-gray-700 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={forgotPasswordLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={verifyOtpAndShowPasswordFields}
                                    disabled={
                                        forgotPasswordLoading ||
                                        !forgotPasswordOtp
                                    }
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-md cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {forgotPasswordLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Verify OTP
                                </button>
                            </div>
                        </div>
                    ) : forgotPasswordStep === "success" ? (
                        // Forgot Password: New Password Step
                        forgotPasswordSuccess ? (
                            <div className="text-center py-4">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Password Reset Successfully!
                                </h4>
                                <p className="text-gray-600">
                                    Your password has been reset successfully.
                                    You can now login with your new password.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Enter new password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-transparent"
                                        disabled={forgotPasswordLoading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 6 characters
                                        long
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirm new password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-transparent"
                                        disabled={forgotPasswordLoading}
                                    />
                                </div>
                                {forgotPasswordError && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <div className="flex">
                                            <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-700">
                                                {forgotPasswordError}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={handleCloseForgotPassword}
                                        className="flex-1 px-4 py-2 text-gray-700 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                        disabled={forgotPasswordLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={resetPassword}
                                        disabled={
                                            forgotPasswordLoading ||
                                            !newPassword ||
                                            !confirmPassword ||
                                            newPassword !== confirmPassword ||
                                            newPassword.length < 6
                                        }
                                        className="flex-1 px-4 py-2 bg-black text-white rounded-md cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        {forgotPasswordLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        )
                    ) : null}

                    {/* Register Link */}
                    {forgotPasswordStep === "none" && (
                        <div className="text-center">
                            <span className="text-gray-600">
                                Don't have an account?{" "}
                            </span>
                            <button
                                onClick={handleRegistrationClick}
                                className="text-gray-800 font-medium hover:underline bg-transparent border-none cursor-pointer"
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
