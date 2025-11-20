"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string; // Add this field
    message: string;
}

// European country codes data
const europeanCountryCodes = [
    { code: "+355", country: "Albania" },
    { code: "+376", country: "Andorra" },
    { code: "+43", country: "Austria" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+359", country: "Bulgaria" },
    { code: "+385", country: "Croatia" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Republic" },
    { code: "+45", country: "Denmark" },
    { code: "+372", country: "Estonia" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+30", country: "Greece" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+353", country: "Ireland" },
    { code: "+39", country: "Italy" },
    { code: "+383", country: "Kosovo" },
    { code: "+371", country: "Latvia" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+389", country: "North Macedonia" },
    { code: "+356", country: "Malta" },
    { code: "+373", country: "Moldova" },
    { code: "+377", country: "Monaco" },
    { code: "+382", country: "Montenegro" },
    { code: "+31", country: "Netherlands" },
    { code: "+47", country: "Norway" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+40", country: "Romania" },
    { code: "+7", country: "Russia" },
    { code: "+378", country: "San Marino" },
    { code: "+381", country: "Serbia" },
    { code: "+421", country: "Slovakia" },
    { code: "+386", country: "Slovenia" },
    { code: "+34", country: "Spain" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+90", country: "Turkey" },
    { code: "+380", country: "Ukraine" },
    { code: "+44", country: "United Kingdom" },
    { code: "+379", country: "Vatican City" },
];

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        countryCode: "+33", // Default to France
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isMessageSent, setIsMessageSent] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Message sent successfully!");
                setIsMessageSent(true);
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    countryCode: "+33", // Reset to default
                    message: "",
                });
            } else {
                toast.error(result.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendAnother = () => {
        setIsMessageSent(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Image Section */}
                    <div className="relative hidden md:block h-[500px] lg:h-[600px]">
                        <Image
                            src="/assets/contact-diamond1.png"
                            alt="Luxury diamonds collection"
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>

                    {/* Right Form Section */}
                    <div className="bg-gray-100 p-8 lg:p-12 rounded-lg">
                        <div className="max-w-md mx-auto">
                            {!isMessageSent ? (
                                <>
                                    <h2 className="text-zinc-800 text-3xl font-semibold md:text-5xl mb-6 font-['Gloock']">
                                        Get in touch
                                    </h2>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Name Fields */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="firstName"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="Alex"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="lastName"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="your.name@gmail.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                                required
                                            />
                                        </div>

                                        {/* Phone Field */}
                                        <div className="flex gap-3">
                                            <div className="space-y-2 w-32">
                                                <Label
                                                    htmlFor="countryCode"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Country Code
                                                </Label>
                                                <select
                                                    id="countryCode"
                                                    name="countryCode"
                                                    value={formData.countryCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                                                    required
                                                >
                                                    {europeanCountryCodes.map(
                                                        (country) => (
                                                            <option
                                                                key={
                                                                    country.code
                                                                }
                                                                value={
                                                                    country.code
                                                                }
                                                            >
                                                                {country.code}{" "}
                                                                {
                                                                    country.country
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <Label
                                                    htmlFor="phoneNumber"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    type="tel"
                                                    placeholder="123 456 789"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Message Field */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="message"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Your Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 min-h-[100px] resize-none"
                                                required
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading
                                                ? "Sending Message..."
                                                : "Send Message"}
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                /* Success Message */
                                <div className="text-center space-y-6">
                                    {/* Success Icon */}
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>

                                    {/* Success Title */}
                                    <h2 className="text-zinc-800 text-3xl font-semibold font-['Gloock']">
                                        Message Sent Successfully!
                                    </h2>

                                    {/* Success Description */}
                                    <div className="space-y-4">
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Thank you for reaching out to us.
                                            Your message has been successfully
                                            sent to our admin team.
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            We typically respond within 24-48
                                            hours. A confirmation email has been
                                            sent to your email address.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3 pt-4">
                                        <Button
                                            onClick={handleSendAnother}
                                            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 font-medium transition-colors"
                                        >
                                            Send Another Message
                                        </Button>
                                        <Link href="/">
                                            <Button
                                                variant="outline"
                                                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 font-medium transition-colors"
                                            >
                                                Back to Home
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
        </div>
    );
}
