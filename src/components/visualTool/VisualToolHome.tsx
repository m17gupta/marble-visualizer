import React, { useState, useRef } from 'react';
import { Upload, Image } from 'lucide-react';
import { Button } from '../ui/button';


const VisualToolHome = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
   

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Image className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-12">
           Everything home exterior in one place
          </h1>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 mb-8 transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-4">
              {selectedFile ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <Image className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    File Selected: {selectedFile.name}
                  </h3>
                  <p className="text-gray-500">
                    Ready to process your image
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Drag-drop your photo here
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Upload furnished or empty space, sketches, house exterior, and landscaping.
                    <br />
                    Supports JPG and PNG formats.
                  </p>
                </>
              )}
            </div>

            {/* Browse Files Link */}
            {!selectedFile && (
              <div className="mt-6">
                <button
                  onClick={openFileSelector}
                  className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                >
                  Or click here to browse files
                </button>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={selectedFile ? () => console.log('Process file:', selectedFile) : openFileSelector}
            className={`w-full max-w-md py-4 text-lg font-semibold rounded-xl transition-all ${
              selectedFile
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gray-800 hover:bg-gray-900 text-white'
            }`}
          >
            <Image className="mr-2 h-5 w-5" />
            {selectedFile ? 'Process Image' : 'Choose a Photo'}
          </Button>

          {/* Additional Info */}
          {!selectedFile && (
            <div className="mt-8 text-sm text-gray-500">
              <p>
                Supported formats: JPG, PNG • Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VisualToolHome;