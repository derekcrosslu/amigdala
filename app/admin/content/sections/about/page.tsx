"use client";

import { useState, useEffect } from "react";
import { fetchContent } from "@/lib/api";
import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

// For demo purposes - in a real app, this would be fetched from an API or database
const initialAboutContent = {
  heading: "",
  profileImage: "/sol.webp",
  paragraph1: "Durante casi 20 años he acompañado a personas en su camino de desarrollo personal y profesional a través de las artes expresivas, construyendo puentes hacia el autoconocimiento y la transformación.",
  paragraph2: "Mi recorrido incluye más de 13 años en la asociación cultural D1, mi casa y escuela, donde he desarrollado metodologías que conectan el arte con el crecimiento humano.",
  paragraph3: "He tenido el privilegio de facilitar sesiones para una diversidad de espacios: desde empresas multinacionales hasta pequeños emprendimientos, desde docentes de colegios públicos hasta estudiantes universitarios, desde artistas consolidados hasta personas que apenas descubren su potencial creativo.",
  closingText: 'Ahora, después de acumular lo que siento como "un millón de horas de vuelo", estoy lista para expandir horizontes con AMIGDALA, mi consultora de arteterapia con enfoque humanista.',
  quote: "Para que puedas abrir tu mundo, primero he abierto el mío"
};

export default function AboutSectionEditor() {
  const [formData, setFormData] = useState(initialAboutContent);

  // Fetch latest about content from backend on mount
  useEffect(() => {
    fetchContent("about")
      .then(data => {
        if (data && data.section === "about") {
          const { _id, section, updatedAt, ...rest } = data;
          setFormData({ ...initialAboutContent, ...rest });
        }
      })
      .catch(() => {/* fallback to initialAboutContent if error */});
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear saved status when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  const handleImageChange = (imagePath: string) => {
    setFormData(prev => ({
      ...prev,
      profileImage: imagePath
    }));
    
    // Clear saved status when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "about",
          content: formData,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save content");
      }
      setIsSaved(true);
      setShowSavedModal(true);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save changes. Please try again.");
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
    <div>
      <div className="mb-8 flex items-center pt-20">
        <Link href="/admin/content" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit About Section</h1>
          <p className="text-gray-600">Update the content for the "Sobre Mí" section of your website.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Heading</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Section Heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Current image: {formData.profileImage}
                </p>
                
                {/* Display current image preview */}
                <div className="w-40 h-40 relative rounded-md overflow-hidden border border-gray-300">
                  <img 
                    src={formData.profileImage} 
                    alt="Profile" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="block mb-2 text-sm font-medium text-gray-700">
                  Change Image
                </p>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => alert("In a real implementation, this would open a media browser")}
                  >
                    Choose from Media Library
                  </Button>
                  <p className="text-sm text-gray-500">or</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => alert("In a real implementation, this would upload a new image")}
                  >
                    Upload New Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="First Paragraph"
                name="paragraph1"
                value={formData.paragraph1}
                onChange={handleChange}
                rows={3}
              />
              
              <Textarea
                label="Second Paragraph"
                name="paragraph2"
                value={formData.paragraph2}
                onChange={handleChange}
                rows={3}
              />
              
              <Textarea
                label="Third Paragraph"
                name="paragraph3"
                value={formData.paragraph3}
                onChange={handleChange}
                rows={3}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Closing Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Closing Text"
                name="closingText"
                value={formData.closingText}
                onChange={handleChange}
                rows={2}
              />
              
              <Input
                label="Quote"
                name="quote"
                value={formData.quote}
                onChange={handleChange}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(initialAboutContent)}
            >
              Reset Changes
            </Button>
            
            <Button
              type="submit"
              isLoading={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaved ? "Saved" : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
      <Dialog open={showSavedModal} onClose={() => setShowSavedModal(false)}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>¡Sección guardada!</h2>
          <p>About section saved successfully!</p>
        </div>
      </Dialog>
    </div>
  );
}
