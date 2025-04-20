"use client";

import { useEffect, useState } from "react";

export default function MediaGallerySection() {
  const [media, setMedia] = useState([]);
  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => setMedia(data))
      .catch(() => setMedia([]));
  }, []);

  if (!media.length) {
    return (
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Galería de Imágenes
          </h2>
          <p className="text-center text-gray-400">No hay imágenes en la biblioteca.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Galería de Imágenes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {media.map((item: any) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={item.path}
                alt={item.name}
                className="object-cover w-full h-48"
              />
              <div className="p-2 text-xs text-gray-500 text-center">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
