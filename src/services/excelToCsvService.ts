import * as XLSX from "xlsx";

export interface ExcelSheet {
    name: string;
    data: string; // CSV content
    rowCount: number;
}

export interface ExcelConversionResult {
    sheets: ExcelSheet[];
    fileName: string;
}

// Helper function to convert scientific notation to regular number
const convertScientificNotation = (value: any): any => {
    console.log("Converting scientific notation:", value, typeof value);
    if (typeof value === "string") {
        // Check if it's scientific notation
        const scientificPattern = /^[+-]?\d+\.?\d*[eE][+-]?\d+$/;
        if (scientificPattern.test(value.trim())) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                // Convert to regular number format
                return numValue.toString();
            }
        }
    }
    return value;
};

export const convertExcelToCSV = async (
    file: File
): Promise<ExcelConversionResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                const sheets: ExcelSheet[] = workbook.SheetNames.map(
                    (sheetName) => {
                        const worksheet = workbook.Sheets[sheetName];

                        // Process the worksheet to convert scientific notation
                        const range = XLSX.utils.decode_range(
                            worksheet["!ref"] || "A1:A1"
                        );

                        for (let row = range.s.r; row <= range.e.r; row++) {
                            for (let col = range.s.c; col <= range.e.c; col++) {
                                const cellAddress = XLSX.utils.encode_cell({
                                    r: row,
                                    c: col,
                                });
                                const cell = worksheet[cellAddress];

                                if (cell && cell.v !== undefined) {
                                    const convertedValue =
                                        convertScientificNotation(cell.v);

                                    // Update the cell value
                                    cell.v = convertedValue;
                                    cell.w = convertedValue;
                                    // Set type to string to preserve the converted format
                                    cell.t = typeof convertedValue;
                                }
                            }
                        }

                        // Convert to CSV after processing
                        const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
                            FS: ",", // Field separator (comma)
                            RS: "\n",
                            skipHidden: false,
                            blankrows: false,
                        });

                        // Count rows (excluding header)
                        const rowCount =
                            csvContent.split("\n").filter((row) => row.trim())
                                .length - 1;

                        return {
                            name: sheetName,
                            data: csvContent,
                            rowCount: Math.max(0, rowCount),
                        };
                    }
                );

                resolve({
                    sheets,
                    fileName: file.name.replace(/\.xlsx?$/i, ""),
                });
            } catch (error) {
                reject(new Error(`Failed to parse Excel file: ${error}`));
            }
        };

        reader.onerror = () => {
            reject(new Error("Failed to read Excel file"));
        };

        reader.readAsArrayBuffer(file);
    });
};

export const createCSVFile = (csvContent: string, fileName: string): File => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    return new File([blob], `${fileName}.csv`, { type: "text/csv" });
};
