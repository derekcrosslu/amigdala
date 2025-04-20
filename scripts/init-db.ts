// scripts/init-db.ts
import { getCollections } from '../lib/db/collections';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function initDatabase() {
  console.log('Initializing database...');
  const { content, settings, users } = await getCollections();

  // Check if content collection has data
  const contentCount = await content.countDocuments();
  if (contentCount === 0) {
    console.log('Initializing content collection...');

    // Insert initial content
    await content.insertMany([
      {
        section: 'about',
        heading: 'SOBRE MÍ',
        profileImage: '/sol.webp',
        paragraph1: 'Durante casi 20 años he acompañado a personas...',
        paragraph2: 'Mi recorrido incluye más de 13 años...',
        paragraph3: 'He tenido el privilegio de facilitar sesiones...',
        closingText: 'Ahora, después de acumular lo que siento...',
        quote: 'Para que puedas abrir tu mundo, primero he abierto el mío',
        updatedAt: new Date(),
      },
      {
        section: 'services',
        heading: 'SERVICIOS',
        introduction: 'En AMIGDALA diseño experiencias personalizadas...',
        services: [
          {
            id: '1',
            title: 'Sesiones Individuales',
            description: 'Un espacio íntimo y seguro para explorar...',
            additionalText: 'Ideal para momentos de transición...',
          },
          // Add more services...
        ],
        featuredImage: '/images/workshop-candle.jpeg',
        updatedAt: new Date(),
      },
      // Add more sections...
    ]);
  }

  // Initialize settings if empty
  const settingsCount = await settings.countDocuments();
  if (settingsCount === 0) {
    console.log('Initializing settings collection...');
    await settings.insertOne({
      general: {
        siteName: 'AMIGDALA',
        tagline: 'Arteterapia con Enfoque Humanista',
        email: 'correo@amigdala.org',
        phone: '+51997244742',
        linkedin: 'https://www.linkedin.com/in/solange-chrem-mesnik-714530170',
      },
      seo: {
        metaTitle: 'AMIGDALA | Arteterapia con Enfoque Humanista',
        metaDescription: 'AMIGDALA es una consultora de arteterapia...',
        keywords:
          'arteterapia, terapia, arte, humanista, sesiones, talleres...',
        ogImage: '/isotipo.webp',
      },
      updatedAt: new Date(),
    });
  }

  // Initialize admin user if not exists
  const adminExists = await users.findOne({ username: 'admin' });
  if (!adminExists) {
    console.log('Creating admin user...');
    // Use bcrypt to hash the admin password
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set. Please set it in your .env file.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    await users.insertOne({
      username: 'admin',
      passwordHash,
      role: 'admin',
      createdAt: new Date(),
    });
  }

  console.log('Database initialization complete!');
}

// Run the function
initDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });
