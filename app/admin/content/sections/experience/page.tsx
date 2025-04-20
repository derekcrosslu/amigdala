"use client";

import { useState, useEffect } from "react";
import Dialog from "@/components/ui/dialog";
import { fetchContent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const initialExperienceContent = {
  featuredImage: "",

  heading: "EXPERIENCIA",
  leftText: "Más de 15 años acompañando a personas y organizaciones en procesos de desarrollo personal y profesional.",
  rightText: "He trabajado con empresas, instituciones educativas y colectivos artísticos, facilitando espacios de aprendizaje y transformación."
};

import { ImageUpload } from "@/components/admin/ImageUpload";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export default function ExperienceSectionEditor() {
  const [formData, setFormData] = useState(initialExperienceContent);

  // Fetch latest experience content from backend on mount
  useEffect(() => {
    fetchContent("experience")
      .then(data => {
        if (data && data.section === "experience") {
          const { _id, section, updatedAt, ...rest } = data;
          setFormData({ ...initialExperienceContent, ...rest });
        }
      })
      .catch(() => {/* fallback to initialExperienceContent if error */});
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Handler to open modal
  const openMediaLibrary = () => setShowMediaLibrary(true);

  // Handler to receive selected image
  const handleSelectFromMediaLibrary = (imagePath: string) => {
    setFormData(prev => ({ ...prev, featuredImage: imagePath }));
    setShowMediaLibrary(false);
  };

  // For ImageUpload direct upload
  const handleImageChange = (imagePath: string) => {
    setFormData(prev => ({ ...prev, featuredImage: imagePath }));
    if (isSaved) setIsSaved(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          section: "experience",
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
      alert("Failed to save changes. Por favor, inténtalo de nuevo.");
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
    <div className="max-w-2xl mx-auto pt-20">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/admin/content" className="p-2 hover:bg-yellow-200 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <CardTitle>Editar sección: Experiencia</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Input
              label="Título principal"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="mb-2"
            />
            <Textarea
              label="Texto columna izquierda"
              name="leftText"
              value={formData.leftText}
              onChange={handleChange}
              rows={5}
              className="mb-2"
            />
            <Textarea
              label="Texto columna derecha"
              name="rightText"
              value={formData.rightText}
              onChange={handleChange}
              rows={5}
              className="mb-2"
            />
            {/* Featured Image Section */}
            <div className="mb-4">
              <div className="font-bold mb-2">Imagen destacada</div>
              <p className="text-sm text-gray-600 mb-2">
                Imagen actual: {formData.featuredImage || "Ninguna"}
              </p>
              {formData.featuredImage && (
                <div className="w-full h-40 relative rounded-md overflow-hidden border border-gray-300 mb-2">
                  <img
                    src={formData.featuredImage}
                    alt="Imagen destacada"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={openMediaLibrary}
                >
                  Elegir de la biblioteca
                </Button>
                <span className="text-sm text-gray-500">o</span>
                <ImageUpload
                  currentImage={formData.featuredImage}
                  onImageChange={handleImageChange}
                  label={"Subir nueva imagen"}
                />
              </div>
              <MediaLibraryModal
                isOpen={showMediaLibrary}
                onClose={() => setShowMediaLibrary(false)}
                onSelect={handleSelectFromMediaLibrary}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} className="flex items-center">
              <Save className="w-5 h-5 mr-2" />Guardar cambios
            </Button>
            {isSaved && <span className="ml-4 text-green-600 font-mono">Guardado!</span>}
          </CardFooter>
        </form>
      </Card>
      <Dialog open={showSavedModal} onClose={() => setShowSavedModal(false)}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>¡Sección guardada!</h2>
          <p>Section saved successfully!</p>
        </div>
      </Dialog>
    </div>
  );
}
