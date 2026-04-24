import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLesson } from "@/lib/api";
import styles from "@/styles/dashboard.module.css";
import Button from "@/components/Button";

const TOKEN_COOKIE = "token";

function getEmbedUrl(url: string) {
  if (!url) return "";
  
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // Fallback (if it's already an embed link or something else)
  return url;
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  const { id } = await params;

  let lesson;
  try {
    lesson = await getLesson(token, parseInt(id, 10));
  } catch (err) {
    console.error("Falha ao buscar a aula", err);
    return (
      <div className={styles.page}>
        <h2>Aula não encontrada.</h2>
        <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "underline" }}>Voltar ao Dashboard</Link>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className={styles.page}>
        <h2>Aula não encontrada.</h2>
        <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "underline" }}>Voltar ao Dashboard</Link>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className={styles.page} style={{ padding: '0', height: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar for Navigation */}
      <div style={{ padding: 'var(--space-md) var(--space-xl)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Link href="/dashboard">
          <Button size="sm" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar
          </Button>
        </Link>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          {lesson.position} - {lesson.title}
        </h1>
      </div>

      {/* Video Player Area */}
      <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <iframe
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none', maxWidth: '1200px' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
