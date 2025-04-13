import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className='bg-yellow-300 text-black py-12 px-4 md:px-6 lg:px-8'>
      <div className='container mx-auto max-w-6xl'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <div className='flex items-center mb-4'>
              <Image
                src='/isotipo.webp'
                alt='AMIGDALA Logo'
                width={60}
                height={60}
                className='mr-2 rounded-full p-1'
              />
              <Image
                src='/amigdala.webp'
                alt='AMIGDALA Logo'
                width={200}
                height={60}
                className='mr-2 rounded-full p-1'
              />
        
            </div>
            <p className=''>
              Acompaño procesos a través de las artes por Solange Chrem
              <br />
            </p>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-4'>Enlaces Rápidos</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#sobre-mi'
                  className='hover:underline'
                >
                  Sobre Mí
                </Link>
              </li>
              <li>
                <Link
                  href='#servicios'
                  className='hover:underline'
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href='#enfoque'
                  className='hover:underline'
                >
                  Mi Enfoque
                </Link>
              </li>
              <li>
                <Link
                  href='#experiencia'
                  className='hover:underline'
                >
                  Experiencia
                </Link>
              </li>
              <li>
                <Link
                  href='#contacto'
                  className='hover:underline'
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-4'>Contacto</h4>
            <ul className='space-y-2'>
              <li className='flex items-center'>
                <Mail className='w-5 h-5 mr-2' />
                <a
                  href='mailto:correo@amigdala.pe'
                  className='hover:underline'
                >
                  correo@amigdala.pe
                </a>
              </li>
              <li className='flex items-center'>
                <Phone className='w-5 h-5 mr-2' />
                <a
                  href='tel:+51XXXXXXXXX'
                  className='hover:underline'
                >
                  +51 XXX XXX XXX
                </a>
              </li>
              <li className='flex items-center'>
                <Linkedin className='w-5 h-5 mr-2' />
                <a
                  href='#'
                  className='hover:underline'
                >
                  Perfil LinkedIn de Sol
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-yellow-500 mt-8 pt-8 text-center text-yellow-100'>
          <p>
            &copy; {new Date().getFullYear()} AMIGDALA. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

