import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AdminSidebar from "@/components/AdminSidebar";

const ADMIN_TOKEN_COOKIE = "admin_token";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!adminToken) {
    redirect("/painel/login");
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header userName="Administrador" userEmail="admin@mugen.com" />
      <div style={{ display: 'flex' }}>
        <AdminSidebar />
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', height: 'calc(100vh - var(--header-height))' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
