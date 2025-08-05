"use client";

import { useState, useEffect } from "react";
import Dialog from "@/components/ui/dialog";
import { fetchContent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const initialApproachContent = {
  // Used as fallback while loading
  featuredImage: "",

  heading: "MI ENFOQUE",
  intro: "Mi enfoque combina creatividad, empatía y estructura para acompañar procesos de transformación.",
  principles: [
    { number: 1, title: "Presencia", description: "Estar aquí y ahora, plenamente disponible para el proceso." },
    { number: 2, title: "Escucha activa", description: "Atender con apertura y sin juicio a lo que emerge en cada encuentro." },
    { number: 3, title: "Cuidado del vínculo", description: "Crear un espacio seguro donde la confianza pueda crecer." },
  ],
  closing: "Cada proceso es único y merece un acompañamiento a medida."
};

import { ImageUpload } from "@/components/admin/ImageUpload";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export default function ApproachSectionEditor() {
  const [formData, setFormData] = useState(initialApproachContent);

  // Fetch latest content from backend on mount
  useEffect(() => {
    fetchContent("approach")
      .then(data => {
        // If the backend returns the section, update state
        if (data && data.section === "approach") {
          // Remove MongoDB _id if present
          const { _id, section, updatedAt, ...rest } = data;
          setFormData({ ...initialApproachContent, ...rest });
        }
      })
      .catch(() => {/* fallback to initialApproachContent if error */});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSaved) setIsSaved(false);
  };

  // For ImageUpload direct upload
  const handleImageChange = (imagePath: string) => {
    setFormData(prev => ({ ...prev, featuredImage: imagePath }));
    if (isSaved) setIsSaved(false);
  };

  const handlePrincipleChange = (idx: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      principles: prev.principles.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    }));
    if (isSaved) setIsSaved(false);
  };

  const addPrinciple = () => {
    setFormData(prev => ({
      ...prev,
      principles: [...prev.principles, { number: prev.principles.length + 1, title: "", description: "" }]
    }));
    if (isSaved) setIsSaved(false);
  };

  const removePrinciple = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      principles: prev.principles.filter((_, i) => i !== idx)
        .map((p, i) => ({ ...p, number: i + 1 }))
    }));
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
          section: "approach",
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
            <CardTitle>Editar sección: Mi Enfoque</CardTitle>
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
              label="Introducción"
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              rows={3}
              className="mb-2"
            />
            <div className="mb-4">
              <div className="font-bold mb-2">Principios</div>
              {formData.principles.map((p, idx) => (
                <div key={idx} className="flex items-start space-x-2 mb-2">
                  <Input
                    label="N°"
                    type="number"
                    min={1}
                    value={p.number}
                    onChange={e => handlePrincipleChange(idx, "number", Number(e.target.value))}
                    className="w-16"
                  />
                  <Input
                    label="Título"
                    value={p.title}
                    onChange={e => handlePrincipleChange(idx, "title", e.target.value)}
                    className="flex-1"
                  />
                  <Textarea
                    label="Descripción"
                    value={p.description}
                    onChange={e => handlePrincipleChange(idx, "description", e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removePrinciple(idx)} className="mt-6"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={addPrinciple} className="mt-2"><Plus className="w-4 h-4 mr-1" />Agregar principio</Button>
            </div>
            <Textarea
              label="Cierre"
              name="closing"
              value={formData.closing}
              onChange={handleChange}
              rows={2}
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
                    src={formData.featuredImage?.startsWith('/uploads/') ? `/api/image?path=${encodeURIComponent(formData.featuredImage)}` : formData.featuredImage}
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
