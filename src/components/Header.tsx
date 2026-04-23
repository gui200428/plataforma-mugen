"use client";

import { useRouter } from "next/navigation";
import Logo from "./Logo";
import styles from "./Header.module.css";

interface HeaderProps {
  userName: string;
  userEmail: string;
}

export default function Header({ userName, userEmail }: HeaderProps) {
  const router = useRouter();

  const initials = userName
    .substring(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo size="sm" />
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span>{initials}</span>
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userEmail}>{userEmail}</span>
          </div>
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Sair"
            aria-label="Sair da conta"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
