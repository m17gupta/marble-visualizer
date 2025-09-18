import React, { useRef, useState } from "react";
import { Upload, Check } from "lucide-react";

interface ViewUploaderProps {
  viewType: string;
  uploadedFile: File | null;
  onFileUpload: (file: File, viewType: string) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

export async function convertToWebP(file: any) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const img: any = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx: any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob: any) => {
            resolve(
              new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                type: "image/webp",
              })
            );
          },
          "image/webp",
          0.5
        );
      };
    };
  });
}

const ViewUploader: React.FC<ViewUploaderProps> = ({
  viewType,
  uploadedFile,
  onFileUpload,
  onFileRemove,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Map view types to background images
  const getBackgroundImage = (view: string) => {
    const viewMap: { [key: string]: string } = {
      "Front View": "https://dzinly.in/img/view-front.png",
      "Rear View": "https://dzinly.in/img/view-rear.png",
      "Left View": "https://dzinly.in/img/view-left.png",
      "Right View": "https://dzinly.in/img/view-right.png",
    };
    return viewMap[view] || "https://dzinly.in/img/view-front.png";
  };

  // Generate image preview when file is uploaded
  React.useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setImagePreview(null);
    }
  }, [uploadedFile]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileUpload(file, viewType);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
   
      onFileUpload(e.target.files[0], viewType);
    }
  };



  const openFileSelector = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative">
 

      <div
        className={`relative border-2 border-dashed h-96 rounded-lg p-6  transition-all duration-300 cursor-pointer overflow-hidden ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : dragActive
            ? "border-blue-500 bg-blue-50"
            : uploadedFile
            ? "border-green-500 bg-green-50"
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        {/* Background Image */}
        {!uploadedFile && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url(${getBackgroundImage(viewType)})`,
            }}
          />
        )}

        {/* Uploaded Image Thumbnail */}
        {uploadedFile && imagePreview && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${imagePreview})`,
            }}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {uploadedFile ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white z-10">
            <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Check className="h-4 w-4 text-green-600" />
            </div>

            <p className="text-xs font-medium text-white bg-black bg-opacity-50 rounded px-2 py-1">
              Image Selected
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-gray-50 p-0 text-black hover:text-black flex items-center justify-center shadow-md transition-all"
            >
              <span className="text-sm" style={{ paddingLeft: "1px" }}>
                X
              </span>
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
              <Upload className="h-6 w-6   text-blue-600" />
            </div>
         
            <p className="text-lg font-medium text-black   rounded px-2 py-1 mt-1">
              {disabled ? "" : "Drag & drop your image"}
            </p>
            <p className="text-xs text-gray-600 rounded px-2 py-1 mt-1">
              {disabled ? "" : "or click to browsee"}
            </p>

               <span className="text-xs font-medium text-white bg-black  rounded-full px-4 py-2 mt-4">
              {disabled ? "Only one image allowed" : "Uplaod Select"}
            </span>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUploader;
