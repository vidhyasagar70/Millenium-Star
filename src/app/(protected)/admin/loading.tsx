import { DataTableLoading } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shells/shell";

export default function Loading() {
    return (
        <Shell>
            <DataTableLoading columnCount={7} />
        </Shell>
    );
}
