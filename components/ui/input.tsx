"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  const id = props.id || Math.random().toString(36).substr(2, 9);
  
  const inputClasses = `
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
      
      <input
        id={id}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
