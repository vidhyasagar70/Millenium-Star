"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    UploadCloud,
    File,
    X,
    Image,
    Video,
    FileText,
} from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
    fileType: "images" | "videos" | "certificates";
    certificateNumber: string;
    onUploadSuccess?: () => void;
    maxFiles?: number;
    maxSizePerFile?: number; // in MB
}

interface FileUploadBody {
    base64: string;
    size: number;
    fileName: string;
    fileType: string;
}

export const FileUploader = ({
    fileType,
    certificateNumber,
    onUploadSuccess,
    maxFiles = 5,
    maxSizePerFile = 2,
}: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const getFileTypeIcon = () => {
        switch (fileType) {
            case "images":
                return <Image className="w-8 h-8 mb-2 text-gray-500" />;
            case "videos":
                return <Video className="w-8 h-8 mb-2 text-gray-500" />;
            case "certificates":
                return <FileText className="w-8 h-8 mb-2 text-gray-500" />;
            default:
                return <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />;
        }
    };

    const getAcceptedFileTypes = () => {
        switch (fileType) {
            case "images":
                return "image/*";
            case "videos":
                return "video/*";
            case "certificates":
                return ".pdf,.doc,.docx";
            default:
                return "*/*";
        }
    };

    const validateFile = (file: File): boolean => {
        const maxSizeBytes = maxSizePerFile * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            toast.error(
                `${file.name} is too large. Maximum size is ${maxSizePerFile}MB.`
            );
            return false;
        }

        // Additional validation based on file type
        if (fileType === "images" && !file.type.startsWith("image/")) {
            toast.error(`${file.name} is not a valid image file.`);
            return false;
        }

        if (fileType === "videos" && !file.type.startsWith("video/")) {
            toast.error(`${file.name} is not a valid video file.`);
            return false;
        }

        if (
            fileType === "certificates" &&
            ![
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.type)
        ) {
            toast.error(
                `${file.name} is not a valid certificate file. Please upload PDF or DOC files.`
            );
            return false;
        }

        return true;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);

        if (files.length + selectedFiles.length > maxFiles) {
            toast.error(
                `You can upload a maximum of ${maxFiles} files at a time.`
            );
            return;
        }

        const validFiles = selectedFiles.filter(validateFile);
        setFiles((prev) => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            toast.error("Please select files to upload.");
            return;
        }

        if (!certificateNumber.trim()) {
            toast.error("Certificate number is required for file upload.");
            return;
        }

        setIsUploading(true);

        try {
            const fileDetailsPromises = files.map(
                async (file): Promise<FileUploadBody> => {
                    const base64 = await convertFileToBase64(file);
                    return {
                        base64,
                        size: file.size,
                        fileName: file.name,
                        fileType: file.type,
                    };
                }
            );

            const fileDetails = await Promise.all(fileDetailsPromises);
            console.log("File details ready for upload:", fileDetails);

            // Upload files to the diamond inventory API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/S3Bucket/insert/${fileType}/${certificateNumber}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fileDetails }),
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                // Handle different types of error responses
                if (responseData.status >= 500) {
                    // Server errors
                    const errorMessage =
                        responseData.message || "Server error occurred";
                    toast.error(
                        <div className="space-y-2">
                            <p className="font-semibold">Upload Failed</p>
                            <p className="text-sm">{errorMessage}</p>
                            {responseData.data?.failure && (
                                <p className="text-xs text-red-500">
                                    Details:{" "}
                                    {JSON.stringify(responseData.data.failure)}
                                </p>
                            )}
                        </div>
                    );
                } else if (responseData.status >= 400) {
                    // Client errors
                    toast.error(
                        <div className="space-y-2">
                            <p className="font-semibold">Invalid Request</p>
                            <p className="text-sm">{responseData.message}</p>
                        </div>
                    );
                } else {
                    // Generic error
                    toast.error("Failed to upload files. Please try again.");
                }
                return;
            }

            toast.success(
                `${
                    fileType.charAt(0).toUpperCase() + fileType.slice(1)
                } uploaded successfully!`
            );

            setFiles([]);

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.error(`Error uploading ${fileType}:`, error);
            toast.error(
                <div className="space-y-2">
                    <p className="font-semibold">Upload Error</p>
                    <p className="text-sm">
                        {error instanceof Error
                            ? error.message
                            : `Failed to upload ${fileType}. Please try again.`}
                    </p>
                </div>
            );
        } finally {
            setIsUploading(false);
        }
    };

    const getFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2">
                {getFileTypeIcon()}
                <h3 className="font-medium capitalize text-gray-900">
                    Upload {fileType}
                </h3>
            </div>

            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                            or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                            Max {maxFiles} files, {maxSizePerFile}MB each
                        </p>
                    </div>
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                        accept={getAcceptedFileTypes()}
                    />
                </label>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                        Selected Files ({files.length})
                    </p>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 text-sm bg-gray-50 rounded-md border"
                        >
                            <div className="flex items-center gap-2 truncate flex-1">
                                <File className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                <div className="truncate">
                                    <span className="font-medium text-gray-900">
                                        {file.name}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {getFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-red-100"
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Button
                onClick={handleSubmit}
                disabled={isUploading || files.length === 0}
                className="w-full bg-black hover:bg-gray-800 text-white"
            >
                {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading
                    ? `Uploading ${fileType}...`
                    : `Upload ${fileType} (${files.length})`}
            </Button>
        </div>
    );
};
