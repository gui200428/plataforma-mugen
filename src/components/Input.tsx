"use client";

import { InputHTMLAttributes, useState } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  type = "text",
  id,
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`${styles.wrapper} ${error ? styles.hasError : ""} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={`${styles.input} ${icon ? styles.hasIcon : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
