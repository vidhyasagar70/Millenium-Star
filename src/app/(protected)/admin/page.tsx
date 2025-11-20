"use client";
import { useCallback, useState } from "react";
import { diamondColumns } from "@/components/data-table/diamond-columns";
import { SiteHeader } from "@/components/layout/site-header";
import Container from "@/components/ui/container";
import CustomButton from "@/components/ui/customButton";
import { useDiamonds } from "@/hooks/use-diamonds";
import { useFilteredDiamonds } from "@/hooks/use-filtered-diamonds";
import {
    DownloadIcon,
    FileTextIcon,
    PlusIcon,
    Upload,
    Mail,
    Info,
    RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddDiamondModal } from "@/components/modals/add-diamond";
import { RapnetUploadModal } from "@/components/modals/rapnet-upload-modal";
import { EmailExportModal } from "@/components/modals/send-email-modal";
import { AdminGuard } from "@/components/auth/routeGuard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { EnhancedImportCSVModal } from "@/components/modals/enhanced-import-csv-modal";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import axios from "axios";

// Import tab components
import AllTabContent from "@/components/admin-tabs/allTabContent";
import FancyTabContent from "@/components/admin-tabs/fancyTabContent";
import HighEndTabContent from "@/components/admin-tabs/highEndTabContent";
import LowEndTabContent from "@/components/admin-tabs/lowEndTabContent";
import { DiamondType } from "@/lib/validations/diamond-schema";

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

interface RefreshResponse {
    success: boolean;
    data: {
        totalDiamonds: number;
        targetDiamonds: number;
        successfulUpdates: number;
        failedUpdates: number;
        errors: string[];
    };
}

