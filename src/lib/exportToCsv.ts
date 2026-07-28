export function exportToCsv( filename: string, rows: Record<string, unknown>[] ): void {
    if (rows.length === 0) return;

    // make the object keys into a single row
    const headers = Object.keys(rows[0]);

    // escaping
    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            headers.map((header) => {
                    const value = row[header];
                    const stringValue = value === null || value === undefined ? "" : String(value);

                    if (
                        stringValue.includes(",") ||
                        stringValue.includes('"') ||
                        stringValue.includes("\n")
                    ) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }

                    return stringValue;
                })
                .join(",")
        ),
    ].join("\n");

    // added a BOM due to excel decode Persian (UTF-8)
    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    // Creating export file link and object
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}