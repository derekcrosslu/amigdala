"use client";

import { useState, useEffect } from "react";
import { fetchSettings, updateSettings } from "@/lib/api-settings"; // <-- NEW IMPORT
import { Button } from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";

// Initial settings data for demo
const initialSettings = {
  general: {
    siteName: "AMIGDALA",
    tagline: "Arteterapia con Enfoque Humanista",
    email: "correo@amigdala.org",
    phone: "+51997244742",
    linkedin: "https://www.linkedin.com/in/solange-chrem-mesnik-714530170",
  },
  seo: {
    metaTitle: "AMIGDALA | Arteterapia con Enfoque Humanista",
    metaDescription: "AMIGDALA es una consultora de arteterapia con enfoque humanista que ofrece sesiones individuales, talleres grupales, consultorías corporativas y formación para educadores.",
    keywords: "arteterapia, terapia, arte, humanista, sesiones, talleres, consultoría, educadores",
    ogImage: "/isotipo.webp",
  },
  appearance: {
    primaryColor: "#F3C11A", // Yellow
    accentColor: "#000000",  // Black
    fontFamily: "Noto Sans",
  },
  advanced: {
    customCss: "",
    customJs: "",
    googleAnalyticsId: "",
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);

  // Load settings from backend on mount
  useEffect(() => {
    fetchSettings()
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      })
      .catch(() => {/* fallback to initialSettings if error */});
  }, []);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  
  const handleChange = (category: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
    
    // Clear saved status when settings are modified
    if (isSaved) setIsSaved(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSettings(settings);
      setIsSaved(true);
      setShowSavedModal(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      // Optionally, you can show an error modal here
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-close modal after 2 seconds
  useEffect(() => {
    if (showSavedModal) {
      const timer = setTimeout(() => setShowSavedModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSavedModal]);

  return (
    <div className="mt-24 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your website settings, SEO, and appearance.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              className={`w-full text-left px-4 py-3 ${
                activeTab === "general" 
                  ? "bg-yellow-100 border-l-4 border-yellow-500" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`w-full text-left px-4 py-3 ${
                activeTab === "seo" 
                  ? "bg-yellow-100 border-l-4 border-yellow-500" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("seo")}
            >
              SEO
            </button>
            <button
              className={`w-full text-left px-4 py-3 ${
                activeTab === "appearance" 
                  ? "bg-yellow-100 border-l-4 border-yellow-500" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("appearance")}
            >
              Appearance
            </button>
            <button
              className={`w-full text-left px-4 py-3 ${
                activeTab === "advanced" 
                  ? "bg-yellow-100 border-l-4 border-yellow-500" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("advanced")}
            >
              Advanced
            </button>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <Card>
              {activeTab === "general" && (
                <>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Site Name"
                      value={settings.general.siteName}
                      onChange={(e) => handleChange("general", "siteName", e.target.value)}
                    />
                    
                    <Input
                      label="Tagline"
                      value={settings.general.tagline}
                      onChange={(e) => handleChange("general", "tagline", e.target.value)}
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => handleChange("general", "email", e.target.value)}
                    />
                    
                    <Input
                      label="Phone Number"
                      value={settings.general.phone}
                      onChange={(e) => handleChange("general", "phone", e.target.value)}
                    />
                    
                    <Input
                      label="LinkedIn Profile URL"
                      value={settings.general.linkedin}
                      onChange={(e) => handleChange("general", "linkedin", e.target.value)}
                    />
                  </CardContent>
                </>
              )}
              
              {activeTab === "seo" && (
                <>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Meta Title"
                      value={settings.seo.metaTitle}
                      onChange={(e) => handleChange("seo", "metaTitle", e.target.value)}
                    />
                    
                    <Textarea
                      label="Meta Description"
                      value={settings.seo.metaDescription}
                      onChange={(e) => handleChange("seo", "metaDescription", e.target.value)}
                      rows={3}
                    />
                    
                    <Textarea
                      label="Keywords"
                      value={settings.seo.keywords}
                      onChange={(e) => handleChange("seo", "keywords", e.target.value)}
                      rows={2}
                    />
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Open Graph Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden border border-gray-300">
                          <img 
                            src={settings.seo.ogImage} 
                            alt="OG Image" 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        
                        <div>
                          <Input
                            value={settings.seo.ogImage}
                            onChange={(e) => handleChange("seo", "ogImage", e.target.value)}
                            className="mb-2"
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => alert("In a real implementation, this would open a media browser")}
                          >
                            Choose Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "appearance" && (
                <>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-10 rounded-full border border-gray-300" 
                          style={{ backgroundColor: settings.appearance.primaryColor }}
                        />
                        <Input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleChange("appearance", "primaryColor", e.target.value)}
                        />
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleChange("appearance", "primaryColor", e.target.value)}
                          className="w-10 h-10 p-1 rounded"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Accent Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-10 rounded-full border border-gray-300" 
                          style={{ backgroundColor: settings.appearance.accentColor }}
                        />
                        <Input
                          type="text"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleChange("appearance", "accentColor", e.target.value)}
                        />
                        <input
                          type="color"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleChange("appearance", "accentColor", e.target.value)}
                          className="w-10 h-10 p-1 rounded"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Font Family
                      </label>
                      <select
                        value={settings.appearance.fontFamily}
                        onChange={(e) => handleChange("appearance", "fontFamily", e.target.value)}
                        className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="Noto Sans">Noto Sans</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "advanced" && (
                <>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      label="Custom CSS"
                      value={settings.advanced.customCss}
                      onChange={(e) => handleChange("advanced", "customCss", e.target.value)}
                      rows={6}
                      placeholder="/* Add your custom CSS here */"
                    />
                    
                    <Textarea
                      label="Custom JavaScript"
                      value={settings.advanced.customJs}
                      onChange={(e) => handleChange("advanced", "customJs", e.target.value)}
                      rows={6}
                      placeholder="// Add your custom JavaScript here"
                    />
                    
                    <Input
                      label="Google Analytics ID"
                      value={settings.advanced.googleAnalyticsId}
                      onChange={(e) => handleChange("advanced", "googleAnalyticsId", e.target.value)}
                      placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                    />
                  </CardContent>
                </>
              )}
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Reset to default settings? This will discard all your changes.")) {
                      setSettings(initialSettings);
                      setIsSaved(false);
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaved ? "Saved" : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      <Dialog open={showSavedModal} onClose={() => setShowSavedModal(false)}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>¡Configuración guardada!</h2>
          <p>Settings saved successfully!</p>
        </div>
      </Dialog>
    </div>
  );
}
