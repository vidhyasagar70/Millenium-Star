import React from "react";
import { Shell } from "../shells/shell";
import { DataTable } from "../data-table/data-table";
import { DiamondTableToolbar } from "../data-table/diamond-toolbar";
import {
    GridIcon,
    CircleCheckBig,
    ChartColumn,
    Ruler,
    TrendingUp,
} from "lucide-react";

interface LowEndTabContentProps {
    lowEndDiamonds: any[];
    lowEndLoading: boolean;
    lowEndTotalCount: number;
    diamondColumns: any[];
    lowEndPageCount: number;
    handleLowEndTableStateChange: (state: any) => void;
    lowEndPaginationMeta: any;
}

const LowEndTabContent: React.FC<LowEndTabContentProps> = ({
    lowEndDiamonds,
    lowEndLoading,
    lowEndTotalCount,
    diamondColumns,
    lowEndPageCount,
    handleLowEndTableStateChange,
    lowEndPaginationMeta,
}) => {
    return (
        <>
            {/* Low End Diamonds Stats */}
            <div className="flex items-center justify-center gap-5 my-10">
                <div className="w-80 bg-white border-2 border-gray-200 rounded-xl flex flex-col justify-center items-start gap-2 px-7 py-3">
                    <div className="w-full flex justify-between items-center">
                        <div className="bg-blue-400/20 rounded-md p-2">
                            <GridIcon className="text-blue-500" />
                        </div>
                        <TrendingUp className="text-green-400" />
                    </div>
                    <h1 className="text-gray-600 text-base">
                        Low End Diamonds (RBC ≤ 0.9ct)
                    </h1>
                    <h1 className="text-2xl font-semibold">
                        {lowEndLoading
                            ? "..."
                            : lowEndTotalCount.toLocaleString()}
                    </h1>
                    <h1 className="text-gray-500 text-sm">Total Inventory</h1>
                </div>
                <div className="w-80 bg-white border-2 border-gray-200 rounded-xl flex flex-col justify-center items-start gap-2 px-7 py-3">
                    <div className="w-full flex justify-between items-center">
                        <div className="bg-green-400/20 rounded-md p-2">
                            <CircleCheckBig className="text-green-500" />
                        </div>
                        <TrendingUp className="text-green-400" />
                    </div>
                    <h1 className="text-gray-600 text-base">Available</h1>
                    <h1 className="text-2xl font-semibold">
                        {lowEndLoading
                            ? "..."
                            : lowEndDiamonds.filter((d) => d.isAvailable)
                                  .length}
                    </h1>
                    <h1 className="text-gray-500 text-sm">Ready for Sale</h1>
                </div>
                <div className="w-80 bg-white border-2 border-gray-200 rounded-xl flex flex-col justify-center items-start gap-2 px-7 py-3">
                    <div className="w-full flex justify-between items-center">
                        <div className="bg-purple-400/20 rounded-md p-2">
                            <ChartColumn className="text-purple-500" />
                        </div>
                        <TrendingUp className="text-green-400" />
                    </div>
                    <h1 className="text-gray-600 text-base">Total Value</h1>
                    <h1 className="text-2xl font-semibold">
                        $
                        {lowEndLoading
                            ? "..."
                            : lowEndDiamonds
                                  .reduce((sum, d) => sum + (d.price || 0), 0)
                                  .toFixed(2)}
                    </h1>
                    <h1 className="text-gray-500 text-sm">
                        Current Market Value
                    </h1>
                </div>
                <div className="w-80 bg-white border-2 border-gray-200 rounded-xl flex flex-col justify-center items-start gap-2 px-7 py-3">
                    <div className="w-full flex justify-between items-center">
                        <div className="bg-orange-400/20 rounded-md p-2">
                            <Ruler className="text-orange-500" />
                        </div>
                        <TrendingUp className="text-green-400" />
                    </div>
                    <h1 className="text-gray-600 text-base">Total Size</h1>
                    <h1 className="text-2xl font-semibold">
                        {lowEndLoading
                            ? "..."
                            : lowEndDiamonds
                                  .reduce((sum, d) => sum + (d.size || 0), 0)
                                  .toFixed(2)}{" "}
                        ct
                    </h1>
                    <h1 className="text-gray-500 text-sm">Carat Weight</h1>
                </div>
            </div>

            {/* <Shell> */}
            <div className="flex h-full min-h-screen overflow-x-auto flex-col">
                <div className="flex flex-col space-y-8">
                    <DataTable
                        data={lowEndDiamonds}
                        columns={diamondColumns}
                        toolbar={DiamondTableToolbar}
                        pageCount={lowEndPageCount}
                        loading={lowEndLoading}
                        onStateChange={handleLowEndTableStateChange}
                        paginationMeta={lowEndPaginationMeta}
                    />
                </div>
            </div>
            {/* </Shell> */}
        </>
    );
};

export default LowEndTabContent;
