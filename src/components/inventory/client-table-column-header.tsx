"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronsUpDown,
    EyeOff,
} from "lucide-react";

interface ClientTableColumnHeaderProps
    extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    sortKey?: string;
    currentSorting?: { id: string; desc: boolean }[];
    onSortChange?: (sorting: { id: string; desc: boolean }[]) => void;
    canSort?: boolean;
}

export function ClientTableColumnHeader({
    title,
    sortKey,
    currentSorting = [],
    onSortChange,
    canSort = true,
    className,
}: ClientTableColumnHeaderProps) {
    if (!canSort || !sortKey || !onSortChange) {
        return <div className={cn(className)}>{title}</div>;
    }

    const currentSort = currentSorting.find((sort) => sort.id === sortKey);
    const isAsc = currentSort && !currentSort.desc;
    const isDesc = currentSort && currentSort.desc;

    const handleSort = (desc: boolean) => {
        const newSorting = [{ id: sortKey, desc }];
        onSortChange(newSorting);
    };

    return (
        <div className={cn("flex items-center space-x-1", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        aria-label={
                            isDesc
                                ? `Sorted descending. Click to sort ascending.`
                                : isAsc
                                ? `Sorted ascending. Click to sort descending.`
                                : `Not sorted. Click to sort ascending.`
                        }
                        variant="ghost"
                        size="sm"
                        className="  p-0 gap-0 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {isDesc ? (
                            <ArrowDownIcon
                                className=" h-4 w-4"
                                aria-hidden="true"
                            />
                        ) : isAsc ? (
                            <ArrowUpIcon
                                className=" h-4 w-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <ChevronsUpDown
                                className=" h-2 w-2"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        aria-label="Sort ascending"
                        onClick={() => handleSort(false)}
                    >
                        <ArrowUpIcon
                            className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                            aria-hidden="true"
                        />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        aria-label="Sort descending"
                        onClick={() => handleSort(true)}
                    >
                        <ArrowDownIcon
                            className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                            aria-hidden="true"
                        />
                        Desc
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
