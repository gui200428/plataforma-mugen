import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile, getModules, Module } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import styles from "@/styles/dashboard.module.css";
import courseStyles from "@/styles/course.module.css";

const TOKEN_COOKIE = "token";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  let userName = "Aluno";
  try {
    const profile = await getProfile(token!);
    userName = profile.name;
  } catch {
    console.error("Falha ao buscar perfil do usuário");
  }

  // Fetch real data from API
  let modules: Module[] = [];
  try {
    modules = await getModules(token);
  } catch (err) {
    console.error("Falha ao buscar os módulos", err);
  }

  // Calculate stats from real data
  const totalModules = modules.length;
  const totalLessons = modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);

  return (
    <div className={styles.page}>
      {/* ── Greeting ── */}
      <section className={styles.greeting}>
        <div>
          <h1 className={styles.greetingTitle}>
            Olá, <span className={styles.highlight}>{userName}</span>! 👋
          </h1>
          <p className={styles.greetingSubtitle}>
            Continue sua jornada de aprendizado explorando o conteúdo abaixo.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
          value={totalModules}
          label="Módulos Disponíveis"
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          }
          value={totalLessons}
          label="Total de Aulas"
        />
      </section>

      {/* ── All Modules and Lessons ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Conteúdo do Curso</h2>
          <span className={styles.sectionCount}>{totalModules} módulos · {totalLessons} aulas</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {modules.length === 0 ? (
            <div className={courseStyles.emptyState}>
              <p>Nenhum módulo disponível no momento.</p>
              <p>Quando o conteúdo for adicionado, ele aparecerá aqui.</p>
            </div>
          ) : (
            modules.map((mod) => (
              <div key={mod.id} className={courseStyles.moduleCard}>
                <div className={courseStyles.moduleHeader}>
                  <div className={courseStyles.moduleInfo}>
                    <span className={courseStyles.moduleBadge}>Módulo {mod.position}</span>
                    <h2 className={courseStyles.moduleTitle}>{mod.title}</h2>
                    {mod.description && <p className={courseStyles.moduleDesc}>{mod.description}</p>}
                  </div>
                </div>

                {mod.lessons && mod.lessons.length > 0 ? (
                  <div className={courseStyles.lessonsList}>
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.id} className={courseStyles.lessonItem}>
                        <div className={courseStyles.lessonInfo}>
                          <span className={courseStyles.lessonNum}>{lesson.position}</span>
                          <span className={courseStyles.lessonTitle}>{lesson.title}</span>
                        </div>
                        
                        <Link href={`/aula/${lesson.id}`} className={courseStyles.watchBtn}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Assistir
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={courseStyles.emptyModule}>
                    Nenhuma aula cadastrada neste módulo.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
