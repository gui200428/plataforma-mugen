"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUsers, StudentUser } from "@/lib/api";
import styles from "@/styles/admin.module.css";

export default function AlunosPage() {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("admin_token");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getTimeSince(dateStr: string) {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 30) return `${diffDays} dias atrás`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 mês atrás";
    return `${diffMonths} meses atrás`;
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Alunos Cadastrados</h1>
        </header>
        <p style={{ color: "var(--text-secondary)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Alunos Cadastrados</h1>
        <span style={{
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          background: "var(--bg-elevated)",
          padding: "6px 14px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border)",
        }}>
          {users.length} {users.length === 1 ? "aluno" : "alunos"}
        </span>
      </header>

      {users.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum aluno cadastrado ainda.</p>
          <p style={{ fontSize: "0.875rem", marginTop: "8px" }}>
            Quando os alunos se registrarem, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 var(--space-xs)",
          }}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>E-mail</th>
                <th style={thStyle}>Data de Cadastro</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{
                  background: "var(--bg-secondary)",
                  transition: "background 150ms",
                }}>
                  <td style={tdStyle}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-tertiary)",
                      fontSize: "0.8125rem",
                    }}>
                      {idx + 1}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-full)",
                        background: "var(--accent-gradient)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}>
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>
                    {user.email}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: "0.875rem" }}>{formatDate(user.createdAt)}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                        {getTimeSince(user.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "var(--success-muted)",
                      color: "var(--success)",
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--success)",
                      }} />
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "var(--space-sm) var(--space-md)",
  color: "var(--text-tertiary)",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid var(--border)",
};

const tdStyle: React.CSSProperties = {
  padding: "var(--space-md)",
  fontSize: "0.9375rem",
  color: "var(--text-primary)",
  borderBottom: "1px solid var(--border)",
};
