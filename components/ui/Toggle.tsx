"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-300
            ${checked ? "bg-primary" : "bg-muted"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2
          `}
        />
        <div
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full
            transition-transform duration-300 shadow-sm
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </div>
      {label && (
        <span className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}>
          {label}
        </span>
      )}
    </label>
  );
}
