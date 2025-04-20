"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Image, 
  UploadCloud, 
  Search, 
  Trash2, 
  Copy, 
  Grid2X2, 
  List 
} from "lucide-react";

// Mock media data for demo
const mockMediaItems = [
  { id: "1", name: "isotipo.webp", path: "/isotipo.webp", type: "image", size: "45 KB", uploaded: "2023-10-12" },
  { id: "2", name: "amigdala.webp", path: "/amigdala.webp", type: "image", size: "76 KB", uploaded: "2023-10-12" },
  { id: "3", name: "sol.webp", path: "/sol.webp", type: "image", size: "1.2 MB", uploaded: "2023-09-30" },
  { id: "4", name: "shadow-hands.jpeg", path: "/images/shadow-hands.jpeg", type: "image", size: "320 KB", uploaded: "2023-09-28" },
  { id: "5", name: "circle-artwork.jpeg", path: "/images/circle-artwork.jpeg", type: "image", size: "450 KB", uploaded: "2023-09-20" },
  { id: "6", name: "workshop-candle.jpeg", path: "/images/workshop-candle.jpeg", type: "image", size: "540 KB", uploaded: "2023-09-15" },
  { id: "7", name: "group-art-workshop.jpeg", path: "/images/group-art-workshop.jpeg", type: "image", size: "780 KB", uploaded: "2023-08-27" },
];

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState(mockMediaItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);
  
  // Filter media items based on search query
  const filteredItems = searchQuery
    ? mediaItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mediaItems;
    
  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };
  
  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      setMediaItems(mediaItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };
  
  const copyPathToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    alert(`Path copied to clipboard: ${path}`);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newItems = Array.from(e.target.files!).map((file, index) => ({
        id: Date.now() + index.toString(),
        name: file.name,
        path: `/uploads/${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: `${Math.round(file.size / 1024)} KB`,
        uploaded: new Date().toISOString().split('T')[0]
      }));
      
      setMediaItems([...newItems, ...mediaItems]);
      setIsUploading(false);
    }, 1500);
  };
  
  return (
    <div className="mt-14 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Library</h1>
        <p className="text-gray-600">
          Manage images and media files used on your website.
        </p>
      </div>
      
      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search media..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 self-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-gray-100" : ""}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("list")}
            className={view === "list" ? "bg-gray-100" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Upload Section */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col items-center">
          <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Upload Media</h2>
          <p className="text-gray-600 text-center mb-4">
            Drag and drop files here or click to browse
          </p>
          
          <label className="relative">
            <Button isLoading={isUploading}>
              <UploadCloud className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Select Files"}
            </Button>
            <input
              type="file"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </Card>
      
      {/* Media Items Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-3 h-4 w-4"
              checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
              onChange={selectAllItems}
            />
            <span className="font-medium">{filteredItems.length} items</span>
            {selectedItems.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">({selectedItems.length} selected)</span>
            )}
          </div>
          
          {selectedItems.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={deleteSelectedItems}
              className="bg-red-100 text-red-600 hover:bg-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No media items found.
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`relative group rounded-md overflow-hidden border ${
                  selectedItems.includes(item.id) ? "border-yellow-500 ring-2 ring-yellow-500" : "border-gray-200"
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="h-4 w-4"
                  />
                </div>
                
                <div className="aspect-square bg-gray-100">
                  <img
                    src={item.path}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.size}</p>
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                    onClick={() => copyPathToClipboard(item.path)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="bg-red-600"
                    onClick={() => {
                      if (confirm(`Delete ${item.name}?`)) {
                        setMediaItems(mediaItems.filter(i => i.id !== item.id));
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center p-4 hover:bg-gray-50 ${
                  selectedItems.includes(item.id) ? "bg-yellow-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                  className="mr-4 h-4 w-4"
                />
                
                <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden mr-4">
                  <img
                    src={item.path}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.size} • {item.uploaded}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPathToClipboard(item.path)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Path
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="bg-red-100 text-red-600 hover:bg-red-200"
                    onClick={() => {
                      if (confirm(`Delete ${item.name}?`)) {
                        setMediaItems(mediaItems.filter(i => i.id !== item.id));
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
