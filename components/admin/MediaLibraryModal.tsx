"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MediaItem {
  _id: string;
  name: string;
  path: string;
  apiUrl?: string; // New field for API-routed URLs
  type: string;
  size: string;
  uploaded: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string) => void;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);
  
  const loadMedia = () => {
    setLoading(true);
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => setMedia(data))
      .finally(() => setLoading(false));
  };
  
  const handleDeleteImage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering selection
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setDeleting(id);
    try {
      const response = await fetch(`/api/media/delete?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted item from the state
        setMedia(media.filter(item => item._id !== id));
      } else {
        const error = await response.json();
        alert(`Error deleting image: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. See console for details.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Media Library</h2>
            <Button onClick={onClose} variant="ghost">Close</Button>
          </div>
          {loading ? (
            <div className="py-12 text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {media.length === 0 && <div className="col-span-3 text-center">No media found.</div>}
              {media.map((item) => (
                <div
                  key={item._id}
                  className="border rounded relative group"
                >
                  <button
                    className="w-full text-left hover:ring-2 hover:ring-blue-400 focus:outline-none"
                    onClick={() => {
                      onSelect(item.apiUrl || item.path);
                      onClose();
                    }}
                  >
                    <img
                      src={item.apiUrl || (item.path.startsWith('/uploads/') ? `/api/image?path=${encodeURIComponent(item.path)}` : item.path)}
                      alt={item.name}
                      className="object-cover w-full h-32 rounded mb-2"
                    />
                    <div className="text-xs text-gray-700 truncate px-2 pb-2">{item.name}</div>
                  </button>
                  
                  {/* Delete button */}
                  <button
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteImage(item._id, e)}
                    disabled={deleting === item._id}
                    title="Delete image"
                  >
                    {deleting === item._id ? (
                      <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
