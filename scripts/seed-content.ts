import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'amigdala';

const content = [
  {
    section: 'about',
    heading: 'SOBRE MÍ',
    profileImage: '/sol.webp',
    paragraph1:
      'Durante <b>casi 20 años</b> he acompañado a personas en su camino de desarrollo personal y profesional a través de las artes expresivas, construyendo puentes hacia el autoconocimiento y la transformación.',
    paragraph2:
      'Mi recorrido incluye <b>más de 13 años</b> en la asociación cultural D1, mi casa y escuela, donde he desarrollado metodologías que conectan el arte con el crecimiento humano.',
    paragraph3:
      'He tenido el privilegio de facilitar sesiones para una diversidad de espacios: desde empresas multinacionales hasta pequeños emprendimientos, desde docentes de colegios públicos hasta estudiantes universitarios, desde artistas consolidados hasta personas que apenas descubren su potencial creativo.',
    closingText:
      'Ahora, después de acumular lo que siento como "un millón de horas de vuelo", estoy lista para expandir horizontes con <b>AMIGDALA</b>, mi consultora de arteterapia con enfoque humanista.',
    quote:
      'Para que puedas abrir tu mundo, primero he abierto el mío',
    updatedAt: new Date(),
  },
  {
    section: 'services',
    heading: 'SERVICIOS',
    introduction:
      'En AMIGDALA diseño experiencias personalizadas para cada espacio, momento y necesidad. Las artes expresivas se convierten en puentes hacia descubrimientos profundos y transformaciones significativas.',
    featuredImage: '/images/workshop-candle.jpeg',
    services: [
      {
        id: '1',
        title: 'Sesiones Individuales',
        description:
          'Un espacio íntimo y seguro para explorar tu mundo interior a través de diferentes lenguajes artísticos. No se requiere experiencia previa en arte, solo apertura para descubrir.',
        additionalText:
          'Ideal para momentos de transición, búsqueda personal o cuando necesitas claridad en tu camino.',
      },
      {
        id: '2',
        title: 'Talleres Grupales',
        description:
          'Experiencias colectivas donde la creatividad compartida potencia el desarrollo personal. Grupos reducidos que permiten atención personalizada dentro de la dinámica colectiva.',
        additionalText:
          'Perfectos para equipos de trabajo, grupos de amigos o comunidades que buscan fortalecer vínculos mientras exploran nuevas dimensiones de sí mismos.',
      },
      {
        id: '3',
        title: 'Consultorías Corporativas',
        description:
          'Programas diseñados específicamente para organizaciones que buscan impulsar la creatividad, mejorar el clima laboral o facilitar procesos de cambio utilizando metodologías basadas en artes expresivas.',
        additionalText:
          'Adaptables a diferentes duraciones, desde intervenciones puntuales hasta procesos de acompañamiento continuado.',
      },
      {
        id: '4',
        title: 'Formación para Educadores',
        description:
          'Herramientas prácticas para docentes que desean incorporar las artes expresivas como vehículo de aprendizaje y desarrollo en sus espacios educativos.',
        additionalText:
          'Basado en años de experiencia trabajando con instituciones educativas de diversos contextos.',
      },
    ],
    updatedAt: new Date(),
  },
  {
    section: 'experience',
    heading: 'MI EXPERIENCIA',
    image: '/images/circle-artwork.jpeg',
    leftText: 'Círculo de arte terapia',
    rightText:
      'He dictado sesiones cortas y larguísimas a empresas gigantes, pequeñas, a docentes de colegios públicos, a estudiantes, universidades prestigiosas, a artistas, a colectivos, a personas de todas las edades y sabores... son tantos los espacios que llevo un millón de horas de vuelo.\n\nTengo una especial sensibilidad con la gente y ya estoy lista para atender en mi casa taller de manera individual o grupal como arteterapeuta con enfoque humanista.',
    updatedAt: new Date(),
  },
  {
    section: 'approach',
    heading: 'MI ENFOQUE',
    intro:
      'Como arteterapeuta con <b>enfoque humanista</b>, creo firmemente en el potencial innato de cada persona para su auto-realización y crecimiento. Mi trabajo se basa en tres principios fundamentales:',
    principles: [
      {
        number: 1,
        title: 'El arte como lenguaje universal',
        description:
          'Las expresiones artísticas nos permiten comunicar aquello que las palabras no siempre alcanzan a nombrar. A través del color, el movimiento, la forma o el sonido podemos dar voz a nuestras experiencias más profundas.',
      },
      {
        number: 2,
        title: 'La persona como centro',
        description:
          'Cada individuo es único, con su propio ritmo y manera de construir significados. Mi rol es acompañar, no dirigir, creando un espacio seguro donde cada uno pueda explorar su mundo interior con libertad y sin juicios.',
      },
      {
        number: 3,
        title: 'El proceso sobre el resultado',
        description:
          'En arteterapia valoramos el camino creativo más que el producto final. No buscamos crear "obras de arte" según estándares externos, sino facilitar experiencias significativas donde el proceso de creación sea en sí mismo transformador.',
      },
    ],
    closing:
      'Mi formación multidisciplinaria y los años de experiencia me han permitido desarrollar una metodología flexible, capaz de adaptarse a diferentes contextos y necesidades, siempre manteniendo como norte el bienestar y desarrollo integral de las personas.',
    updatedAt: new Date(),
  },
  {
    section: 'contact',
    heading: 'CONTÁCTAME',
    lines: [
      '¡Es hora de abrirme al mundo! -para que puedas abrir el tuyo-',
      'Diseñaré experiencias para cada espacio, momento y lugar, con tarifas que dependerán de lo que se desee explorar.',
      'Sólo escríbeme al interno mientras construyo la web.',
      '¿Sabes qué significa web? Malla, red, entramado: esa ya la tengo hace tieeeempo 😊',
    ],
    contactInfo: {
      email: 'correo@amigdala.org',
      phone: '+51997244742',
      linkedin: 'Perfil LinkedIn de Sol',
    },
    closing:
      'Gracias por compartir y por confiar en mí, que de eso estoy MUY segura.',
    signature: 'Sol',
    updatedAt: new Date(),
  },
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('content');
    await collection.deleteMany({});
    await collection.insertMany(content);
    console.log('Seeded content successfully!');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
