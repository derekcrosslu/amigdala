import React from "react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

/**
 * Basic Dialog component. Replace with your preferred UI library or extend as needed.
 */
export const Dialog: React.FC<DialogProps> = ({ open, onClose, children, variant = "primary" }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          minHeight: 120,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
        <button
          style={{ marginTop: 16 }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
