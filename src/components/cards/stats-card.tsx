import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
    label: string;
    value: string | number;
    subtext: string;
    loading?: boolean;
}

export function StatsCard({
    icon: Icon,
    iconColor,
    iconBgColor,
    label,
    value,
    subtext,
    loading = false,
}: StatsCardProps) {
    return (
        <div className="w-70 bg-white border-2 border-gray-200 rounded-xl flex flex-col justify-center items-start gap-2 px-7 py-3">
            <div className="w-full flex justify-between items-center">
                <div className={`${iconBgColor} rounded-md p-2`}>
                    <Icon className={`${iconColor}`} />
                </div>
                <TrendingUp className="text-green-400" />
            </div>
            <h1 className="text-gray-600 text-base">{label}</h1>
            <h1 className="text-2xl font-semibold">
                {loading ? "..." : value}
            </h1>
            <h1 className="text-gray-500 text-sm">{subtext}</h1>
        </div>
    );
}
