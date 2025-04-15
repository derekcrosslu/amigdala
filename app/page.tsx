import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Home() {
  return (
    <main className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative flex flex-col items-center justify-center py-20 px-4 md:px-6 lg:px-8  min-h-screen'>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/shadow-hands.jpeg')] opacity-10 bg-cover bg-center" />
        <div className='container mx-auto max-w-5xl z-10'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-8 '>
            <div className='w-fit '>
              <Image
                src='/isotipo.webp'
                alt='AMIGDALA Logo'
                width={200}
                height={200}
                className='mx-auto md:mx-0'
              />
            </div>

            <div className='w-fit text-center md:text-left '>
              <div className='w-fit '>
                <Image
                  src='/amigdala.webp'
                  alt='AMIGDALA Logo'
                  width={400}
                  height={300}
                  className='mx-auto md:mx-0'
                />
              </div>

              <h2 className='text-xl md:text-2xl font-medium text-gray-400 mb-2'>
                Acompaño procesos a través de las artes
              </h2>
              <p className='text-lg italic text-gray-500'>por Solange Chrem</p>
            </div>
          </div>
        </div>
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <ChevronDown className='w-8 h-8 text-gray-700' />
        </div>
      </section>

      {/* About Section */}
      <section
        id='sobre-mi'
        className='py-20 px-4 md:px-6 lg:px-8'
      >
        <div className='container mx-auto max-w-6xl'>
          <h2 className='text-3xl md:text-4xl font-bold  mb-12 text-center'>
            SOBRE MÍ
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12'>
            <div>
              <Image
                src='/sol.webp'
                alt='Sesión de terapia de movimiento'
                width={600}
                height={400}
                className='rounded-lg shadow-lg'
              />
            </div>
            <div className='space-y-6 text-gray-700'>
              <p className='text-lg'>
                Durante <strong>casi 20 años</strong> he acompañado a personas
                en su camino de desarrollo personal y profesional a través de
                las artes expresivas, construyendo puentes hacia el
                autoconocimiento y la transformación.
              </p>
              <p className='text-lg'>
                Mi recorrido incluye <strong>más de 13 años</strong> en la
                asociación cultural D1, mi casa y escuela, donde he desarrollado
                metodologías que conectan el arte con el crecimiento humano.
              </p>
              <p className='text-lg'>
                He tenido el privilegio de facilitar sesiones para una
                diversidad de espacios: desde empresas multinacionales hasta
                pequeños emprendimientos, desde docentes de colegios públicos
                hasta estudiantes universitarios, desde artistas consolidados
                hasta personas que apenas descubren su potencial creativo.
              </p>
            </div>
          </div>
          <div className='text-center'>
            <p className='text-lg text-gray-700 mb-6'>
              Ahora, después de acumular lo que siento como "un millón de horas
              de vuelo", estoy lista para expandir horizontes con{' '}
              <strong>AMIGDALA</strong>, mi consultora de arteterapia con
              enfoque humanista.
            </p>
            <p className='text-xl italic  mt-8'>
              "Para que puedas abrir tu mundo, primero he abierto el mío"
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id='servicios'
        className='py-20 px-4 md:px-6 lg:px-8 bg-yellow-50 relative'
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/circle-artwork.jpeg')] opacity-20 bg-cover bg-center" />
        <div className='container mx-auto max-w-6xl relative z-10'>
          <h2 className='text-3xl md:text-4xl font-bold  mb-12 text-center'>
            SERVICIOS
          </h2>
          <p className='text-lg text-center text-gray-700 mb-16 max-w-3xl mx-auto'>
            En AMIGDALA diseño experiencias personalizadas para cada espacio,
            momento y necesidad. Las artes expresivas se convierten en puentes
            hacia descubrimientos profundos y transformaciones significativas.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-semibold  mb-4'>
                Sesiones Individuales
              </h3>
              <p className='text-gray-700'>
                Un espacio íntimo y seguro para explorar tu mundo interior a
                través de diferentes lenguajes artísticos. No se requiere
                experiencia previa en arte, solo apertura para descubrir.
              </p>
              <p className='text-gray-700 mt-4'>
                Ideal para momentos de transición, búsqueda personal o cuando
                necesitas claridad en tu camino.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-semibold  mb-4'>Talleres Grupales</h3>
              <p className='text-gray-700'>
                Experiencias colectivas donde la creatividad compartida potencia
                el desarrollo personal. Grupos reducidos que permiten atención
                personalizada dentro de la dinámica colectiva.
              </p>
              <p className='text-gray-700 mt-4'>
                Perfectos para equipos de trabajo, grupos de amigos o
                comunidades que buscan fortalecer vínculos mientras exploran
                nuevas dimensiones de sí mismos.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-semibold  mb-4'>
                Consultorías Corporativas
              </h3>
              <p className='text-gray-700'>
                Programas diseñados específicamente para organizaciones que
                buscan impulsar la creatividad, mejorar el clima laboral o
                facilitar procesos de cambio utilizando metodologías basadas en
                artes expresivas.
              </p>
              <p className='text-gray-700 mt-4'>
                Adaptables a diferentes duraciones, desde intervenciones
                puntuales hasta procesos de acompañamiento continuado.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-semibold  mb-4'>
                Formación para Educadores
              </h3>
              <p className='text-gray-700'>
                Herramientas prácticas para docentes que desean incorporar las
                artes expresivas como vehículo de aprendizaje y desarrollo en
                sus espacios educativos.
              </p>
              <p className='text-gray-700 mt-4'>
                Basado en años de experiencia trabajando con instituciones
                educativas de diversos contextos.
              </p>
            </div>
          </div>
          <div className='mt-16'>
            <Image
              src='/images/workshop-candle.jpeg'
              alt='Taller de arteterapia con velas'
              width={1200}
              height={600}
              className='rounded-lg shadow-lg mx-auto'
            />
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section
        id='enfoque'
        className='py-20 px-4 md:px-6 lg:px-8'
      >
        <div className='container mx-auto max-w-6xl'>
          <h2 className='text-3xl md:text-4xl font-bold  mb-12 text-center'>
            MI ENFOQUE
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16'>
            <div className='order-2 md:order-1'>
              <p className='text-lg text-gray-700 mb-8'>
                Como arteterapeuta con <strong>enfoque humanista</strong>, creo
                firmemente en el potencial innato de cada persona para su
                auto-realización y crecimiento. Mi trabajo se basa en tres
                principios fundamentales:
              </p>
              <div className='space-y-8'>
                <div className='flex gap-4'>
                  <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl font-bold  shrink-0'>
                    1
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold  mb-2'>
                      El arte como lenguaje universal
                    </h3>
                    <p className='text-gray-700'>
                      Las expresiones artísticas nos permiten comunicar aquello
                      que las palabras no siempre alcanzan a nombrar. A través
                      del color, el movimiento, la forma o el sonido podemos dar
                      voz a nuestras experiencias más profundas.
                    </p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl font-bold  shrink-0'>
                    2
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold  mb-2'>
                      La persona como centro
                    </h3>
                    <p className='text-gray-700'>
                      Cada individuo es único, con su propio ritmo y manera de
                      construir significados. Mi rol es acompañar, no dirigir,
                      creando un espacio seguro donde cada uno pueda explorar su
                      mundo interior con libertad y sin juicios.
                    </p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl font-bold  shrink-0'>
                    3
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold  mb-2'>
                      El proceso sobre el resultado
                    </h3>
                    <p className='text-gray-700'>
                      En arteterapia valoramos el camino creativo más que el
                      producto final. No buscamos crear "obras de arte" según
                      estándares externos, sino facilitar experiencias
                      significativas donde el proceso de creación sea en sí
                      mismo transformador.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='order-1 md:order-2'>
              <Image
                src='/images/group-art-workshop.jpeg'
                alt='Taller grupal de arte'
                width={600}
                height={400}
                className='rounded-lg shadow-lg'
              />
            </div>
          </div>
          <p className='text-lg text-gray-700 text-center max-w-4xl mx-auto'>
            Mi formación multidisciplinaria y los años de experiencia me han
            permitido desarrollar una metodología flexible, capaz de adaptarse a
            diferentes contextos y necesidades, siempre manteniendo como norte
            el bienestar y desarrollo integral de las personas.
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id='experiencia'
        className='py-20 px-4 md:px-6 lg:px-8 bg-yellow-50'
      >
        <div className='container mx-auto max-w-6xl'>
          <h2 className='text-3xl md:text-4xl font-bold  mb-12 text-center'>
            MI EXPERIENCIA
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <Image
                src='/images/circle-artwork.jpeg'
                alt='Círculo de arte terapia'
                width={600}
                height={400}
                className='rounded-lg shadow-lg'
              />
            </div>
            <div className='bg-white p-8 rounded-lg shadow-md'>
              <p className='text-lg text-gray-700 mb-6'>
                He dictado sesiones cortas y larguísimas a empresas gigantes,
                pequeñas, a docentes de colegios públicos, a estudiantes,
                universidades prestigiosas, a artistas, a colectivos, a personas
                de todas las edades y sabores... son tantos los espacios que
                llevo un millón de horas de vuelo.
              </p>
              <p className='text-lg text-gray-700'>
                Tengo una especial sensibilidad con la gente y ya estoy lista
                para atender en mi casa taller de manera individual o grupal
                como arteterapeuta con enfoque humanista.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id='contacto'
        className='py-20 px-4 md:px-6 lg:px-8 relative'
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/shadow-hands.jpeg')] opacity-20 bg-cover bg-center" />
        <div className='container mx-auto max-w-4xl relative z-10'>
          <h2 className='text-3xl md:text-4xl font-bold  mb-12 text-center'>
            CONTÁCTAME
          </h2>
          <div className='text-center space-y-6 text-gray-700'>
            <p className='text-xl'>
              ¡Es hora de abrirme al mundo! -para que puedas abrir el tuyo-
            </p>
            <p className='text-lg'>
              Diseñaré experiencias para cada espacio, momento y lugar, con
              tarifas que dependerán de lo que se desee explorar.
            </p>
            <p className='text-lg'>
              Sólo escríbeme al interno mientras construyo la web.
              <br />
              (¿Sabes qué significa web? Malla, red, entramado: esa ya la tengo
              hace tieeeempo 😊)
            </p>
            <div className='mt-12 p-8 bg-white rounded-lg inline-block mx-auto shadow-md'>
              <h3 className='text-xl font-semibold  mb-4'>
                Información de contacto:
              </h3>
              <ul className='space-y-2'>
                <li>
                  <strong>Correo:</strong>{' '}
                  <a
                    href='mailto:correo@amigdala.org'
                    className=' hover:underline'
                  >
                    correo@amigdala.org
                  </a>
                </li>
                <li>
                  <strong>Teléfono:</strong>{' '}
                  <a
                    href='tel:+51997244742'
                    className='hover:underline'
                  >
                    +51997244742
                  </a>
                </li>
                <li>
                  <strong>LinkedIn:</strong>{' '}
                  <a
                    href='https://www.linkedin.com/in/solange-chrem-mesnik-714530170'
                    className=' hover:underline'
                  >
                    Perfil LinkedIn de Sol
                  </a>
                </li>
              </ul>
            </div>
            <p className='text-lg mt-12 italic'>
              Gracias por compartir y por confiar en mí, que de eso estoy MUY
              segura.
            </p>
            <p className='font-medium '>Sol</p>
          </div>
        </div>
      </section>
    </main>
  );
}
