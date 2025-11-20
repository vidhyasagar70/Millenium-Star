"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Sector,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Diamond {
    _id: string;
    shape: string;
    color: string;
    clarity: string;
    cut: string;
}

interface ChartData {
    name: string;
    count: number;
}

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
];

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={fill}
                fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill="#333"
            >{`Count ${value}`}</text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="#999"
            >
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export const DiamondCharts = () => {
    const [diamonds, setDiamonds] = useState<Diamond[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchAllDiamonds = async () => {
            try {
                setLoading(true);
                const baseURL =
                    process.env.NEXT_PUBLIC_API_BASE_URL ||
                    "https://millennium-star-inventory-service-dev.caratlogic.com";
                const response = await axios.get(
                    `${baseURL}/api/diamonds/all`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.data.success) {
                    setDiamonds(response.data.data);
                } else {
                    throw new Error(
                        response.data.message || "Failed to fetch diamonds"
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAllDiamonds();
    }, []);

    const onPieEnter = useCallback((_: any, index: number) => {
        setActiveIndex(index);
    }, []);

    const processData = (key: keyof Diamond): ChartData[] => {
        const counts = diamonds.reduce((acc, diamond) => {
            const value = diamond[key] || "N/A";
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                Loading charts...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96 text-red-500">
                Error: {error}
            </div>
        );
    }

    const shapeData = processData("shape");
    const clarityData = processData("clarity");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Diamonds by Shape</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={shapeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Diamonds by Clarity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                // activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={clarityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#82ca9d"
                                dataKey="count"
                                onMouseEnter={onPieEnter}
                            >
                                {clarityData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