export default function DiamondPage() {
    const { user, logout } = useAuth();
    const {
        diamonds,
        loading,
        error,
        totalCount,
        pageCount,
        refetch,
        updateTable,
        paginationMeta,
    } = useDiamonds();

    const {
        diamonds: fancyDiamonds,
        loading: fancyLoading,
        error: fancyError,
        totalCount: fancyTotalCount,
        pageCount: fancyPageCount,
        refetch: fancyRefetch,
        updateTable: fancyUpdateTable,
        paginationMeta: fancyPaginationMeta,
    } = useFilteredDiamonds(
        "diamonds/search?notShape=Round&sortBy=createdAt&sortOrder=desc"
    );

    const {
        diamonds: highEndDiamonds,
        loading: highEndLoading,
        error: highEndError,
        totalCount: highEndTotalCount,
        pageCount: highEndPageCount,
        refetch: highEndRefetch,
        updateTable: highEndUpdateTable,
        paginationMeta: highEndPaginationMeta,
    } = useFilteredDiamonds(
        "diamonds/search?shape=Round&sizeMin=1&sortBy=createdAt&sortOrder=desc"
    );

    const {
        diamonds: lowEndDiamonds,
        loading: lowEndLoading,
        error: lowEndError,
        totalCount: lowEndTotalCount,
        pageCount: lowEndPageCount,
        refetch: lowEndRefetch,
        updateTable: lowEndUpdateTable,
        paginationMeta: lowEndPaginationMeta,
    } = useFilteredDiamonds(
        "diamonds/search?shape=Round&sizeMax=0.9&sortBy=createdAt&sortOrder=desc"
    );

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRapnetModalOpen, setIsRapnetModalOpen] = useState(false);
    const [isImportCSVModalOpen, setIsImportCSVModalOpen] = useState(false);
    const [isEmailExportModalOpen, setIsEmailExportModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    // Rapnet upload states
    const [rapnetLoading, setRapnetLoading] = useState(false);
    const [rapnetUploadData, setRapnetUploadData] =
        useState<RapnetUploadData | null>(null);
    const [rapnetError, setRapnetError] = useState<string | null>(null);

    // Add refresh state
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Add state to track current table filters
    const [currentTableState, setCurrentTableState] = useState({
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [] as Array<{ id: string; desc: boolean }>,
        columnFilters: [] as Array<{ id: string; value: any }>,
    });

    // Table state change handlers
    const handleTableStateChange = useCallback(
        (state: {
            pagination: { pageIndex: number; pageSize: number };
            sorting: Array<{ id: string; desc: boolean }>;
            columnFilters: Array<{ id: string; value: any }>;
        }) => {
            console.log("🎯 Page: Table state change requested:", state);
            setCurrentTableState(state);
            updateTable(state);
        },
        [updateTable]
    );

    const handleFancyTableStateChange = useCallback(
        (state: {
            pagination: { pageIndex: number; pageSize: number };
            sorting: Array<{ id: string; desc: boolean }>;
            columnFilters: Array<{ id: string; value: any }>;
        }) => {
            console.log("🎯 Fancy: Table state change requested:", state);
            setCurrentTableState(state);
            fancyUpdateTable(state);
        },
        [fancyUpdateTable]
    );

    const handleHighEndTableStateChange = useCallback(
        (state: {
            pagination: { pageIndex: number; pageSize: number };
            sorting: Array<{ id: string; desc: boolean }>;
            columnFilters: Array<{ id: string; value: any }>;
        }) => {
            console.log("🎯 High End: Table state change requested:", state);
            setCurrentTableState(state);
            highEndUpdateTable(state);
        },
        [highEndUpdateTable]
    );

    const handleLowEndTableStateChange = useCallback(
        (state: {
            pagination: { pageIndex: number; pageSize: number };
            sorting: Array<{ id: string; desc: boolean }>;
            columnFilters: Array<{ id: string; value: any }>;
        }) => {
            console.log("🎯 Low End: Table state change requested:", state);
            setCurrentTableState(state);
            lowEndUpdateTable(state);
        },
        [lowEndUpdateTable]
    );

    // Helper function to convert column filters to API format
    const getCurrentFilters = () => {
        const filters: any = {};

        currentTableState.columnFilters.forEach((filter) => {
            const { id, value } = filter;

            // Handle range-type filters that store objects with min/max
            if (
                value &&
                typeof value === "object" &&
                value.min !== undefined &&
                value.max !== undefined
            ) {
                switch (id) {
                    case "caratRange":
                        filters.sizeMin = value.min;
                        filters.sizeMax = value.max;
                        break;
                    case "priceRange":
                        filters.priceMin = value.min;
                        filters.priceMax = value.max;
                        break;
                    default:
                        // For any other range filters, use the id as prefix
                        filters[`${id}Min`] = value.min;
                        filters[`${id}Max`] = value.max;
                        break;
                }
            } else if (
                id === "certificateNumber" ||
                id === "CERT-NO" ||
                id === "diamond-Id"
            ) {
                filters.searchTerm = value;
            }
            // Handle array filters - convert to comma-separated string or multiple values
            else if (Array.isArray(value) && value.length > 0) {
                // For array values, we'll join them with commas
                filters[id] = value;
            }
            // Handle regular filters
            else if (value !== undefined && value !== null && value !== "") {
                filters[id] = value;
            }
        });

        // Log the filters for debugging
        console.log("🔍 Current filters being sent:", filters);

        return filters;
    };

    const handleAddDiamondSuccess = () => {
        console.log("✅ Diamond added successfully");
        refetch();
        fancyRefetch();
        highEndRefetch();
        lowEndRefetch();
    };

    const handleImportCSVSuccess = () => {
        console.log("✅ CSV/Excel imported successfully");
        refetch();
        fancyRefetch();
        highEndRefetch();
        lowEndRefetch();
    };

    // Rapnet upload functionality
    const handleRapnetUpload = async () => {
        setRapnetLoading(true);
        setRapnetError(null);
        setRapnetUploadData(null);
        setIsRapnetModalOpen(true);

        try {
            const uploadResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/rapnet/upload-rapnet-csv`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(
                    uploadData.error || "Failed to initiate upload"
                );
            }

            const uploadId = uploadData.data?.uploadId;
            if (!uploadId) {
                throw new Error("No upload ID received from server");
            }
            await pollUploadStatus(uploadId);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred";
            setRapnetError(errorMessage);
            toast.error(`Rapnet upload failed: ${errorMessage}`);
        } finally {
            setRapnetLoading(false);
        }
    };

    const pollUploadStatus = async (uploadId: string) => {
        const maxAttempts = 60;
        const pollInterval = 5000;
        let attempts = 0;

        const checkStatus = async (): Promise<void> => {
            attempts++;
            console.log(
                `🔄 Checking upload status (attempt ${attempts}/${maxAttempts})...`
            );

            try {
                const statusResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/rapnet/upload-status/${uploadId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const statusData = await statusResponse.json();

                if (!statusResponse.ok) {
                    throw new Error(
                        statusData.error || "Failed to get upload status"
                    );
                }

                if (!statusData.success || !statusData.data) {
                    throw new Error("Invalid status response received");
                }

                const uploadStatusData = statusData.data;
                console.log(`📊 Upload status:`, uploadStatusData);

                setRapnetUploadData(uploadStatusData);

                if (
                    uploadStatusData.stockReplaced === true &&
                    uploadStatusData.status === "Finished successfully"
                ) {
                    console.log("✅ Stock replacement completed successfully!");
                    toast.success("Rapnet upload completed successfully!");
                    return;
                } else if (uploadStatusData.status === "Failed") {
                    console.log("❌ Stock replacement failed.");
                    toast.error("Rapnet upload failed.");
                    return;
                }

                if (attempts >= maxAttempts) {
                    throw new Error(
                        `Upload status check timed out after ${maxAttempts} attempts. Stock replacement may still be in progress.`
                    );
                }

                if (
                    uploadStatusData.status &&
                    uploadStatusData.status.toLowerCase().includes("error")
                ) {
                    throw new Error(
                        uploadStatusData.errorMessages ||
                            `Upload failed with status: ${uploadStatusData.status}`
                    );
                }

                console.log(
                    `⏳ Stock not yet replaced. Waiting ${
                        pollInterval / 1000
                    } seconds before next check...`
                );

                toast.info(
                    `Upload in progress... (${attempts}/${maxAttempts}) - Status: ${
                        uploadStatusData.status || "Processing"
                    }`
                );

                setTimeout(() => {
                    checkStatus();
                }, pollInterval);
            } catch (error) {
                console.error("❌ Error checking upload status:", error);
                throw error;
            }
        };

        await checkStatus();
    };

    const handleRapnetRetry = () => {
        handleRapnetUpload();
    };

    const exportToCsv = (diamondsToExport: DiamondType[], fileName: string) => {
        if (!diamondsToExport || diamondsToExport.length === 0) {
            toast("No data available to export for the selected tab.");
            return;
        }

        const headers = [
            "Certificate Number",
            "Lab",
            "Shape",
            "Size",
            "Color",
            "Clarity",
            "Discount",
            "Cut",
            "Polish",
            "Symmetry",
            "Fluo. Color",
            "Length",
            "Width",
            "Depth",
            "Total Depth",
            "Table",
            "Price Per Carat",
            "Price",
            "Rap List",
            "Available",
        ];

        const csvRows = diamondsToExport.map((d) => {
            const row = [
                d.certificateNumber || "-",
                d.laboratory || "-",
                d.shape || "-",
                d.size || "-",
                d.color || "-",
                d.clarity || "-",
                d.discount ? `${d.discount}%` : "0%",
                d.cut || "-",
                d.polish || "-",
                d.symmetry || "-",
                d.fluorescenceColor || "-",
                d.measurements.length || "-",
                d.measurements.width || "-",
                d.measurements.depth || "-",
                d.totalDepth || "-",
                d.table || "-",
                d.pricePerCarat || "-",
                d.price || "-",
                d.rapList || "-",
                d.isAvailable || "-",
            ];
            return row
                .map((value) => {
                    const str = String(value);
                    if (str.includes(",")) {
                        return `"${str}"`;
                    }
                    return str;
                })
                .join(",");
        });

        const csvContent = [headers.join(","), ...csvRows].join("\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = () => {
        let dataToExport: DiamondType[] = [];
        let fileName = "diamonds";

        switch (activeTab) {
            case "fancy":
                dataToExport = fancyDiamonds;
                fileName = "fancy-diamonds";
                break;
            case "highEnd":
                dataToExport = highEndDiamonds;
                fileName = "high-end-diamonds";
                break;
            case "lowEnd":
                dataToExport = lowEndDiamonds;
                fileName = "low-end-diamonds";
                break;
            case "all":
            default:
                dataToExport = diamonds;
                fileName = "all-diamonds";
                break;
        }
        exportToCsv(dataToExport, fileName);
    };

    const handleDownloadSampleCSV = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/diamonds/example-csv`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to download sample CSV");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sample-diamond-format.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Sample CSV downloaded successfully!");
        } catch (error) {
            console.error("Error downloading sample CSV:", error);
            toast.error("Failed to download sample CSV. Please try again.");
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            const response = await axios.get<RefreshResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/rapnet/refresh`,
                { withCredentials: true }
            );

            if (response.data.success) {
                const { data } = response.data;

                toast.success(
                    <div className="space-y-2">
                        <p className="font-semibold">
                            Refresh Completed Successfully!
                        </p>
                        <div className="text-sm space-y-1">
                            <p>Total Diamonds: {data.totalDiamonds}</p>
                            <p>Target Diamonds: {data.targetDiamonds}</p>
                            <p>Successful Updates: {data.successfulUpdates}</p>
                            {data.failedUpdates > 0 && (
                                <p className="text-red-600">
                                    Failed Updates: {data.failedUpdates}
                                </p>
                            )}
                        </div>
                    </div>
                );

                refetch();
                fancyRefetch();
                highEndRefetch();
                lowEndRefetch();
            } else {
                toast.error("Refresh failed. Please try again.");
            }
        } catch (error) {
            console.error("Refresh error:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || error.message;
                toast.error(
                    <div className="space-y-2">
                        <p className="font-semibold">Refresh Failed</p>
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                );
            } else {
                toast.error("An unexpected error occurred during refresh.");
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    if (error) {
        return (
            <Container>
                <SiteHeader />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-600">
                            Error Loading Diamonds
                        </h3>
                        <p className="text-muted-foreground mt-2">{error}</p>
                        <CustomButton
                            variant="dark"
                            onClick={refetch}
                            className="mt-4"
                        >
                            Retry
                        </CustomButton>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <AdminGuard>
            <Container className="bg-[#F9FAFB]">
                {/* Header Section */}
                <h1 className="text-3xl font-medium">Admin Dashboard</h1>
                <Breadcrumb className="my-3">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">HOME</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">ADMIN</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Search and Action Buttons */}
                <div className="flex flex-wrap items-start justify-between gap-5 my-5">
                    <div className="flex flex-wrap items-center justify-start gap-6">
                        <CustomButton
                            className="bg-white hover:bg-gray-100 border-1 border-gray-200 text-black"
                            variant="secondary"
                            icon={<DownloadIcon size={15} />}
                            onClick={handleExport}
                        >
                            Export
                        </CustomButton>
                        <div className="flex items-center gap-2">
                            <CustomButton
                                className="bg-white hover:bg-gray-100 border-1 border-gray-200 text-black"
                                variant="secondary"
                                icon={<FileTextIcon size={15} />}
                                onClick={() => setIsImportCSVModalOpen(true)}
                            >
                                <span>Import&nbsp;CSV/Excel</span>
                            </CustomButton>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-100"
                                    >
                                        <Info
                                            size={14}
                                            className="text-gray-500"
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-4">
                                    <div className="space-y-3">
                                        <Button
                                            size="sm"
                                            onClick={handleDownloadSampleCSV}
                                            className="w-full"
                                        >
                                            Download Sample CSV
                                        </Button>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <CustomButton
                            className="bg-white hover:bg-gray-100 border-1 border-gray-200 text-black"
                            variant="secondary"
                            icon={<Mail size={15} />}
                            onClick={() => setIsEmailExportModalOpen(true)}
                        >
                            <span>Send&nbsp;Email</span>
                        </CustomButton>
                        {/* <CustomButton
                            className="bg-white hover:bg-gray-100 border-1 border-gray-200 text-black"
                            variant="secondary"
                            icon={<Upload size={15} />}
                            onClick={handleRapnetUpload}
                            // disabled={rapnetLoading}
                            // disabled={true} // Temporarily disable until Rapnet resolves upload issues
                        >
                            <span>Upload&nbsp;to&nbsp;Rapnet</span>
                        </CustomButton>*/}
                        <CustomButton
                            className="bg-white hover:bg-gray-100 border-1 border-gray-200 text-black"
                            variant="secondary"
                            icon={
                                <RefreshCw
                                    size={15}
                                    className={
                                        isRefreshing ? "animate-spin" : ""
                                    }
                                />
                            }
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <span>
                                {isRefreshing ? "Refreshing..." : "Refresh"}
                            </span>
                        </CustomButton>
                        <CustomButton
                            variant="dark"
                            icon={<PlusIcon size={15} />}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <span>Add&nbsp;Diamond</span>
                        </CustomButton>
                    </div>
                </div>
            </Container>

            {/* Tabs Section */}
            <div className="w-full my-5">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <Container>
                        <TabsList className="w-full font-medium rounded-md py-6">
                            <TabsTrigger value="all" className="rounded-md p-5">
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="fancy"
                                className="rounded-md p-5"
                            >
                                Fancy
                            </TabsTrigger>
                            <TabsTrigger
                                value="highEnd"
                                className="rounded-md p-5"
                            >
                                High End
                            </TabsTrigger>
                            <TabsTrigger
                                value="lowEnd"
                                className="rounded-md p-5"
                            >
                                Low End
                            </TabsTrigger>
                        </TabsList>
                    </Container>

                    <TabsContent value="all">
                        <AllTabContent
                            diamonds={diamonds}
                            loading={loading}
                            totalCount={totalCount}
                            diamondColumns={diamondColumns}
                            pageCount={pageCount}
                            handleTableStateChange={handleTableStateChange}
                            paginationMeta={paginationMeta}
                        />
                    </TabsContent>

                    <TabsContent value="fancy">
                        <FancyTabContent
                            fancyDiamonds={fancyDiamonds}
                            fancyLoading={fancyLoading}
                            fancyTotalCount={fancyTotalCount}
                            diamondColumns={diamondColumns}
                            fancyPageCount={fancyPageCount}
                            handleFancyTableStateChange={
                                handleFancyTableStateChange
                            }
                            fancyPaginationMeta={fancyPaginationMeta}
                        />
                    </TabsContent>

                    <TabsContent value="highEnd">
                        <HighEndTabContent
                            highEndDiamonds={highEndDiamonds}
                            highEndLoading={highEndLoading}
                            highEndTotalCount={highEndTotalCount}
                            diamondColumns={diamondColumns}
                            highEndPageCount={highEndPageCount}
                            handleHighEndTableStateChange={
                                handleHighEndTableStateChange
                            }
                            highEndPaginationMeta={highEndPaginationMeta}
                        />
                    </TabsContent>

                    <TabsContent value="lowEnd">
                        <LowEndTabContent
                            lowEndDiamonds={lowEndDiamonds}
                            lowEndLoading={lowEndLoading}
                            lowEndTotalCount={lowEndTotalCount}
                            diamondColumns={diamondColumns}
                            lowEndPageCount={lowEndPageCount}
                            handleLowEndTableStateChange={
                                handleLowEndTableStateChange
                            }
                            lowEndPaginationMeta={lowEndPaginationMeta}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            <AddDiamondModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddDiamondSuccess}
            />

            <EnhancedImportCSVModal
                isOpen={isImportCSVModalOpen}
                onClose={() => setIsImportCSVModalOpen(false)}
                onSuccess={handleImportCSVSuccess}
            />

            <EmailExportModal
                isOpen={isEmailExportModalOpen}
                onClose={() => setIsEmailExportModalOpen(false)}
                activeTab={activeTab}
                currentFilters={getCurrentFilters()}
                currentSorting={currentTableState.sorting}
            />

            <RapnetUploadModal
                isOpen={isRapnetModalOpen}
                onClose={() => {
                    setIsRapnetModalOpen(false);
                    setRapnetError(null);
                    setRapnetUploadData(null);
                }}
                isLoading={rapnetLoading}
                uploadData={rapnetUploadData}
                error={rapnetError}
                onRetry={handleRapnetRetry}
            />
        </AdminGuard>
    );
}
