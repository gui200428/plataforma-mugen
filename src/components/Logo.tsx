import styles from "./Logo.module.css";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  return (
    <div className={`${styles.logo} ${styles[size]}`}>
      <div className={styles.icon}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
          <path
            d="M10 22V12l6 4.5L22 12v10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 12l6-4 6 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={styles.text}>APV</span>
    </div>
  );
}
