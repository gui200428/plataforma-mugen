import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getProfile } from "@/lib/api";
import styles from "@/styles/dashboard.module.css";

const TOKEN_COOKIE = "token";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  let userEmail = "usuário";
  let userName = "Aluno";

  try {
    const profile = await getProfile(token);
    userEmail = profile.email;
    userName = profile.name;
  } catch {
    // If token is invalid, redirect to login
    redirect("/login");
  }

  return (
    <div className={styles.layout}>
      <Header userName={userName} userEmail={userEmail} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
