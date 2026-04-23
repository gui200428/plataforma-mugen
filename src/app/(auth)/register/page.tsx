"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.css";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { registerRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { access_token } = await registerRequest(name, email, password);

      // Store token via API route (httpOnly cookie)
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: access_token }),
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || "Erro ao criar conta. Tente novamente.");
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
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>
          Comece sua jornada de aprendizado agora
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
          label="Nome Completo"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />

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
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <Input
          label="Confirmar Senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          }
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Criar Conta
        </Button>
      </form>

      <div className={styles.footer}>
        Já tem uma conta?{" "}
        <Link href="/login">Fazer login</Link>
      </div>
    </div>
  );
}
