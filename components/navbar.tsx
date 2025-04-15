"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-yellow-200 shadow-md py-2" : "bg-yellow-200/90 py-4"}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/isotipo.webp" alt="AMIGDALA Logo" width={50} height={50} className="mr-2" />
            
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#sobre-mi" isScrolled={isScrolled}>
              Sobre Mí
            </NavLink>
            <NavLink href="#servicios" isScrolled={isScrolled}>
              Servicios
            </NavLink>
            <NavLink href="#enfoque" isScrolled={isScrolled}>
              Mi Enfoque
            </NavLink>
            <NavLink href="#experiencia" isScrolled={isScrolled}>
              Experiencia
            </NavLink>
            <NavLink href="#contacto" isScrolled={isScrolled} isButton>
              Contacto
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-yellow-200">
          <nav className="flex flex-col py-4 px-4">
            <MobileNavLink href="#sobre-mi" onClick={() => setIsOpen(false)}>
              Sobre Mí
            </MobileNavLink>
            <MobileNavLink href="#servicios" onClick={() => setIsOpen(false)}>
              Servicios
            </MobileNavLink>
            <MobileNavLink href="#enfoque" onClick={() => setIsOpen(false)}>
              Mi Enfoque
            </MobileNavLink>
            <MobileNavLink href="#experiencia" onClick={() => setIsOpen(false)}>
              Experiencia
            </MobileNavLink>
            <MobileNavLink href="#contacto" onClick={() => setIsOpen(false)}>
              Contacto
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  children,
  isScrolled,
  isButton = false,
}: { href: string; children: React.ReactNode; isScrolled: boolean; isButton?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        transition-colors duration-300 font-medium
        ${
          isButton
            ? 'bg-black text-white hover:text-yellow-200/90 px-4 py-2 rounded-md'
            : 'text-black hover:text-white'
        }
      `}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="py-3 text-black hover:text-white border-b  font-medium"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

