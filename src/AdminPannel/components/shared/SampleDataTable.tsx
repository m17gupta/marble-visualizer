"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Column,
  Row,
  Table as TableInstance,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Filter as Funnel,
  X,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { BsThreeDotsVertical } from "react-icons/bs";

// ---------- Types ----------
export interface ColumnMapping {
  [key: string]: {
    label: string;
    sortable?: boolean;
    filterable?: boolean;
  };
}

export interface DataTableProps<T extends Record<string, unknown>> {
  title: string;
  data: T[];
  columnMappings?: ColumnMapping;
  actions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
  searchable?: boolean;
  pagination?: boolean;
  className?: string;
}

// ---------- Helpers ----------
function getActionIcon(label: string) {
  switch (label.toLowerCase()) {
    case "view":
      return <Eye className="w-4 h-4" />;
    case "edit":
      return <Edit className="w-4 h-4" />;
    case "delete":
      return <Trash2 className="w-4 h-4" />;
    default:
      return label;
  }
}

function renderSmartCell(column: string, cellValue: unknown): React.ReactNode {
  if (Array.isArray(cellValue)) return (cellValue as unknown[]).join(", ");

  if (cellValue && typeof cellValue === "object") {
    const nameish = (cellValue as any).full_name ?? (cellValue as any).name;
    if (nameish) return nameish as string;
  }

  if (column === "icon_svg") {
    if (cellValue && typeof cellValue === "string") {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          <div
            className="w-6 h-6 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: cellValue as string }}
          />
        </div>
      );
    }
    return <span className="text-muted-foreground">No SVG</span>;
  }

  if (column === "icon") {
    if (cellValue && typeof cellValue === "string") {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          <img
            src={cellValue as string}
            alt="Icon"
            className="w-6 h-6 object-cover rounded border border-gray-200 shadow-sm"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              const parent = t.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="w-6 h-6 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-400">❌</div>';
              }
            }}
          />
        </div>
      );
    }
    return <span className="text-muted-foreground">No Image</span>;
  }

  if (column === "color" || column === "color_code") {
    if (cellValue && typeof cellValue === "string") {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded border border-gray-300 shadow-sm"
            style={{ backgroundColor: cellValue as string }}
          />
          <span className="font-mono text-xs">{cellValue as string}</span>
        </div>
      );
    }
  }

  if (column === "is_active" || column === "is_visible") {
    const isActive = Boolean(cellValue);
    return (
      <Badge
        variant="outline"
        className={`px-2 py-0.5 ${
          isActive
            ? "border-green-300 text-green-700"
            : "border-red-300 text-red-700"
        }`}
      >
        <span
          className={`mr-1 inline-block h-2 w-2 rounded-full ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  }

  return (cellValue as string) ?? "N/A";
}

// ---------- Column Filter ----------
function DataTableColumnFilter<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  const facets = column.getFacetedUniqueValues();
  const options = React.useMemo(() => {
    const arr: { value: string; count: number }[] = [];
    facets.forEach((count: number, v: unknown) => {
      if (v === undefined || v === null) return;
      arr.push({ value: String(v), count });
    });
    arr.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
    return arr.slice(0, 500);
  }, [facets]);

  const current = (column.getFilterValue() as string) ?? "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`Filter ${title}`}
          className="p-2 -mr-1 inline-flex items-center justify-center bg-transparent hover:bg-transparent outline-none ring-0 border-0"
        >
          <Funnel
            className={`h-4 w-4 ${
              current ? "text-blue-600" : "text-gray-700"
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64" align="start">
        <Command>
          <div className="flex items-center px-2 py-2 border-b">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <CommandInput placeholder={`Search ${title}...`} />
          </div>
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value}
                onSelect={(val: string) => column.setFilterValue(val)}
              >
                <div
                  className={`mr-2 h-2 w-2 rounded-full ${
                    current === opt.value ? "bg-blue-600" : "bg-muted"
                  }`}
                />
                <span className="flex-1">{opt.value}</span>
                <span className="text-xs text-muted-foreground">
                  {opt.count}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="flex items-center justify-between px-2 py-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 hover:bg-transparent focus-visible:ring-0 focus:ring-0"
              onClick={() => column.setFilterValue(undefined)}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ---------- Header chip ----------
function ColumnHeaderChip<TData>({
  column,
  title,
  sortable = true,
  filterable = true,
}: {
  column: Column<TData, unknown>;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
}) {
  const sorted = column.getIsSorted() as false | "asc" | "desc";

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`Sort ${title}`}
        className="h-7 px-1.5 -ml-1 inline-flex items-center font-semibold text-black bg-transparent outline-none ring-0 border-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={
          sortable ? () => column.toggleSorting(sorted === "asc") : undefined
        }
        disabled={!sortable}
      >
        <span className="mr-1">{title}</span>
        {sortable ? (
          sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
          )
        ) : null}
      </button>

      {filterable ? (
        <DataTableColumnFilter<TData> column={column} title={title} />
      ) : null}
    </div>
  );
}

