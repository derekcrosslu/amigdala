"use client";

import Link from "next/link";
import { 
  FileText, 
  Image, 
  Settings, 
  Edit, 
  Upload,
  Users
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 mt-24 py-10">
        <h1 className="text-3xl font-bold mb-2">AMIGDALA Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Manage your website content, media, and settings here.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content Management Card */}
        <DashboardCard 
          href="/admin/content"
          icon={<FileText className="h-8 w-8 text-yellow-500" />}
          title="Content Management"
          description="Edit website sections like About, Services, Experience, and Contact information."
        />
        
        {/* Media Library Card */}
        <DashboardCard 
          href="/admin/media"
          icon={<Image className="h-8 w-8 text-yellow-500" />}
          title="Media Library"
          description="Upload and manage images and other media files used on your website."
        />
        
        {/* Settings Card */}
        <DashboardCard 
          href="/admin/settings"
          icon={<Settings className="h-8 w-8 text-yellow-500" />}
          title="Settings"
          description="Configure website settings, SEO information, and other global options."
        />
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard 
            href="/admin/content/sections/about"
            icon={<Edit className="h-5 w-5" />}
            title="Edit About Section"
          />
          <QuickActionCard 
            href="/admin/content/sections/services"
            icon={<Edit className="h-5 w-5" />}
            title="Edit Services"
          />
          <QuickActionCard 
            href="/admin/media"
            icon={<Upload className="h-5 w-5" />}
            title="Upload Media"
          />
          <QuickActionCard 
            href="/admin/content/sections/contact"
            icon={<Edit className="h-5 w-5" />}
            title="Update Contact Info"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ 
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
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-center mb-4">
          {icon}
          <h2 className="text-xl font-semibold ml-3">{title}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function QuickActionCard({ 
  href, 
  icon, 
  title 
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center">
          <div className="mr-3 bg-yellow-100 p-2 rounded-md">
            {icon}
          </div>
          <p className="font-medium">{title}</p>
        </div>
      </div>
    </Link>
  );
}
