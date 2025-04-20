"use client";

import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  const id = props.id || Math.random().toString(36).substr(2, 9);
  
  const textareaClasses = `
    block w-full px-4 py-2 text-gray-900 bg-white border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
    ${error ? "border-red-500" : "border-gray-300"}
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={id}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
