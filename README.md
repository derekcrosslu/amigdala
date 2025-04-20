# AMIGDALA Website

This is a [Next.js](https://nextjs.org) project for AMIGDALA, an art therapy consultancy by Solange Chrem.

## Features

- Responsive design optimized for all devices
- Modern UI with Tailwind CSS
- Admin panel for content management
- API routes for backend functionality

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Panel

The website includes a complete admin panel for managing content. To access it:

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with the following credentials:
   - Username: `admin`
   - Password: `password`

### Admin Features

- **Content Management**: Edit website sections like About, Services, etc.
- **Media Library**: Upload and manage images and other media files
- **Settings**: Configure website settings, SEO information, etc.

### Admin Implementation

The admin panel is built using:

- React for the UI components
- Next.js App Router for routing
- Custom form components with validation
- API routes for data persistence

## Project Structure

- `/app`: Main website pages and API routes
- `/app/admin`: Admin panel pages
- `/components`: Reusable UI components
- `/components/ui`: Basic UI components like buttons, inputs, etc.
- `/components/admin`: Admin-specific components
- `/lib`: Utility functions and API helpers
- `/public`: Static assets like images

## Customization

The website is fully customizable through the admin panel. You can modify:

- All text content for each section
- Images and media
- Contact information
- SEO settings
- Visual appearance settings

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) or any other hosting service that supports Next.js applications.

## License

This project is private and intended for AMIGDALA's use only.
