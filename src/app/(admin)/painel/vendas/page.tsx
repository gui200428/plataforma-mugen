"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getSales, Sale } from "@/lib/api";
import styles from "@/styles/admin.module.css";

export default function VendasPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("admin_token");

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getSales(token);
      setSales(data);
    } catch (err) {
      console.error("Failed to fetch sales", err);
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

  function renderStatusBadge(status: string) {
    let bg = "var(--bg-elevated)";
    let color = "var(--text-secondary)";
    let dotColor = "var(--text-tertiary)";
    let label = status;

    if (status === "APPROVED") {
      bg = "var(--success-muted)";
      color = "var(--success)";
      dotColor = "var(--success)";
      label = "Aprovado";
    } else if (status === "REFUNDED") {
      bg = "var(--error-muted)";
      color = "var(--error)";
      dotColor = "var(--error)";
      label = "Reembolsado";
    } else if (status === "CANCELED") {
      bg = "rgba(245, 158, 11, 0.15)";
      color = "#f59e0b";
      dotColor = "#f59e0b";
      label = "Cancelado";
    }

    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: "var(--radius-full)",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: bg,
        color: color,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor }} />
        {label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Vendas (Hotmart)</h1>
        </header>
        <p style={{ color: "var(--text-secondary)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vendas (Hotmart)</h1>
        <span style={{
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          background: "var(--bg-elevated)",
          padding: "6px 14px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border)",
        }}>
          {sales.length} {sales.length === 1 ? "venda" : "vendas"}
        </span>
      </header>

      {sales.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma venda registrada ainda.</p>
          <p style={{ fontSize: "0.875rem", marginTop: "8px" }}>
            As transações da Hotmart aparecerão aqui automaticamente.
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
                <th style={thStyle}>Transação</th>
                <th style={thStyle}>Comprador</th>
                <th style={thStyle}>Produto</th>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} style={{
                  background: "var(--bg-secondary)",
                  transition: "background 150ms",
                }}>
                  <td style={tdStyle}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}>
                      {sale.transaction}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
                        {sale.buyerName}
                      </span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
                        {sale.buyerEmail}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>
                    {sale.productName}
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      ID: {sale.productId}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      {formatDate(sale.createdAt)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {renderStatusBadge(sale.status)}
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
  borderBottom: "1px solid var(--border)",
};
