import * as React from "react";

import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
}

export function DataTable<T>({
  columns,
  data,
  className,
  rowKey,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  className?: string;
  rowKey: (row: T) => string;
}) {
  const alignClass = (align?: string) =>
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted",
                  alignClass(col.align),
                  col.headerClassName
                )}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              className="transition-colors hover:bg-background/60"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-text-primary",
                    alignClass(col.align),
                    col.className
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}