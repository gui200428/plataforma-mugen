"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    Cookies.remove("admin_token");
    router.push("/painel/login");
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li>
            <Link
              href="/painel"
              className={`${styles.link} ${pathname === "/painel" ? styles.active : ""}`}
            >
              <span className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </span>
              <span className={styles.label}>Conteúdo</span>
              {pathname === "/painel" && <span className={styles.activeIndicator} />}
            </Link>
          </li>
          <li>
            <Link
              href="/painel/alunos"
              className={`${styles.link} ${pathname === "/painel/alunos" ? styles.active : ""}`}
            >
              <span className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <span className={styles.label}>Alunos</span>
              {pathname === "/painel/alunos" && <span className={styles.activeIndicator} />}
            </Link>
          </li>
          <li>
            <Link
              href="/painel/vendas"
              className={`${styles.link} ${pathname === "/painel/vendas" ? styles.active : ""}`}
            >
              <span className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </span>
              <span className={styles.label}>Vendas</span>
              {pathname === "/painel/vendas" && <span className={styles.activeIndicator} />}
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair do Painel
        </button>
      </div>
    </aside>
  );
}
