import { useState } from "react";
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importdata: any[]) => void;
  title?: string;
  type?: string;
}

export const CSVImportModal = ({
  isOpen,
  onClose,
  onImport,
  title = "Import CSV File",
  type,
}: CSVImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
      processCSV(selectedFile);
    } else {
      setError("Please select a valid CSV file");
      setFile(null);
      setPreview([]);
      setHeaders([]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const processCSV = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length === 0) {
          setError("CSV file is empty");
          setIsProcessing(false);
          return;
        }

        // Parse headers
        const headerLine = lines[0];
        const parsedHeaders = headerLine
          .split(",")
          .map((h) => h.trim().replace(/^"|"$/g, ""));
        setHeaders(parsedHeaders);

        const data = lines.slice(1).map((line) => {
          const values = line
            .replace(/\r$/, "")
            .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
            .map((v) => v.trim().replace(/^"|"$/g, ""));

          const row: any = {};
          parsedHeaders.forEach((header, index) => {
            let value: string[] | string | number = values[index] || "";
            // Convert possible_value into array
            if (header === "possible_values" && value) {
              value = value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            }

            // Convert category_id to number
            if (header === "category_id") {
              value = Number(value);
            }

            row[header] = value;
          });

          return row;
        });

        setPreview(data);
        setIsProcessing(false);
      } catch (err) {
        setError("Error parsing CSV file");
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  // console.log(preview);

  const handleImport = () => {
    if (preview && preview.length <= 0) {
      setError("Please select a file");
      return;
    }
    setIsProcessing(true);
    onImport(preview);
    setIsProcessing(false);
    setPreview([]);
    setHeaders([]);
    setIsDragging(false);
    setFile(null);
    setError(null);
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setPreview([]);
    setHeaders([]);
    setIsDragging(false);
    onClose();
  };

  const handleValidate = () => {
    const cloned = structuredClone(preview);
    // const final: {
    //   [key: string | number]: any;
    // } = {};
    // for (let i = 0; i < cloned.length; i++) {
    //   let val = cloned[i];
    //   let attr = {
    //     attribute_id: val.attribute_id,
    //     value: val.value,
    //     is_variant_value: val.is_variant_value,
    //     visible: val.visible,
    //     sku: val.sku,
    //     stock: val.stock,
    //     price: val.price,
    //     product_id: null,
    //   };
    //   if (val.name in final) {
    //     final[val.name].allattr.push(attr);
    //   } else {
    //     final[val.name] = {
    //       name: val.name,
    //       brand_id: val.brand_id,
    //       allattr: [attr],
    //     };
    //   }
    // }

    // console.log(final);
  };

  console.log(preview);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Browse Files
              </span>
            </label>
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">{file.name}</p>
                <p className="text-sm text-green-700">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-900">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Preview (First 5 rows)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((header, colIndex) => {
                          let check = typeof row[header] == "object";
                          return (
                            <td
                              key={colIndex}
                              className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                            >
                              {check ? row[header].join(", ") : row[header]}
                              {/* {row[header]} */}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isProcessing}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Import CSV"}
          </button>
          <button
            onClick={handleValidate}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Validate
          </button>
        </div>
      </div>
    </div>
  );
};

// export const AttributesInput = (type:string) => {
//   const {} = useSelector((state:RootState)=>state.)

//   return (
//     <div>
//     <select name="" id="">

//     </select>
//     </div>
//   )
// }
