import React, { useRef, useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface ViewUploaderProps {
  viewType: string;
  uploadedFile: File | null;
  onFileUpload: (file: File, viewType: string) => void;
  onFileRemove: () => void;
  disabled?: boolean;
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
      'Front View': 'https://dzinly.in/img/view-front.png',
      'Rear View': 'https://dzinly.in/img/view-rear.png',
      'Left View': 'https://dzinly.in/img/view-left.png',
      'Right View': 'https://dzinly.in/img/view-rigth.png',
    };
    return viewMap[view] || 'https://dzinly.in/img/view-front.png';
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileUpload(file, viewType);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{viewType}</h3>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 h-32 transition-all duration-300 cursor-pointer overflow-hidden ${disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : dragActive
              ? 'border-blue-500 bg-blue-50'
              : uploadedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
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
            <p className="text-xs font-medium truncate px-2 bg-black bg-opacity-50 rounded px-2 py-1">
              {uploadedFile.name}
            </p>
            <p className="text-xs bg-black bg-opacity-50 rounded px-2 py-1 mt-1">
              {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
            </p>
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <div className="w-8 h-8 mx-auto bg-white bg-opacity-80 rounded-full flex items-center justify-center mb-2 shadow-sm">
              <Upload className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-xs font-medium text-gray-700 bg-white bg-opacity-80 rounded px-2 py-1">
              {disabled ? 'Upload previous views first' : 'Select'}
            </p>
            <p className="text-xs text-gray-500 bg-white bg-opacity-80 rounded px-2 py-1 mt-1">
              {disabled ? '' : 'JPG, PNG'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUploader;
