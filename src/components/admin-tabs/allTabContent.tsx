import React from "react";
import { StatsCard } from "../cards/stats-card";
import { Shell } from "../shells/shell";
import { DataTable } from "../data-table/data-table";
import { DiamondTableToolbar } from "../data-table/diamond-toolbar";
import { DiamondCharts } from "../charts/diamond-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GridIcon, CircleCheckBig, ChartColumn, Ruler } from "lucide-react";
import Rapaport from "../rapaport/rapaport";

interface AllTabContentProps {
    diamonds: any[];
    loading: boolean;
    totalCount: number;
    diamondColumns: any[];
    pageCount: number;
    handleTableStateChange: (state: any) => void;
    paginationMeta: any;
}

const AllTabContent: React.FC<AllTabContentProps> = ({
    diamonds,
    loading,
    totalCount,
    diamondColumns,
    pageCount,
    handleTableStateChange,
    paginationMeta,
}) => {
    return (
        <>
            <div className="flex flex-wrap items-center justify-center gap-5 my-10">
                <StatsCard
                    icon={GridIcon}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-400/20"
                    label="Total Diamonds"
                    value={loading ? "..." : totalCount.toLocaleString()}
                    subtext="All Inventory"
                />

                <StatsCard
                    icon={CircleCheckBig}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-400/20"
                    label="Available"
                    value={
                        loading
                            ? "..."
                            : diamonds.filter((d) => d.isAvailable).length
                    }
                    subtext="Ready for Sale"
                />

                <StatsCard
                    icon={ChartColumn}
                    iconColor="text-purple-500"
                    iconBgColor="bg-purple-400/20"
                    label="Total Value"
                    value={
                        loading
                            ? "..."
                            : `$${diamonds
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
                        loading
                            ? "..."
                            : `${diamonds
                                  .reduce((sum, d) => sum + (d.size || 0), 0)
                                  .toFixed(2)} ct`
                    }
                    subtext="Carat Weight"
                />
            </div>

            <Tabs defaultValue="tableview" className=" ">
                <TabsList className="rounded-md space-x-3 border-1">
                    <TabsTrigger
                        value="tableview"
                        className="rounded-md text-black p-3"
                    >
                        Table View
                    </TabsTrigger>

                    <TabsTrigger
                        value="chart"
                        className="rounded-md text-black p-3"
                    >
                        Chart
                    </TabsTrigger>
                    <TabsTrigger
                        value="rapaport"
                        className="rounded-md text-black p-3"
                    >
                        Rapaport
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tableview" className=" w-full  ">
                    {/* <Shell className="h-fit w-full bg-blue-900"> */}
                    <div className="flex h-full min-w-full  overflow-x-auto w-full flex-col  ">
                        <div className="flex flex-col space-y-8 w-full  ">
                            <DataTable
                                data={diamonds}
                                columns={diamondColumns}
                                toolbar={DiamondTableToolbar}
                                pageCount={pageCount}
                                loading={loading}
                                onStateChange={handleTableStateChange}
                                paginationMeta={paginationMeta}
                            />
                        </div>
                    </div>
                    {/* </Shell> */}
                </TabsContent>

                <TabsContent value="chart">
                    <DiamondCharts />
                </TabsContent>
                <TabsContent value="rapaport">
                    <Rapaport />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default AllTabContent;
