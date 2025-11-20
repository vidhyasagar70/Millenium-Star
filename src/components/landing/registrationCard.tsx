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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface OTPData {
    email: string;
    otp: string;
}

interface CustomerData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    businessInfo: {
        companyName: string;
        businessType: string;
        vatNumber: string;
        websiteUrl: string;
    };
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
    const [submittedUserData, setSubmittedUserData] = useState<any>(null); // Store user data after submission
    const router = useRouter();

    // Form data states
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [otpData, setOtpData] = useState<OTPData>({
        email: "",
        otp: "",
    });

    const [customerData, setCustomerData] = useState<CustomerData>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        countryCode: "+1",
        address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        },
        businessInfo: {
            companyName: "",
            businessType: "",
            vatNumber: "",
            websiteUrl: "",
        },
    });

    const handleRegisterInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Only allow 4 digits
        if (value.length <= 4 && /^\d*$/.test(value)) {
            setOtpData((prev) => ({
                ...prev,
                otp: value,
            }));
        }
    };

    const handleCustomerInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setCustomerData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }));
        } else if (name.startsWith("businessInfo.")) {
            const businessField = name.split(".")[1];
            setCustomerData((prev) => ({
                ...prev,
                businessInfo: {
                    ...prev.businessInfo,
                    [businessField]: value,
                },
            }));
        } else {
            setCustomerData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateRegisterStep = () => {
        if (!registerData.username.trim()) return "Username is required";
        if (!registerData.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email))
            return "Please enter a valid email address";
        if (!registerData.password.trim()) return "Password is required";
        if (!registerData.confirmPassword.trim())
            return "Confirm password is required";
        if (registerData.password !== registerData.confirmPassword)
            return "Passwords do not match";
        if (registerData.password.length < 6)
            return "Password must be at least 6 characters";
        return null;
    };

    const validateOtpStep = () => {
        if (!otpData.otp.trim()) return "OTP is required";
        if (otpData.otp.length !== 4) return "OTP must be 4 digits";
        return null;
    };

    const validateCustomerStep = () => {
        if (!customerData.firstName.trim()) return "First Name is required";
        if (!customerData.lastName.trim()) return "Last Name is required";
        if (!customerData.phoneNumber.trim()) return "Phone Number is required";
        if (!customerData.countryCode.trim()) return "Country Code is required";
        if (!customerData.address.street.trim())
            return "Street address is required";
        if (!customerData.address.city.trim()) return "City is required";
        if (!customerData.address.state.trim()) return "State is required";
        if (!customerData.address.postalCode.trim())
            return "Postal Code is required";
        if (!customerData.address.country.trim()) return "Country is required";
        if (!customerData.businessInfo.companyName.trim())
            return "Company Name is required";
        if (!customerData.businessInfo.businessType.trim())
            return "Business Type is required";
        if (!customerData.businessInfo.vatNumber.trim())
            return "VAT Number is required";
        return null;
    };

    // Handle registration (step 1)
    const handleRegisterUser = async (): Promise<boolean> => {
        setIsLoading(true);
        setError("");

        try {
            console.log("Registering user:", registerData);

            const registerResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: registerData.username,
                        email: registerData.email,
                        password: registerData.password,
                    }),
                }
            );

            const result = await registerResponse.json();
            console.log("Register response:", result);

            if (!registerResponse.ok) {
                // Parse error from the API response structure
                throw new Error(
                    result.error || result.message || "Registration failed"
                );
            }

            if (result.success) {
                // Set email for OTP verification
                setOtpData((prev) => ({
                    ...prev,
                    email: registerData.email,
                }));
                return true;
            } else {
                // Handle case where response is ok but success is false
                throw new Error(
                    result.error || result.message || "Registration failed"
                );
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Registration failed. Please try again."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification (step 2)
    const handleVerifyOTP = async (): Promise<boolean> => {
        setIsLoading(true);
        setError("");

        try {
            console.log("Verifying OTP:", otpData);

            const otpResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: otpData.email,
                        otp: otpData.otp,
                    }),
                    credentials: "include",
                }
            );

            const result = await otpResponse.json();
            console.log("OTP verification response:", result);

            if (!otpResponse.ok) {
                throw new Error(result.message || "OTP verification failed");
            }

            if (result.success) {
                setIsRegistrationComplete(true);
                return true;
            } else {
                throw new Error(result.message || "OTP verification failed");
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "OTP verification failed. Please try again."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle customer data submission (step 3)
    const handleSubmitCustomerData = async () => {
        setIsLoading(true);
        setError("");

        try {
            console.log("Submitting customer data:", customerData);

            const customerResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/customer-data`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(customerData),
                    credentials: "include",
                }
            );

            const result = await customerResponse.json();
            console.log("Customer data submission response:", result);

            if (!customerResponse.ok) {
                throw new Error(
                    result.message || "Customer data submission failed"
                );
            }

            if (result.success) {
                // Store user data for the success message
                setSubmittedUserData({
                    username: result.data.user.username,
                    email: result.data.user.email,
                    firstName: customerData.firstName,
                    lastName: customerData.lastName,
                    companyName: customerData.businessInfo.companyName,
                });

                // Set registration as complete to show success message
                setIsRegistrationComplete(true);
                setCurrentStep(4); // Move to success step
            } else {
                throw new Error(
                    result.message || "Customer data submission failed"
                );
            }
        } catch (err) {
            console.error("Customer data submission error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Customer data submission failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        setError("");

        if (currentStep === 1) {
            // Validate and register user
            const validationError = validateRegisterStep();
            if (validationError) {
                setError(validationError);
                return;
            }

            const registrationSuccessful = await handleRegisterUser();
            if (registrationSuccessful) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            // Validate and verify OTP
            const validationError = validateOtpStep();
            if (validationError) {
                setError(validationError);
                return;
            }

            const otpSuccessful = await handleVerifyOTP();
            if (otpSuccessful) {
                setCurrentStep(3);
            }
        }
    };

    const handleBack = () => {
        setError("");
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        setError("");
        const customerError = validateCustomerStep();
        if (customerError) {
            setError(customerError);
            return;
        }

        await handleSubmitCustomerData();
    };

    const handleClose = () => {
        setCurrentStep(1);
        setIsRegistrationComplete(false);
        setSubmittedUserData(null);
        setRegisterData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setOtpData({
            email: "",
            otp: "",
        });
        setCustomerData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            countryCode: "+1",
            address: {
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            },
            businessInfo: {
                companyName: "",
                businessType: "",
                vatNumber: "",
                websiteUrl: "",
            },
        });
        setError("");
        onClose();
    };

    const handleBackToLogin = () => {
        handleClose();
        // You can trigger the login modal here if needed
        // onOpenLogin(); // If you have this prop
    };

    const renderRegisterStep = () => (
        <div className="w-full space-y-4">
            <div className="space-y-2">
                <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                >
                    Username*
                </Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={registerData.username}
                    onChange={handleRegisterInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                >
                    Email*
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                />
            </div>

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
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                >
                    Confirm Password*
                </Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                />
            </div>
        </div>
    );

    const renderOtpStep = () => (
        <div className="w-full space-y-4">
            <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                    We've sent a 4-digit verification code to
                </p>
                <p className="text-sm font-medium text-gray-800">
                    {otpData.email}
                </p>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700"
                >
                    Enter 4-digit OTP*
                </Label>
                <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otpData.otp}
                    onChange={handleOtpInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent text-center text-2xl tracking-widest"
                    maxLength={4}
                    required
                />
            </div>

            <div className="text-center">
                <p className="text-xs text-gray-500">
                    Didn't receive the code? Check your spam folder or try
                    again.
                </p>
            </div>
        </div>
    );

    const renderCustomerStep = () => (
        <div className="w-full space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">
                    Personal Information
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="firstName"
                            className="text-sm font-medium text-gray-700"
                        >
                            First Name*
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            value={customerData.firstName}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="lastName"
                            className="text-sm font-medium text-gray-700"
                        >
                            Last Name*
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            value={customerData.lastName}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="countryCode"
                            className="text-sm font-medium text-gray-700"
                        >
                            Country Code*
                        </Label>
                        <select
                            id="countryCode"
                            name="countryCode"
                            value={customerData.countryCode}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        >
                            <option value="+1">+1 (United States / Canada)</option>
                            <option value="+32">+32 (Belgium)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (United Kingdom)</option>
                            <option value="+355">+355 (Albania)</option>
                            <option value="+54">+54 (Argentina)</option>
                            <option value="+43">+43 (Austria)</option>
                            <option value="+375">+375 (Belarus)</option>
                            <option value="+387">+387 (Bosnia &amp; Herzegovina)</option>
                            <option value="+55">+55 (Brazil)</option>
                            <option value="+359">+359 (Bulgaria)</option>
                            <option value="+56">+56 (Chile)</option>
                            <option value="+57">+57 (Colombia)</option>
                            <option value="+385">+385 (Croatia)</option>
                            <option value="+357">+357 (Cyprus)</option>
                            <option value="+420">+420 (Czechia)</option>
                            <option value="+45">+45 (Denmark)</option>
                            <option value="+372">+372 (Estonia)</option>
                            <option value="+358">+358 (Finland)</option>
                            <option value="+33">+33 (France)</option>
                            <option value="+49">+49 (Germany)</option>
                            <option value="+30">+30 (Greece)</option>
                            <option value="+36">+36 (Hungary)</option>
                            <option value="+354">+354 (Iceland)</option>
                            <option value="+353">+353 (Ireland)</option>
                            <option value="+39">+39 (Italy)</option>
                            <option value="+383">+383 (Kosovo)</option>
                            <option value="+371">+371 (Latvia)</option>
                            <option value="+370">+370 (Lithuania)</option>
                            <option value="+352">+352 (Luxembourg)</option>
                            <option value="+356">+356 (Malta)</option>
                            <option value="+52">+52 (Mexico)</option>
                            <option value="+373">+373 (Moldova)</option>
                            <option value="+382">+382 (Montenegro)</option>
                            <option value="+31">+31 (Netherlands)</option>
                            <option value="+389">+389 (North Macedonia)</option>
                            <option value="+47">+47 (Norway)</option>
                            <option value="+51">+51 (Peru)</option>
                            <option value="+48">+48 (Poland)</option>
                            <option value="+351">+351 (Portugal)</option>
                            <option value="+40">+40 (Romania)</option>
                            <option value="+7">+7 (Russia)</option>
                            <option value="+381">+381 (Serbia)</option>
                            <option value="+421">+421 (Slovakia)</option>
                            <option value="+386">+386 (Slovenia)</option>
                            <option value="+34">+34 (Spain)</option>
                            <option value="+46">+46 (Sweden)</option>
                            <option value="+41">+41 (Switzerland)</option>
                            <option value="+380">+380 (Ukraine)</option>
                            <option value="+58">+58 (Venezuela)</option>
                        </select>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label
                            htmlFor="phoneNumber"
                            className="text-sm font-medium text-gray-700"
                        >
                            Phone Number*
                        </Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={customerData.phoneNumber}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">
                    Address Information
                </h4>

                <div className="space-y-2">
                    <Label
                        htmlFor="address.street"
                        className="text-sm font-medium text-gray-700"
                    >
                        Street Address*
                    </Label>
                    <Input
                        id="address.street"
                        name="address.street"
                        type="text"
                        placeholder="Enter your street address"
                        value={customerData.address.street}
                        onChange={handleCustomerInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="address.city"
                            className="text-sm font-medium text-gray-700"
                        >
                            City*
                        </Label>
                        <Input
                            id="address.city"
                            name="address.city"
                            type="text"
                            placeholder="Enter your city"
                            value={customerData.address.city}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="address.state"
                            className="text-sm font-medium text-gray-700"
                        >
                            State*
                        </Label>
                        <Input
                            id="address.state"
                            name="address.state"
                            type="text"
                            placeholder="Enter your state"
                            value={customerData.address.state}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="address.postalCode"
                            className="text-sm font-medium text-gray-700"
                        >
                            Postal/Zip Code*
                        </Label>
                        <Input
                            id="address.postalCode"
                            name="address.postalCode"
                            type="text"
                            placeholder="Enter your postal code"
                            value={customerData.address.postalCode}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="address.country"
                            className="text-sm font-medium text-gray-700"
                        >
                            Country*
                        </Label>
                        <Input
                            id="address.country"
                            name="address.country"
                            type="text"
                            placeholder="Enter your country"
                            value={customerData.address.country}
                            onChange={handleCustomerInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">
                    Business Information
                </h4>

                <div className="space-y-2">
                    <Label
                        htmlFor="businessInfo.companyName"
                        className="text-sm font-medium text-gray-700"
                    >
                        Company Name*
                    </Label>
                    <Input
                        id="businessInfo.companyName"
                        name="businessInfo.companyName"
                        type="text"
                        placeholder="Enter your company name"
                        value={customerData.businessInfo.companyName}
                        onChange={handleCustomerInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="businessInfo.businessType"
                        className="text-sm font-medium text-gray-700"
                    >
                        Business Type*
                    </Label>
                    <select
                        id="businessInfo.businessType"
                        name="businessInfo.businessType"
                        value={customerData.businessInfo.businessType}
                        onChange={handleCustomerInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                        required
                    >
                        <option value="">Select Business Type</option>
                        <option value="Retail">Retail</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Trading">Trading</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="businessInfo.vatNumber"
                        className="text-sm font-medium text-gray-700"
                    >
                        VAT Number*
                    </Label>
                    <Input
                        id="businessInfo.vatNumber"
                        name="businessInfo.vatNumber"
                        type="text"
                        placeholder="Enter your VAT number"
                        value={customerData.businessInfo.vatNumber}
                        onChange={handleCustomerInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="businessInfo.websiteUrl"
                        className="text-sm font-medium text-gray-700"
                    >
                        Website URL (Optional)
                    </Label>
                    <Input
                        id="businessInfo.websiteUrl"
                        name="businessInfo.websiteUrl"
                        type="url"
                        placeholder="Enter your website URL"
                        value={customerData.businessInfo.websiteUrl}
                        onChange={handleCustomerInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    // New success step component
    const renderSuccessStep = () => (
        <div className="w-full space-y-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            {/* Success Title */}
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                    Registration Submitted Successfully!
                </h3>
                <p className="text-gray-600">
                    Thank you for completing your registration,{" "}
                    {submittedUserData?.firstName}!
                </p>
            </div>

            {/* Success Message */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
                <div className="space-y-3">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-blue-800">
                                What happens next?
                            </h4>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="space-y-2">
                                    <li>
                                        • Your KYC information has been
                                        submitted for admin review
                                    </li>
                                    <li>
                                        • You will receive an email notification
                                        once your account is approved
                                    </li>
                                    <li>
                                        • This process typically takes 24-48
                                        hours
                                    </li>
                                    <li>
                                        • Once approved, you can log in and
                                        access the diamond inventory
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Details Summary */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Registration Summary:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Username:</span>
                        <span className="font-medium">
                            {submittedUserData?.username}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">
                            {submittedUserData?.email}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">
                            {submittedUserData?.firstName}{" "}
                            {submittedUserData?.lastName}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Company:</span>
                        <span className="font-medium">
                            {submittedUserData?.companyName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="text-sm text-gray-500">
                <p>
                    If you have any questions, please contact our support team
                    at{" "}
                    <Link
                        href="/contact"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={handleClose}
                    >
                        {/* support@diamondelite.com */}
                        support@companyname.com
                    </Link>
                </p>
            </div>
        </div>
    );

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Create Account";
            case 2:
                return "Verify Email";
            case 3:
                return "Customer Details";
            case 4:
                return "Registration Complete";
            default:
                return "Register";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md min-w-lg mx-auto bg-white rounded-lg shadow-xl border-0 max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col items-center space-y-6 p-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <DialogTitle className="text-3xl font-bold font-playfair tracking-wide text-gray-800">
                            MILLENNIUM&nbsp;STAR
                        </DialogTitle>
                        <h2 className="text-2xl font-light font-playfair text-gray-700">
                            {getStepTitle()}
                        </h2>
                        {currentStep < 4 && (
                            <div className="text-sm text-gray-500">
                                Step {currentStep} of 3
                            </div>
                        )}
                    </div>

                    {/* Step Content */}
                    {currentStep === 1 && renderRegisterStep()}
                    {currentStep === 2 && renderOtpStep()}
                    {currentStep === 3 && renderCustomerStep()}
                    {currentStep === 4 && renderSuccessStep()}

                    {/* Error Message */}
                    {error && currentStep < 4 && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded w-full">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="w-full space-y-3">
                        {currentStep === 4 ? (
                            /* Success step buttons */
                            <div className="space-y-3">
                                <Button
                                    onClick={handleBackToLogin}
                                    className="w-full bg-black hover:bg-black text-white py-3 rounded-full font-medium transition-colors"
                                >
                                    Continue to Login
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full font-medium transition-colors"
                                >
                                    Close
                                </Button>
                            </div>
                        ) : currentStep < 3 ? (
                            <Button
                                onClick={handleNext}
                                disabled={isLoading}
                                className="w-full bg-black hover:bg-black text-white py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? currentStep === 1
                                        ? "Sending OTP..."
                                        : "Verifying..."
                                    : "Next"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-black hover:bg-black text-white py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? "Submitting..."
                                    : "Complete Registration"}
                            </Button>
                        )}

                        {currentStep > 1 && currentStep < 4 && (
                            <Button
                                onClick={handleBack}
                                variant="outline"
                                disabled={isLoading}
                                className="w-full border-black text-black hover:bg-gray-50 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back
                            </Button>
                        )}
                    </div>

                    {/* Login Link - only show on non-success steps */}
                    {currentStep < 4 && (
                        <div className="text-center">
                            <span className="text-gray-600">
                                Already have an account?{" "}
                            </span>
                            <Link
                                href="#"
                                className="text-gray-800 font-medium hover:underline"
                                onClick={handleClose}
                            >
                                Log in
                            </Link>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
