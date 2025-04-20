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

const initialContactContent = {
  heading: "CONTACTO",
  lines: [
    "¿Listo para iniciar tu proceso de transformación?",
    "Ponte en contacto para agendar una sesión o resolver tus dudas."
  ],
  contactInfo: {
    email: "sol@amigdala.pe",
    phone: "+51 999 999 999",
    linkedin: "https://www.linkedin.com/in/solange-chrem-mesnik-714530170"
  },
  closing: "Te responderé lo antes posible.",
  signature: "Solange Chrem"
};

export default function ContactSectionEditor() {
  const [formData, setFormData] = useState(initialContactContent);

  // Fetch latest contact content from backend on mount
  useEffect(() => {
    fetchContent("contact")
      .then(data => {
        if (data && data.section === "contact") {
          const { _id, section, updatedAt, ...rest } = data;
          setFormData({ ...initialContactContent, ...rest });
        }
      })
      .catch(() => {/* fallback to initialContactContent if error */});
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSaved) setIsSaved(false);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value }
    }));
    if (isSaved) setIsSaved(false);
  };

  const handleLineChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map((l, i) => i === idx ? value : l)
    }));
    if (isSaved) setIsSaved(false);
  };

  const addLine = () => {
    setFormData(prev => ({ ...prev, lines: [...prev.lines, ""] }));
    if (isSaved) setIsSaved(false);
  };

  const removeLine = (idx: number) => {
    setFormData(prev => ({ ...prev, lines: prev.lines.filter((_, i) => i !== idx) }));
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
          section: "contact",
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
            <CardTitle>Editar sección: Contacto</CardTitle>
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
            <div className="mb-4">
              <div className="font-bold mb-2">Líneas introductorias</div>
              {formData.lines.map((line, idx) => (
                <div key={idx} className="flex items-center mb-2 space-x-2">
                  <Input
                    value={line}
                    onChange={e => handleLineChange(idx, e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeLine(idx)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={addLine} className="mt-2"><Plus className="w-4 h-4 mr-1" />Agregar línea</Button>
            </div>
            <div className="mb-4">
              <div className="font-bold mb-2">Información de contacto</div>
              <Input
                label="Correo electrónico"
                name="email"
                value={formData.contactInfo.email}
                onChange={handleContactInfoChange}
                className="mb-2"
              />
              <Input
                label="Teléfono"
                name="phone"
                value={formData.contactInfo.phone}
                onChange={handleContactInfoChange}
                className="mb-2"
              />
              <Input
                label="LinkedIn"
                name="linkedin"
                value={formData.contactInfo.linkedin}
                onChange={handleContactInfoChange}
                className="mb-2"
              />
            </div>
            <Textarea
              label="Cierre"
              name="closing"
              value={formData.closing}
              onChange={handleChange}
              rows={2}
              className="mb-2"
            />
            <Input
              label="Firma"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              className="mb-2"
            />
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
