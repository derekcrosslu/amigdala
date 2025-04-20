"use client";

import { useEffect, useState } from "react";

// Example: Fetches and displays dynamic structured content from /api/content
export default function DynamicTextSection() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch content");
        return res.json();
      })
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-gray-400">Cargando contenido dinámico...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <section className='min-h-screen bg-white w-full  z-10 relative py-40 md:py-40 lg:py-40' id='sobre-mi'>
      <div className=" w-full">
        {content
  .slice()
  .sort((a, b) => {
    const SECTION_ORDER = ["about", "services", "approach", "experience", "contact"];
    return SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section);
  })
  .map((section) => {
          if (section.section === "about") {
                  return (
                    <div key={section._id} className="bg-white rounded-xl  px-4 flex flex-col  w-full container mx-auto">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-wide" style={{letterSpacing: '0.02em'}}>
                        {section.heading}
                      </h2>
                      <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center">
                        {section.profileImage && (
                          <img
                            src={section.profileImage}
                            alt="Profile"
                            className="w-[600px]  object-cover rounded-xl shadow-md  md:mb-0"
                          />
                        )}
                        <div className="flex-1 w-full md:w-4/5">
                          {section.paragraph1 && (
                              <p
                                className="mb-6 font-mono text-[18px] leading-relaxed text-gray-900 whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                  __html: section.paragraph1.replace(/(casi 20 años|autoconocimiento|transformación)/gi, (match: string) => `<b>${match}</b>`)
                                }}
                              />
                            )}
                          {section.paragraph2 && (
                              <p
                                className="mb-6 font-mono text-[18px] leading-relaxed text-gray-900 whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                  __html: section.paragraph2.replace(/(más de 13 años|crecimiento humano)/gi, (match: string) => `<b>${match}</b>`)
                                }}
                              />
                            )}
                          {section.paragraph3 && (
                            <p className="mb-6 font-mono text-[18px] leading-relaxed text-gray-900 whitespace-pre-line">
                              {section.paragraph3}
                            </p>
                          )}
                        </div>
                      </div>
                      {section.closingText && (
                        <p
                          className="mt-10 mb-3 font-mono text-center text-[18px] text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: section.closingText.replace(/AMIGDALA/gi, (match: string) => `<b>${match}</b>`)
                          }}
                        />
                      )}
                      {section.quote && (
                        <blockquote className="text-center text-lg md:text-xl italic mt-2 mb-40">
                          <span className="">“{section.quote}”</span>
                        </blockquote>
                      )}
                    </div>
                  );
                }
          if (section.section === "services") {
                  return (
                    <section key={section._id} className="py-40 bg-yellow-50 w-full relative" id="servicios">
                    
                      <div className='container mx-auto  px-4 md:px-6 lg:px-8  relative z-10 max-w-7xl'>
                      <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide" style={{letterSpacing: '0.02em'}}>
                          {section.heading}
                        </h2>
                        {section.introduction && (
                          <p className="text-center font-mono text-base md:text-lg text-gray-800 mb-10 max-w-5xl mx-auto">
                            {section.introduction}
                          </p>
                        )}
                        {section.services && Array.isArray(section.services) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {section.services.map((service: any) => (
                              <div key={service.id} className="bg-white rounded-xl shadow p-6 flex flex-col h-full">
                                <h3 className="text-lg font-bold font-mono mb-3 text-gray-900">
                                  {service.title}
                                </h3>
                                <p className="font-mono text-[15px] text-gray-800 whitespace-pre-line mb-2">
                                  {service.description}
                                </p>
                                {service.additionalText && (
                                  <p className="font-mono text-[15px] text-gray-700 whitespace-pre-line mt-2">
                                    {service.additionalText}
                                  </p>
                                )}                         
                              </div>
                            ))}                     
                          </div>
                        )}
                        {section.featuredImage && (
                          <div className="flex justify-center pt-12  min-w-full ">
                            <img
                              src={section.featuredImage}
                              alt="Featured Service"
                              className="w-full max-h-60 object-cover rounded-lg shadow-lg"
                            />
                          </div>
                        )}
                      </div>
                    </section>
                  );
                }
          if (section.section === "approach") {
                  return (
                    <section key={section._id} id="enfoque" className="py-40">
                      <div className="container mx-auto max-w-6xl  px-4 md:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide" style={{letterSpacing: '0.02em'}}>
                          {section.heading}
                        </h2>
                        {section.intro && (
                          <p className="text-center font-mono text-base md:text-lg text-gray-800 mb-10 max-w-3xl mx-auto"
                            dangerouslySetInnerHTML={{ __html: section.intro }} />
                        )}
                        {section.principles && Array.isArray(section.principles) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                            <div className="space-y-6">
                              {section.principles.map((p: any, idx: number) => (
                                <div key={p.number} className="flex items-start">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-lg mr-4">
                                    {p.number}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[19px] text-gray-900 mb-1">{p.title}</div>
                                    <div className="font-mono  text-gray-800 whitespace-pre-line">{p.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          
                            {section.featuredImage && (
                              <img
                                src={section.featuredImage}
                                alt="Featured Service"
                                className="rounded-lg shadow-lg max-h-[500px] object-cover"
                                width={600}
                                height={400}
                              />
                            )}
                  
                          </div>
                        )}
                        {section.closing && (
                          <p className="mt-10 text-center font-mono text-base md:text-lg text-gray-800 max-w-3xl mx-auto">
                            {section.closing}
                          </p>
                        )}
                      </div>
                    </section>
                  );
                }
          if (section.section === "experience") {
                  return (
                    <section key={section._id} id="experiencia" className="bg-yellow-50 py-40">
                      <div className='container mx-auto max-w-6xl   px-4 md:px-4'>
                        <h2 className="text-4xl font-extrabold text-center mb-12 tracking-wide" style={{letterSpacing: '0.02em'}}>
                          {section.heading}
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:items-top items-center'>
                          <div>
                          {section.featuredImage && (
                                <img
                                  src={section.featuredImage}
                                  alt="Featured Service"
                                  width={600}
                                  height={400}
                                  className="rounded-lg shadow-lg max-h-[400px] object-cover"
                                />
                              )}
                                  </div>
                                  <div className='bg-white p-8 rounded-lg shadow-md'>
                                    <p className='text-lg text-gray-700 mb-6'>
                                      {section.leftText}
                                    </p>
                                    <p className='text-lg text-gray-700'>
                                    {section.rightText}
                                    </p>
                                  </div>
                                </div>
                              </div>
                    </section>
                  );
                }
          if (section.section === "contact") {
                  return (
                    <section
                    id='contacto'
                    className='w-full relative py-40'
                    key={section._id}
                  >
                    <div  id="contacto" className=" w-full h-full bg-[url('/images/shadow-hands.jpeg')] opacity-20 bg-cover bg-center" />
                      <div className="container mx-auto max-w-4xl flex flex-col items-center  px-4 md:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide">
                          {section.heading}
                        </h2>
                        {section.lines && Array.isArray(section.lines) && section.lines.map((line: string, idx: number) => (
                          <p key={idx} className="font-mono text-base md:text-lg text-gray-800 text-center mb-2">
                            {line}
                          </p>
                        ))}
                        {section.contactInfo && (
                          <div className="bg-white rounded-xl shadow p-8 mt-8 mb-8 max-w-md mx-auto">
                            <h3 className="text-xl font-bold text-center mb-4">Información de contacto:</h3>
                            <div className="font-mono text-[15px] text-gray-900">
                              <div><b>Correo:</b> {section.contactInfo.email}</div>
                              <div><b>Teléfono:</b> {section.contactInfo.phone}</div>
                              <div><b>LinkedIn:</b> <a href={section.contactInfo.linkedin} target="_blank" rel="noopener noreferrer">Enlace</a></div>
                            </div>
                          </div>
                        )}
                        {section.closing && (
                          <p className="text-center italic font-mono text-base md:text-lg text-gray-700 mt-8 mb-2">
                            {section.closing}
                          </p>
                        )}
                        {section.signature && (
                          <p className="text-center font-mono text-base text-gray-800 mt-2">{section.signature}</p>
                        )}
                      </div>
                    </section>
                  );
          }
          // fallback for unknown section types
          return null;
        })}
      </div>
    </section>
  );
}

