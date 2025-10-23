import { AppDispatch } from "@/redux/store";
import { ChevronDown, ChevronUpIcon, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import SampleDataTable from "./SampleDataTable";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ColumnMapping {
  [key: string]: {
    label: string;
    sortable?: boolean;
    filterable?: boolean;
  };
}

interface DataTableProps {
  title: string;
  data: any[];
  columnMappings?: ColumnMapping;
  actions?: {
    label: string;
    onClick: (row: any) => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
  searchable?: boolean;
  pagination?: boolean;
  className?: string;
  sortingFunction?: any;
  sortfield?: string;
  sortorder?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columnMappings,
  actions = [],
  searchable = true,
  pagination = true,
  className = "",
  sortingFunction,
  sortfield,
  sortorder,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const dispatch = useDispatch<AppDispatch>();

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      Object.entries(row).some(([key, value]: [string, any]) => {
        // Skip filtering for non-filterable columns
        if (
          columnMappings &&
          columnMappings[key] &&
          columnMappings[key].filterable === false
        ) {
          return false;
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columnMappings]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, pagination]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getActionButtonClass = (variant: string = "secondary") => {
    const baseClass =
      "p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center";
    switch (variant) {
      case "primary":
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md hover:shadow-lg`;
      case "danger":
        return `${baseClass} bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-md hover:shadow-lg`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 shadow-sm hover:shadow-md`;
    }
  };

  const getActionIcon = (label: string) => {
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
  };

  if (data.length <= 0) {
    return <h1>No Projects </h1>;
  }

  // Only show columns that are defined in columnMappings, if provided
  const headers = columnMappings
    ? Object.keys(columnMappings)
    : Object.keys(data[0]);

  const getColumnLabel = (column: string) => {
    return (
      columnMappings?.[column]?.label ||
      column.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const isColumnSortable = (column: string) => {
    return columnMappings?.[column]?.sortable !== false;
  };

  return (
    // <div
    //   className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
    // >
    //   {/* Modern Header */}
    //   <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
    //     <div className="flex items-center justify-between">
    //       <div>
    //         <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    //         <p className="text-sm text-gray-500 mt-1">
    //           {filteredData.length} items total
    //         </p>
    //       </div>
    //       {searchable && (
    //         <div className="relative">
    //           <input
    //             type="text"
    //             placeholder="Search records..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 w-64"
    //           />
    //           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //             <span className="text-gray-400 text-lg">🔍</span>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   {/* Modern Table */}
    //   <div className="overflow-x-auto">
    //     <table className="w-full table-auto">
    //       <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
    //         <tr>
    //           {headers.map((column) => (
    //             <th
    //               key={column}
    //               className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider"
    //             >
    //               <div className="flex items-center space-x-2">
    //                 <span>{getColumnLabel(column)}</span>
    //                 {isColumnSortable(column) && (
    //                   <button
    //                     onClick={() =>
    //                       dispatch(sortingFunction({ orderby: column }))
    //                     }
    //                     className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
    //                   >
    //                     {sortfield === column && sortorder === "asec" ? (
    //                       <ChevronDown className="w-4 h-4 text-blue-600" />
    //                     ) : (
    //                       <ChevronUpIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
    //                     )}
    //                   </button>
    //                 )}
    //               </div>
    //             </th>
    //           ))}
    //           {actions.length > 0 && (
    //             <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
    //               Actions
    //             </th>
    //           )}
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {paginatedData.map((row, index) => {
    //           return (
    //             <tr
    //               key={index}
    //               className={`border-b border-gray-100 transition-all duration-200 ${
    //                 index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
    //               } hover:bg-blue-50 hover:shadow-sm`}
    //             >
    //               {headers.map((column) => {
    //                 const cell = row[column];
    //                 // Handle array cells containing objects
    //                 if (Array.isArray(cell)) {
    //                   return (
    //                     <td key={column} className="py-4 px-6 text-gray-700">
    //                       {cell?.join(", ")}
    //                     </td>
    //                   );
    //                 }

    //                 // Handle object cells with nested name properties
    //                 if (
    //                   cell &&
    //                   typeof cell === "object" &&
    //                   !Array.isArray(cell)
    //                 ) {
    //                   if (cell.full_name || cell.name) {
    //                     return (
    //                       <td key={column} className="py-4 px-6 text-gray-700">
    //                         {cell?.full_name ?? cell?.name ?? "N/A"}
    //                       </td>
    //                     );
    //                   }
    //                 }

    //                 // Handle SVG icons
    //                 if (column === "icon_svg") {
    //                   if (cell && typeof cell === "string") {
    //                     return (
    //                       <td key={column} className="py-4 px-6">
    //                         <div className="flex items-center justify-center w-8 h-8">
    //                           <div
    //                             className="w-6 h-6 flex items-center justify-center"
    //                             dangerouslySetInnerHTML={{ __html: cell }}
    //                           />
    //                         </div>
    //                       </td>
    //                     );
    //                   }
    //                   return (
    //                     <td key={column} className="py-4 px-6 text-gray-500">
    //                       No SVG
    //                     </td>
    //                   );
    //                 }

    //                 // Handle icon URLs (images)
    //                 if (column === "icon") {
    //                   if (cell && typeof cell === "string") {
    //                     return (
    //                       <td key={column} className="py-4 px-6">
    //                         <div className="flex items-center justify-center w-8 h-8">
    //                           <img
    //                             src={cell}
    //                             alt="Icon"
    //                             className="w-6 h-6 object-cover rounded border border-gray-200 shadow-sm"
    //                             onError={(e) => {
    //                               const target = e.currentTarget;
    //                               target.style.display = "none";
    //                               const parent = target.parentElement;
    //                               if (parent) {
    //                                 parent.innerHTML = `<div class="w-6 h-6 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-400">❌</div>`;
    //                               }
    //                             }}
    //                             onLoad={(e) => {
    //                               // Add a subtle hover effect when image loads successfully
    //                               e.currentTarget.classList.add(
    //                                 "hover:scale-110",
    //                                 "transition-transform",
    //                                 "duration-200"
    //                               );
    //                             }}
    //                           />
    //                         </div>
    //                       </td>
    //                     );
    //                   }
    //                   return (
    //                     <td key={column} className="py-4 px-6 text-gray-500">
    //                       No Image
    //                     </td>
    //                   );
    //                 }

    //                 // Handle color display
    //                 if (column === "color" || column === "color_code") {
    //                   if (cell && typeof cell === "string") {
    //                     return (
    //                       <td key={column} className="py-4 px-6">
    //                         <div className="flex items-center space-x-2">
    //                           <div
    //                             className="w-6 h-6 rounded border border-gray-300 shadow-sm"
    //                             style={{ backgroundColor: cell }}
    //                           />
    //                           <span className="text-gray-700 font-mono text-sm">
    //                             {cell}
    //                           </span>
    //                         </div>
    //                       </td>
    //                     );
    //                   }
    //                 }

    //                 // Handle boolean values (is_active, is_visible)
    //                 if (column === "is_active" || column === "is_visible") {
    //                   const isActive = Boolean(cell);
    //                   return (
    //                     <td key={column} className="py-4 px-6">
    //                       <span
    //                         className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
    //                           isActive
    //                             ? "bg-green-100 text-green-800"
    //                             : "bg-red-100 text-red-800"
    //                         }`}
    //                       >
    //                         <span
    //                           className={`w-2 h-2 rounded-full mr-1.5 ${
    //                             isActive ? "bg-green-400" : "bg-red-400"
    //                           }`}
    //                         />
    //                         {isActive ? "Active" : "Inactive"}
    //                       </span>
    //                     </td>
    //                   );
    //                 }

    //                 // Default case for primitive values
    //                 return (
    //                   <td key={column} className="py-4 px-6 text-gray-700">
    //                     {cell ?? "N/A"}
    //                   </td>
    //                 );
    //               })}
    //               {actions.length > 0 && (
    //                 <td className="py-4 px-6">
    //                   <div className="flex space-x-2">
    //                     {actions.map((action, actionIndex) => (
    //                       <button
    //                         key={actionIndex}
    //                         onClick={() => {
    //                           action.onClick(row);
    //                         }}
    //                         className={getActionButtonClass(action.variant)}
    //                         title={action.label}
    //                       >
    //                         {getActionIcon(action.label)}
    //                       </button>
    //                     ))}
    //                   </div>
    //                 </td>
    //               )}
    //             </tr>
    //           );
    //         })}
    //       </tbody>
    //     </table>
    //   </div>

    //   {/* Modern Pagination */}
    //   {pagination && totalPages > 1 && (
    //     <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
    //       <div className="text-sm text-gray-600 font-medium">
    //         Showing{" "}
    //         <span className="text-gray-900">
    //           {(currentPage - 1) * itemsPerPage + 1}
    //         </span>{" "}
    //         to{" "}
    //         <span className="text-gray-900">
    //           {Math.min(currentPage * itemsPerPage, filteredData.length)}
    //         </span>{" "}
    //         of <span className="text-gray-900">{filteredData.length}</span>{" "}
    //         results
    //       </div>
    //       <div className="flex items-center space-x-1">
    //         <button
    //           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
    //           disabled={currentPage === 1}
    //           className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
    //         >
    //           Previous
    //         </button>
    //         <div className="flex space-x-1">
    //           {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    //             let page;
    //             if (totalPages <= 5) {
    //               page = i + 1;
    //             } else if (currentPage <= 3) {
    //               page = i + 1;
    //             } else if (currentPage >= totalPages - 2) {
    //               page = totalPages - 4 + i;
    //             } else {
    //               page = currentPage - 2 + i;
    //             }
    //             return (
    //               <button
    //                 key={page}
    //                 onClick={() => setCurrentPage(page)}
    //                 className={`w-10 h-10 border rounded-lg text-sm font-medium transition-all duration-200 ${
    //                   currentPage === page
    //                     ? "bg-blue-600 text-white border-blue-600 shadow-md"
    //                     : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
    //                 }`}
    //               >
    //                 {page}
    //               </button>
    //             );
    //           })}
    //         </div>
    //         <button
    //           onClick={() =>
    //             setCurrentPage(Math.min(totalPages, currentPage + 1))
    //           }
    //           disabled={currentPage === totalPages}
    //           className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
    //         >
    //           Next
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <SampleDataTable 
     title={title}
              data={data}
              columnMappings={columnMappings}
              actions={actions}
              searchable={true}
              pagination={true}
    />
  );
};

export default DataTable;