// ---------- Checkbox ----------
const SelectCheckbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
}> = ({ checked, indeterminate, onChange, ariaLabel = "checkbox", className }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.currentTarget.checked)}
      aria-label={ariaLabel}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${className ?? ""}`}
    />
  );
};

// ---------- Build columns ----------
function buildColumns<T extends Record<string, unknown>>(
  sampleRow: T,
  mappings?: ColumnMapping,
  actions?: DataTableProps<T>["actions"]
): ColumnDef<T>[] {
  const keys = mappings ? Object.keys(mappings) : Object.keys(sampleRow);

  const cols: ColumnDef<T>[] = [
    {
      id: "select",
      header: ({ table }: { table: TableInstance<T> }) => (
        <SelectCheckbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
          ariaLabel="Select all"
          className="mx-1"
        />
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <SelectCheckbox
          checked={row.getIsSelected()}
          indeterminate={
            typeof (row as any).getIsSomeSelected === "function"
              ? (row as any).getIsSomeSelected()
              : false
          }
          onChange={(checked) => row.toggleSelected(checked)}
          ariaLabel="Select row"
          className="mx-1"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  keys.forEach((key) => {
    const label =
      mappings?.[key]?.label ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const sortable = mappings?.[key]?.sortable !== false;
    const filterable = mappings?.[key]?.filterable !== false;

    cols.push({
      accessorKey: key as keyof T,
      header: ({ column }: { column: Column<T, unknown> }) => (
        <ColumnHeaderChip<T>
          column={column}
          title={label}
          sortable={sortable}
          filterable={filterable}
        />
      ),
      enableSorting: sortable,
      enableColumnFilter: filterable,
      filterFn: "includesString",
      cell: ({ row }: { row: Row<T> }) => {
        const v = row.getValue<unknown>(key as string);
        return <div className="whitespace-nowrap">{renderSmartCell(key, v)}</div>;
      },
    } as ColumnDef<T>);
  });

  if (actions && actions.length > 0) {
    cols.push({
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }: { row: Row<T> }) => {
        const r = row.original;
        return (
          <div className="flex justify-end items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100"
                  aria-label="Open menu"
                >
                  <span className="sr-only">Open menu</span>
                  <BsThreeDotsVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                {actions.map((a, i) => (
                  <DropdownMenuItem
                    key={`dd-${i}`}
                    onClick={() => a.onClick(r)}
                    aria-label={a.label}
                  >
                    <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                      {getActionIcon(a.label)}
                    </span>
                    <span>{a.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  }

  return cols;
}

// ---------- Main component ----------
export default function DataTable<T extends Record<string, unknown>>({
  title,
  data,
  columnMappings,
  actions = [],
  searchable = true,
  pagination = true,
  className = "",
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold">No Projects</h3>
      </div>
    );
  }

  const columns = React.useMemo(
    () => buildColumns<T>(data[0] as T, columnMappings, actions),
    [data, columnMappings, actions]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // default pagination like screenshot
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {table.getFilteredRowModel().rows.length} items total
            </p>
          </div>

          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 w-72"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((c: any) => c.getCanHide())
                  .map((c: any) => (
                    <DropdownMenuCheckboxItem
                      key={c.id}
                      className="capitalize"
                      checked={c.getIsVisible()}
                      onCheckedChange={(v) => c.toggleVisibility(!!v)}
                    >
                      {c.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border m-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-0">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="p-2 whitespace-nowrap bg-gray-100 text-black border-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-blue-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination */}
      {pagination && (
        <div className="px-4 md:px-6 py-3 border-t bg-white flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          <div className="flex items-center gap-3">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Rows per page</span>
              <select
                className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm"
                value={pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Page X of Y */}
            <div className="ml-1 text-sm font-medium text-gray-700">
              Page {pageIndex + 1} of {pageCount}
            </div>

            {/* Nav buttons: « ‹ › » */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
