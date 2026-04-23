"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.css";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { loginRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { access_token } = await loginRequest(email, password);

      // Store token via API route (httpOnly cookie)
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: access_token }),
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <Logo size="lg" />
        </div>
        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>
          Entre com sua conta para acessar a plataforma
        </p>
      </div>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          minLength={6}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Entrar
        </Button>
      </form>

      <div className={styles.footer}>
        Não tem uma conta?{" "}
        <Link href="/register">Criar conta</Link>
      </div>
    </div>
  );
}
