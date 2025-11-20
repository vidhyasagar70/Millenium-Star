"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface RapnetUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    uploadData: RapnetUploadData | null;
    error: string | null;
    onRetry: () => void;
}

interface RapnetUploadData {
    uploadID: number;
    uploadType: string;
    fileFormat: string;
    stockReplaced: boolean;
    dateUploaded: string;
    status: string;
    errorMessages: string | null;
    warningMessages: string | null;
    numLotReceived: number;
    numValidLots: number;
    numInvalidLots: number;
    startTime: string;
    endTime: string;
    lastUpdated: string;
    duration: string | null;
    progressPercent: number;
    waitingINQueue: number;
}

export function RapnetUploadModal({
    isOpen,
    onClose,
    isLoading,
    uploadData,
    error,
    onRetry,
}: RapnetUploadModalProps) {
    const getStatusIcon = () => {
        if (isLoading) {
            return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
        }
        if (error) {
            return <XCircle className="h-6 w-6 text-red-500" />;
        }
        if (uploadData?.status === "Finished successfully") {
            return <CheckCircle className="h-6 w-6 text-green-500" />;
        }
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    };

    const getStatusColor = () => {
        if (error) return "text-red-600";
        if (uploadData?.status === "Finished successfully")
            return "text-green-600";
        return "text-yellow-600";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getStatusIcon()}
                        Rapnet Upload Status
                    </DialogTitle>
                    <DialogDescription>
                        Upload status and results from Rapnet.com
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {isLoading &&
                        uploadData?.status !== "Finished successfully" && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                                <div className="text-center">
                                    <p className="font-medium">
                                        Processing Upload...
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Please wait while we upload your data to
                                        Rapnet
                                    </p>
                                </div>
                            </div>
                        )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                <h3 className="font-medium text-red-800">
                                    Upload Failed
                                </h3>
                            </div>
                            <p className="text-red-700 text-sm">{error}</p>
                            <Button
                                onClick={onRetry}
                                variant="outline"
                                size="sm"
                                className="mt-3 border-red-300 text-red-700 hover:bg-red-50"
                            >
                                Retry Upload
                            </Button>
                        </div>
                    )}

                    {uploadData && (
                        <div className="space-y-4">
                            {/* Status Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium mb-3">
                                    Upload Summary
                                </h3>

                                {!uploadData.stockReplaced ? (
                                    // Show spinner while stock is not replaced
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mr-3 text-blue-500" />
                                        <div className="text-center">
                                            <p className="font-medium text-gray-700">
                                                Processing stock replacement...
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Progress:{" "}
                                                {uploadData.progressPercent}%
                                            </p>
                                            {uploadData.status && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Status: {uploadData.status}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // Show full summary when stock is replaced
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Status
                                            </p>
                                            <p
                                                className={`font-medium ${getStatusColor()}`}
                                            >
                                                {uploadData.status}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Upload ID
                                            </p>
                                            <p className="font-mono text-sm">
                                                {uploadData.uploadID}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Upload Type
                                            </p>
                                            <p className="font-medium">
                                                {uploadData.uploadType}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                File Format
                                            </p>
                                            <p className="font-medium">
                                                {uploadData.fileFormat}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Only show remaining sections when stock is replaced */}
                            {uploadData.stockReplaced && (
                                <>
                                    {/* Lot Statistics */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h3 className="font-medium mb-3">
                                            Lot Statistics
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {uploadData.numLotReceived}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Total Received
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">
                                                    {uploadData.numValidLots}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Valid Lots
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-red-600">
                                                    {uploadData.numInvalidLots}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Invalid Lots
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timing Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium mb-3">
                                            Timing Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">
                                                    Date Uploaded
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        uploadData.dateUploaded
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">
                                                    Last Updated
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        uploadData.lastUpdated
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">
                                                    Start Time
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        uploadData.startTime
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">
                                                    End Time
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        uploadData.endTime
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                                Stock Replaced:
                                            </span>
                                            <span
                                                className={
                                                    uploadData.stockReplaced
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {uploadData.stockReplaced
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </div>
                                        {/* <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                                Progress:
                                            </span>
                                            <span className="font-medium">
                                                {uploadData.progressPercent}%
                                            </span>
                                        </div> */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                                Waiting in Queue:
                                            </span>
                                            <span className="font-medium">
                                                {uploadData.waitingINQueue}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Error and Warning Messages */}
                                    {uploadData.errorMessages && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-medium text-red-800 mb-2">
                                                Error Messages
                                            </h4>
                                            <p className="text-red-700 text-sm">
                                                {uploadData.errorMessages}
                                            </p>
                                        </div>
                                    )}

                                    {uploadData.warningMessages && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-medium text-yellow-800 mb-2">
                                                Warning Messages
                                            </h4>
                                            <p className="text-yellow-700 text-sm">
                                                {uploadData.warningMessages}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={onClose} variant="outline">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
