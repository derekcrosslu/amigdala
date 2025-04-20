/**
 * API utility functions for interacting with the backend
 */

// Content management functions
export async function fetchContent(section?: string) {
  const url = section 
    ? `/api/content?section=${section}` 
    : '/api/content';
    
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`);
  }
  
  return response.json();
}

export async function updateContent(section: string, content: any) {
  const response = await fetch('/api/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ section, content }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update content: ${response.statusText}`);
  }
  
  return response.json();
}

// Media management functions
export async function fetchMediaLibrary() {
  const response = await fetch('/api/media');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getMediaItem(id: string) {
  const response = await fetch(`/api/media/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch media item: ${response.statusText}`);
  }
  
  return response.json();
}

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/media', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to upload media: ${response.statusText}`);
  }
  
  return response.json();
}

export async function deleteMedia(id: string) {
  const response = await fetch(`/api/media/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete media: ${response.statusText}`);
  }
  
  return response.json();
}

// Section-specific helper functions
export async function fetchAboutContent() {
  return fetchContent('about');
}

export async function updateAboutContent(content: any) {
  return updateContent('about', content);
}

export async function fetchServicesContent() {
  return fetchContent('services');
}

export async function updateServicesContent(content: any) {
  return updateContent('services', content);
}

// Add similar functions for other sections
