"use client";

import Link from "next/link";
import { 
  FileText, 
  Users, 
  BookOpen,
  Award,
  PhoneCall,
  ChevronRight 
} from "lucide-react";

export default function ContentManagement() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 pt-20 ">Content Management</h1>
        <p className="text-gray-600">
          Edit the content for different sections of your website.
        </p>
      </div>
      
      <div className="space-y-4 gap-0 flex flex-col">
        <ContentSectionCard 
          href="/admin/content/sections/about"
          icon={<Users className="h-6 w-6 text-yellow-600" />}
          title="About Section"
          description="Edit the 'Sobre Mí' section including text and profile information."
        />
        
        <ContentSectionCard 
          href="/admin/content/sections/services"
          icon={<FileText className="h-6 w-6 text-yellow-600" />}
          title="Services Section"
          description="Manage the services you offer including descriptions and features."
        />
        
        <ContentSectionCard 
          href="/admin/content/sections/approach"
          icon={<BookOpen className="h-6 w-6 text-yellow-600" />}
          title="Approach Section"
          description="Edit the 'Mi Enfoque' section explaining your methodology and principles."
        />
        
        <ContentSectionCard 
          href="/admin/content/sections/experience"
          icon={<Award className="h-6 w-6 text-yellow-600" />}
          title="Experience Section"
          description="Update your experience and qualifications information."
        />
        
        <ContentSectionCard 
          href="/admin/content/sections/contact"
          icon={<PhoneCall className="h-6 w-6 text-yellow-600" />}
          title="Contact Section"
          description="Edit contact information and details displayed on the website."
        />
      </div>
    </div>
  );
}

function ContentSectionCard({ 
  href, 
  icon, 
  title, 
  description 
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 bg-yellow-100 p-3 rounded-full ">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">{title}</h2>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
