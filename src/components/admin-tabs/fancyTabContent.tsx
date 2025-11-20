import React from "react";
import { StatsCard } from "../cards/stats-card";
import { Shell } from "../shells/shell";
import { DataTable } from "../data-table/data-table";
import { DiamondTableToolbar } from "../data-table/diamond-toolbar";
import { GridIcon, CircleCheckBig, ChartColumn, Ruler } from "lucide-react";

interface FancyTabContentProps {
    fancyDiamonds: any[];
    fancyLoading: boolean;
    fancyTotalCount: number;
    diamondColumns: any[];
    fancyPageCount: number;
    handleFancyTableStateChange: (state: any) => void;
    fancyPaginationMeta: any;
}

const FancyTabContent: React.FC<FancyTabContentProps> = ({
    fancyDiamonds,
    fancyLoading,
    fancyTotalCount,
    diamondColumns,
    fancyPageCount,
    handleFancyTableStateChange,
    fancyPaginationMeta,
}) => {
    return (
        <>
            {/* Fancy Diamonds Stats */}
            <div className="flex items-center justify-center gap-5 my-10">
                <StatsCard
                    icon={GridIcon}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-400/20"
                    label="Fancy Diamonds (Non-RBC)"
                    value={
                        fancyLoading ? "..." : fancyTotalCount.toLocaleString()
                    }
                    subtext="Total Inventory"
                />

                <StatsCard
                    icon={CircleCheckBig}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-400/20"
                    label="Available"
                    value={
                        fancyLoading
                            ? "..."
                            : fancyDiamonds.filter((d) => d.isAvailable).length
                    }
                    subtext="Ready for Sale"
                />

                <StatsCard
                    icon={ChartColumn}
                    iconColor="text-purple-500"
                    iconBgColor="bg-purple-400/20"
                    label="Total Value"
                    value={
                        fancyLoading
                            ? "..."
                            : `$${fancyDiamonds
                                  .reduce((sum, d) => sum + (d.price || 0), 0)
                                  .toFixed(2)}`
                    }
                    subtext="Current Market Value"
                />

                <StatsCard
                    icon={Ruler}
                    iconColor="text-orange-500"
                    iconBgColor="bg-orange-400/20"
                    label="Total Size"
                    value={
                        fancyLoading
                            ? "..."
                            : `${fancyDiamonds
                                  .reduce((sum, d) => sum + (d.size || 0), 0)
                                  .toFixed(2)} ct`
                    }
                    subtext="Carat Weight"
                />
            </div>

            {/* <Shell> */}
            <div className="flex h-full min-h-screen overflow-x-auto flex-col">
                <div className="flex flex-col space-y-8">
                    <DataTable
                        data={fancyDiamonds}
                        columns={diamondColumns}
                        toolbar={DiamondTableToolbar}
                        pageCount={fancyPageCount}
                        loading={fancyLoading}
                        onStateChange={handleFancyTableStateChange}
                        paginationMeta={fancyPaginationMeta}
                    />
                </div>
            </div>
            {/* </Shell> */}
        </>
    );
};

export default FancyTabContent;
