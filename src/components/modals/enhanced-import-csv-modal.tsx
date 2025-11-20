import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Loader2,
    FileText,
    FileSpreadsheet,
    X,
    AlertTriangle,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import {
    importCSV,
    importMultipleCSV,
    BatchImportResponse,
    FileResult,
    ImportError,
} from "@/services/csvImportService";
import {
    convertExcelToCSV,
    createCSVFile,
    ExcelSheet,
} from "@/services/excelToCsvService";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EnhancedImportCSVModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ProcessedFile {
    originalFile: File;
    csvFile?: File;
    isExcel: boolean;
    sheets?: ExcelSheet[];
}

export function EnhancedImportCSVModal({
    isOpen,
    onClose,
    onSuccess,
}: EnhancedImportCSVModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [importResults, setImportResults] =
        useState<BatchImportResponse | null>(null);
    const [showResults, setShowResults] = useState(false);

    // Excel conversion states
    const [excelSheets, setExcelSheets] = useState<ExcelSheet[]>([]);
    const [selectedSheets, setSelectedSheets] = useState<Set<string>>(
        new Set()
    );
    const [showSheetSelection, setShowSheetSelection] = useState(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (selectedFiles.length === 0) return;

        setFiles(selectedFiles);
        setExcelSheets([]);
        setSelectedSheets(new Set());
        setShowSheetSelection(false);
        setProcessedFiles([]);
        setImportResults(null);
        setShowResults(false);

        setIsProcessing(true);

        try {
            const processed: ProcessedFile[] = [];
            const allSheets: ExcelSheet[] = [];

            for (const file of selectedFiles) {
                const isExcel =
                    file.name.toLowerCase().endsWith(".xlsx") ||
                    file.name.toLowerCase().endsWith(".xls");

                if (isExcel) {
                    const conversionResult = await convertExcelToCSV(file);
                    processed.push({
                        originalFile: file,
                        isExcel: true,
                        sheets: conversionResult.sheets,
                    });

                    // Add prefix to sheet names to avoid conflicts between files
                    const prefixedSheets = conversionResult.sheets.map(
                        (sheet) => ({
                            ...sheet,
                            name: `${file.name.replace(/\.xlsx?$/i, "")}_${
                                sheet.name
                            }`,
                            originalFileName: file.name,
                        })
                    );

                    allSheets.push(...prefixedSheets);
                } else {
                    // CSV file - no conversion needed
                    processed.push({
                        originalFile: file,
                        csvFile: file,
                        isExcel: false,
                    });
                }
            }

            setProcessedFiles(processed);

            if (allSheets.length > 0) {
                setExcelSheets(allSheets);
                setShowSheetSelection(true);

                // Auto-select all sheets by default
                const allSheetNames = new Set(
                    allSheets.map((sheet) => sheet.name)
                );
                setSelectedSheets(allSheetNames);

                toast.success(
                    `Files processed! Found ${
                        allSheets.length
                    } Excel sheets and ${
                        selectedFiles.length -
                        processed.filter((p) => p.isExcel).length
                    } CSV files.`
                );
            } else {
                toast.success(
                    `${selectedFiles.length} CSV files ready for import.`
                );
            }
        } catch (error) {
            toast.error(
                `Failed to process files: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
            setFiles([]);
            setProcessedFiles([]);
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        // Reprocess remaining files
        if (newFiles.length === 0) {
            setProcessedFiles([]);
            setExcelSheets([]);
            setSelectedSheets(new Set());
            setShowSheetSelection(false);
            setImportResults(null);
            setShowResults(false);
        }
    };

    const handleSheetSelection = (sheetName: string, checked: boolean) => {
        const newSelected = new Set(selectedSheets);
        if (checked) {
            newSelected.add(sheetName);
        } else {
            newSelected.delete(sheetName);
        }
        setSelectedSheets(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedSheets(new Set(excelSheets.map((sheet) => sheet.name)));
        } else {
            setSelectedSheets(new Set());
        }
    };

    const formatErrorMessage = (error: string) => {
        // Check for MongoDB duplicate key error
        if (error.includes("E11000 duplicate key error")) {
            // Extract certificate number from the error message
            const match = error.match(
                /dup key: { certificateNumber: "([^"]+)" }/
            );
            if (match && match[1]) {
                const certificateNumber = match[1];
                return `You are uploading a diamond with a duplicate certificate number: ${certificateNumber} already exists in the database`;
            }
            // Fallback for E11000 errors without extractable certificate number
            return "Duplicate certificate number found. This diamond already exists in the database.";
        }

        // Return original error message for other types of errors
        return error;
    };

    const renderImportResults = () => {
        if (!importResults || !showResults) return null;

        const {
            success,
            error,
            message,
            results = [],
            totalDiamondsAdded = 0,
            duplicatesByFile = [],
        } = importResults;

        return (
            <div className="space-y-4 mt-6 border-t pt-6">
                <div className="flex items-center gap-2">
                    {success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="font-semibold text-lg">Import Results</h3>
                </div>

                <div
                    className={`p-4 rounded-lg ${
                        success ? "bg-green-50" : "bg-red-50"
                    }`}
                >
                    <p
                        className={`font-medium ${
                            success ? "text-green-800" : "text-red-800"
                        }`}
                    >
                        {error ? formatErrorMessage(error) : ""}
                    </p>
                    {totalDiamondsAdded > 0 && (
                        <p className="text-sm text-green-700 mt-1">
                            {totalDiamondsAdded} diamonds imported successfully
                        </p>
                    )}
                </div>

                {/* File-specific results */}
                <div className="space-y-3">
                    {results.map((result, index) => (
                        <FileResultComponent key={index} result={result} />
                    ))}
                </div>

                {/* Duplicates summary */}
                {duplicatesByFile.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800">
                                Duplicates Found
                            </span>
                        </div>
                        {duplicatesByFile.map((dupFile, index) => (
                            <div
                                key={index}
                                className="text-sm text-yellow-700"
                            >
                                <span className="font-medium">
                                    {dupFile.file}:
                                </span>{" "}
                                {dupFile.duplicates.join(", ")}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const FileResultComponent = ({ result }: { result: FileResult }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const {
            file,
            status,
            message,
            count = 0,
            duplicates = [],
            errors = [],
        } = result;

        return (
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                            <span className="font-medium">{file}</span>
                            <p
                                className={`text-sm ${
                                    status === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {message}
                            </p>
                            {count > 0 && (
                                <p className="text-xs text-gray-600">
                                    {count} diamonds processed
                                </p>
                            )}
                        </div>
                    </div>

                    {(errors.length > 0 || duplicates.length > 0) && (
                        <Collapsible
                            open={isExpanded}
                            onOpenChange={setIsExpanded}
                        >
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                    Details
                                </Button>
                            </CollapsibleTrigger>
                        </Collapsible>
                    )}
                </div>

                {(errors.length > 0 || duplicates.length > 0) && (
                    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                        <CollapsibleContent className="mt-4 space-y-3">
                            {/* Errors */}
                            {errors.length > 0 && (
                                <div className="bg-red-50 p-3 rounded">
                                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Errors ({errors.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {errors.map((error, errorIndex) => (
                                            <ErrorComponent
                                                key={errorIndex}
                                                error={error}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Duplicates */}
                            {duplicates.length > 0 && (
                                <div className="bg-yellow-50 p-3 rounded">
                                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Duplicates ({duplicates.length})
                                    </h4>
                                    <div className="text-sm text-yellow-700">
                                        {duplicates.join(", ")}
                                    </div>
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        );
    };

    const ErrorComponent = ({ error }: { error: ImportError }) => {
        if (error.type === "column") {
            return (
                <div className="text-sm">
                    <p className="text-red-700 font-medium">{error.message}</p>
                    {error.expected && (
                        <p className="text-red-600 mt-1">
                            Expected columns: {error.expected.join(", ")}
                        </p>
                    )}
                </div>
            );
        }

        if (error.type === "row") {
            return (
                <div className="text-sm">
                    <p className="text-red-700 font-medium">
                        Row error
                        {error.certificateNumber
                            ? ` (Certificate: ${error.certificateNumber})`
                            : ""}
                    </p>
                    {error.errorFields && (
                        <div className="text-red-600 mt-1">
                            {error.errorFields.map((field, index) => (
                                <p key={index} className="ml-2">
                                    • {field}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="text-sm text-red-700">
                {error.message || "Unknown error"}
            </div>
        );
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (files.length === 0) {
            toast.error("Please select files to upload.");
            return;
        }

        setIsUploading(true);
        setImportResults(null);
        setShowResults(false);

        try {
            const csvFilesToUpload: File[] = [];

            // Add CSV files directly
            processedFiles
                .filter((p) => !p.isExcel && p.csvFile)
                .forEach((p) => csvFilesToUpload.push(p.csvFile!));

            // Convert selected Excel sheets to CSV files
            if (showSheetSelection && selectedSheets.size > 0) {
                const selectedSheetData = excelSheets.filter((sheet) =>
                    selectedSheets.has(sheet.name)
                );

                const csvFiles = selectedSheetData.map((sheet) =>
                    createCSVFile(sheet.data, sheet.name)
                );

                csvFilesToUpload.push(...csvFiles);
            }

            if (csvFilesToUpload.length === 0) {
                toast.error("No files selected for import.");
                setIsUploading(false);
                return;
            }

            // Import all CSV files
            const batchResult = await importMultipleCSV(csvFilesToUpload);

            // Store results for display
            setImportResults(batchResult);
            setShowResults(true);

            if (batchResult.success) {
                // Show success toast
                if (
                    batchResult.totalDiamondsAdded &&
                    batchResult.totalDiamondsAdded > 0
                ) {
                    toast.success(
                        `Import completed! ${batchResult.totalDiamondsAdded} diamonds imported successfully.`
                    );
                } else {
                    toast.success("Import completed successfully!");
                }

                // Check for duplicates
                if (
                    batchResult.duplicatesByFile &&
                    batchResult.duplicatesByFile.length > 0
                ) {
                    const totalDuplicates = batchResult.duplicatesByFile.reduce(
                        (sum, file) => sum + file.duplicates.length,
                        0
                    );
                    toast.warning(
                        `${totalDuplicates} duplicate certificate numbers were skipped.`
                    );
                }

                onSuccess();
            } else {
                // Show error toast but keep modal open to show detailed results
                toast.error(
                    formatErrorMessage(
                        batchResult?.error ||
                            "Import failed. Check the details below."
                    )
                );
            }
        } catch (error) {
            toast.error(
                `Import failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
            setShowResults(false);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        // Always allow closing the modal, but reset all state
        setFiles([]);
        setProcessedFiles([]);
        setExcelSheets([]);
        setSelectedSheets(new Set());
        setShowSheetSelection(false);
        setIsUploading(false);
        setIsProcessing(false);
        setImportResults(null);
        setShowResults(false);
        onClose();
    };

    const getFileIcon = (fileName: string) => {
        const isExcel =
            fileName.toLowerCase().endsWith(".xlsx") ||
            fileName.toLowerCase().endsWith(".xls");

        return isExcel ? (
            <FileSpreadsheet className="h-4 w-4" />
        ) : (
            <FileText className="h-4 w-4" />
        );
    };

    const getTotalFilesForImport = () => {
        const csvCount = processedFiles.filter((p) => !p.isExcel).length;
        const selectedExcelSheets = showSheetSelection
            ? selectedSheets.size
            : 0;
        return csvCount + selectedExcelSheets;
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl min-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import CSV/Excel Files</DialogTitle>
                    <DialogDescription>
                        Upload multiple CSV files or Excel files (.xlsx) to
                        import diamond data. For Excel files, you can select
                        which sheets to import.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="files">Select Files</Label>
                        <Input
                            id="files"
                            type="file"
                            multiple
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            disabled={isUploading || isProcessing}
                            className="mt-1 cursor-pointer"
                        />
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium">
                                Selected Files ({files.length})
                            </h3>
                            <div className="max-h-40 overflow-y-auto border rounded-md">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-2 p-3 border-b last:border-b-0"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            {getFileIcon(file.name)}
                                            <span className="font-medium">
                                                {file.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                (
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB)
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            disabled={
                                                isUploading || isProcessing
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Processing files...</span>
                        </div>
                    )}

                    {showSheetSelection && excelSheets.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    Select Excel Sheets to Import
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="select-all"
                                        checked={
                                            selectedSheets.size ===
                                            excelSheets.length
                                        }
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <Label
                                        htmlFor="select-all"
                                        className="text-sm"
                                    >
                                        Select All
                                    </Label>
                                </div>
                            </div>

                            <div className="max-h-60 overflow-y-auto border rounded-md">
                                {excelSheets.map((sheet) => (
                                    <div
                                        key={sheet.name}
                                        className="flex items-center space-x-3 p-3 border-b last:border-b-0"
                                    >
                                        <Checkbox
                                            id={`sheet-${sheet.name}`}
                                            checked={selectedSheets.has(
                                                sheet.name
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleSheetSelection(
                                                    sheet.name,
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={`sheet-${sheet.name}`}
                                                className="font-medium"
                                            >
                                                {sheet.name}
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                {sheet.rowCount} rows
                                                {(sheet as any)
                                                    .originalFileName && (
                                                    <span className="ml-2">
                                                        from{" "}
                                                        {
                                                            (sheet as any)
                                                                .originalFileName
                                                        }
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedSheets.size > 0 && (
                                <p className="text-sm text-gray-600">
                                    {selectedSheets.size} Excel sheet(s)
                                    selected for import
                                </p>
                            )}
                        </div>
                    )}

                    {files.length > 0 && !isProcessing && !showResults && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                Ready to import {getTotalFilesForImport()}{" "}
                                file(s)
                            </p>
                        </div>
                    )}

                    {/* Import Results */}
                    {renderImportResults()}

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isUploading || isProcessing}
                        >
                            {showResults && !importResults?.success
                                ? "Close"
                                : "Cancel"}
                        </Button>

                        {(!showResults || !importResults?.success) && (
                            <Button
                                type="submit"
                                disabled={
                                    files.length === 0 ||
                                    isUploading ||
                                    isProcessing ||
                                    getTotalFilesForImport() === 0
                                }
                                className="bg-black hover:bg-gray-800"
                            >
                                {isUploading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isUploading
                                    ? "Importing..."
                                    : showResults
                                    ? "Try Again"
                                    : `Import ${getTotalFilesForImport()} File(s)`}
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
