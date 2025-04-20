"use client";

import { useState, useEffect } from "react";
import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

// For demo purposes - in a real app, this would be fetched from an API or database
const initialServicesContent = {
  // Used as fallback while loading

  heading: "SERVICIOS",
  introduction: "En AMIGDALA diseño experiencias personalizadas para cada espacio, momento y necesidad. Las artes expresivas se convierten en puentes hacia descubrimientos profundos y transformaciones significativas.",
  services: [
    {
      id: "1",
      title: "Sesiones Individuales",
      description: "Un espacio íntimo y seguro para explorar tu mundo interior a través de diferentes lenguajes artísticos. No se requiere experiencia previa en arte, solo apertura para descubrir.",
      additionalText: "Ideal para momentos de transición, búsqueda personal o cuando necesitas claridad en tu camino."
    },
    {
      id: "2",
      title: "Talleres Grupales",
      description: "Experiencias colectivas donde la creatividad compartida potencia el desarrollo personal. Grupos reducidos que permiten atención personalizada dentro de la dinámica colectiva.",
      additionalText: "Perfectos para equipos de trabajo, grupos de amigos o comunidades que buscan fortalecer vínculos mientras exploran nuevas dimensiones de sí mismos."
    },
    {
      id: "3",
      title: "Consultorías Corporativas",
      description: "Programas diseñados específicamente para organizaciones que buscan impulsar la creatividad, mejorar el clima laboral o facilitar procesos de cambio utilizando metodologías basadas en artes expresivas.",
      additionalText: "Adaptables a diferentes duraciones, desde intervenciones puntuales hasta procesos de acompañamiento continuado."
    },
    {
      id: "4",
      title: "Formación para Educadores",
      description: "Herramientas prácticas para docentes que desean incorporar las artes expresivas como vehículo de aprendizaje y desarrollo en sus espacios educativos.",
      additionalText: "Basado en años de experiencia trabajando con instituciones educativas de diversos contextos."
    }
  ],
  featuredImage: "/images/workshop-candle.jpeg"
};

export default function ServicesSectionEditor() {
  const [formData, setFormData] = useState(initialServicesContent);
  const [isLoading, setIsLoading] = useState(true); // true initially
  const [isSaved, setIsSaved] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Fetch current section content on mount
  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/content?section=services');
        if (!res.ok) throw new Error('Failed to fetch section content');
        const data = await res.json();
        if (data && !data.error) {
          setFormData({
            heading: data.heading || initialServicesContent.heading,
            introduction: data.introduction || initialServicesContent.introduction,
            services: data.services || initialServicesContent.services,
            featuredImage: data.featuredImage || initialServicesContent.featuredImage,
          });
        } else {
          setError(data.error || 'No data found');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching content');
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

// Handler to open modal
const openMediaLibrary = () => setShowMediaLibrary(true);

// Handler to receive selected image
const handleSelectFromMediaLibrary = (imagePath: string) => {
  setFormData(prev => ({ ...prev, featuredImage: imagePath }));
  setShowMediaLibrary(false);
};


  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear saved status when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
    
    // Clear saved status when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  const addNewService = () => {
    const newService = {
      id: Date.now().toString(),
      title: "Nuevo Servicio",
      description: "Descripción del nuevo servicio",
      additionalText: "Información adicional sobre el servicio"
    };
    
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
    
    // Clear saved status when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  const removeService = (index: number) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
    
    // Clear saved status when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'services',
          content: formData,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to save');
      }
      setIsSaved(true);
      setShowSavedModal(true);
    } catch (error: any) {
      setError(error.message || 'Failed to save changes.');
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
          <h1 className="text-3xl font-bold">Edit Services Section</h1>
          <p className="text-gray-600">Update the content for the "Servicios" section of your website.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Heading & Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Section Heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
              />
              
              <Textarea
                label="Introduction Text"
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                rows={3}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Services</CardTitle>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addNewService}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardHeader>
            <CardContent>
              {formData.services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="mb-8 p-4 border border-gray-200 rounded-md last:mb-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Service #{index + 1}</h3>
                    
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeService(index)}
                      className="bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label="Service Title"
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    />
                    
                    <Textarea
                      label="Service Description"
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      rows={3}
                    />
                    
                    <Textarea
                      label="Additional Information"
                      value={service.additionalText}
                      onChange={(e) => handleServiceChange(index, 'additionalText', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Current image: {formData.featuredImage}
                </p>
                {isLoading ? (
                  <div className="w-full h-40 flex items-center justify-center text-gray-400">Loading image...</div>
                ) : error ? (
                  <div className="w-full h-40 flex items-center justify-center text-red-400">{error}</div>
                ) : formData.featuredImage ? (
                  <div className="w-full h-40 relative rounded-md overflow-hidden border border-gray-300">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : null}
              </div>
              
              <div className="mt-4">
                <p className="block mb-2 text-sm font-medium text-gray-700">
                  Change Image
                </p>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={openMediaLibrary}
                  >
                    Choose from Media Library
                  </Button>
                  <p className="text-sm text-gray-500">or</p>
                  <ImageUpload
                    currentImage={formData.featuredImage}
                    onImageChange={(path) => setFormData(prev => ({ ...prev, featuredImage: path }))}
                    label={"Upload New Image"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(initialServicesContent)}
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
            <MediaLibraryModal
  isOpen={showMediaLibrary}
  onClose={() => setShowMediaLibrary(false)}
  onSelect={handleSelectFromMediaLibrary}
/>
          </div>
        </div>
      </form>
      <Dialog open={showSavedModal} onClose={() => setShowSavedModal(false)}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>¡Sección guardada!</h2>
          <p>Section saved successfully!</p>
        </div>
      </Dialog>
    </div>
  );
}
