"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imagePath: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  currentImage,
  onImageChange,
  label = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.path) {
        setPreviewUrl(data.path);
        onImageChange(data.path);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange("");
  };
  
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openMediaLibrary = () => {
    setShowMediaLibrary(true);
  };

  const handleSelectFromMediaLibrary = (imagePath: string) => {
    setPreviewUrl(imagePath);
    onImageChange(imagePath);
    setShowMediaLibrary(false);
  };

  const handleCloseMediaLibrary = () => {
    setShowMediaLibrary(false);
  };
  
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Image preview" 
              className="max-w-full h-auto rounded-md mx-auto"
              style={{ maxHeight: "200px" }}
            />
            
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </button>
            
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
                <div className="text-white">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Drag and drop an image here, or click to select</p>
            <Button
              type="button"
              variant="outline"
              onClick={openFilePicker}
              disabled={isUploading}
              className="mr-2"
            >
              Select Image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={openMediaLibrary}
              disabled={isUploading}
            >
              Choose from Media Library
            </Button>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>
      
      {previewUrl && !isUploading && (
        <div className="mt-2 text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFilePicker}
          >
            Replace Image
          </Button>
        </div>
      )}
      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={handleCloseMediaLibrary}
        onSelect={handleSelectFromMediaLibrary}
      />
    </div>
  );
}
