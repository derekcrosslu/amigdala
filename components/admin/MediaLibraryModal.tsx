"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MediaItem {
  _id: string;
  name: string;
  path: string;
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

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/media")
        .then((res) => res.json())
        .then((data) => setMedia(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

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
                <button
                  key={item._id}
                  className="border rounded hover:ring-2 hover:ring-blue-400 focus:outline-none"
                  onClick={() => {
                    onSelect(item.path);
                    onClose();
                  }}
                >
                  <img
                    src={item.path}
                    alt={item.name}
                    className="object-cover w-full h-32 rounded mb-2"
                  />
                  <div className="text-xs text-gray-700 truncate">{item.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
