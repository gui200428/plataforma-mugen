import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import StatsCard from "@/components/StatsCard";
import styles from "@/styles/dashboard.module.css";

const TOKEN_COOKIE = "token";

// Mock data for courses (backend doesn't have Course model yet)
const mockCourses = [
  {
    id: 1,
    title: "React Avançado: Patterns e Performance",
    instructor: "Prof. Ana Silva",
    progress: 68,
    totalLessons: 42,
    completedLessons: 29,
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Frontend",
  },
  {
    id: 2,
    title: "Node.js & NestJS: APIs Escaláveis",
    instructor: "Prof. Carlos Santos",
    progress: 35,
    totalLessons: 38,
    completedLessons: 13,
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "Backend",
  },
  {
    id: 3,
    title: "PostgreSQL: Do Básico ao Avançado",
    instructor: "Prof. Maria Costa",
    progress: 92,
    totalLessons: 25,
    completedLessons: 23,
    thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "Database",
  },
  {
    id: 4,
    title: "TypeScript Masterclass",
    instructor: "Prof. João Lima",
    progress: 15,
    totalLessons: 30,
    completedLessons: 5,
    thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    category: "Linguagens",
  },
  {
    id: 5,
    title: "Docker & Kubernetes na Prática",
    instructor: "Prof. Pedro Alves",
    progress: 50,
    totalLessons: 20,
    completedLessons: 10,
    thumbnail: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "DevOps",
  },
  {
    id: 6,
    title: "UI/UX Design para Desenvolvedores",
    instructor: "Prof. Luana Reis",
    progress: 0,
    totalLessons: 18,
    completedLessons: 0,
    thumbnail: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    category: "Design",
  },
];

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
    // Se falhar, usa o valor padrão — o middleware já cuida da autenticação
    console.error("Falha ao buscar perfil do usuário");
  }

  // Calculate stats from mock data
  const totalCourses = mockCourses.length;
  const coursesInProgress = mockCourses.filter(c => c.progress > 0 && c.progress < 100).length;
  const completedCourses = mockCourses.filter(c => c.progress === 100).length;
  const totalHours = Math.round(mockCourses.reduce((acc, c) => acc + (c.completedLessons * 0.5), 0));

  // Course to continue (highest progress that's not complete)
  const continueFrom = mockCourses
    .filter(c => c.progress > 0 && c.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0];

  return (
    <div className={styles.page}>
      {/* ── Greeting ── */}
      <section className={styles.greeting}>
        <div>
          <h1 className={styles.greetingTitle}>
            Olá, <span className={styles.highlight}>{userName}</span>! 👋
          </h1>
          <p className={styles.greetingSubtitle}>
            Continue sua jornada de aprendizado. Você está indo muito bem!
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsGrid}>
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
          value={totalCourses}
          label="Cursos Matriculados"
          trend="+2 este mês"
          trendUp={true}
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          value={`${totalHours}h`}
          label="Horas Estudadas"
          trend="+8h esta semana"
          trendUp={true}
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          }
          value={coursesInProgress}
          label="Em Progresso"
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          }
          value={completedCourses}
          label="Certificados"
        />
      </section>

      {/* ── Continue Watching ── */}
      {continueFrom && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Continue de onde parou</h2>
          </div>
          <div className={styles.continueCard}>
            <div
              className={styles.continueThumbnail}
              style={{ background: continueFrom.thumbnail }}
            />
            <div className={styles.continueInfo}>
              <span className={styles.continueCategory}>{continueFrom.category}</span>
              <h3 className={styles.continueTitle}>{continueFrom.title}</h3>
              <p className={styles.continueInstructor}>{continueFrom.instructor}</p>
              <div className={styles.continueProgress}>
                <div className={styles.continueProgressBar}>
                  <div
                    className={styles.continueProgressFill}
                    style={{ width: `${continueFrom.progress}%` }}
                  />
                </div>
                <span className={styles.continueProgressText}>
                  {continueFrom.progress}% concluído
                </span>
              </div>
            </div>
            <button className={styles.continueBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Continuar
            </button>
          </div>
        </section>
      )}

      {/* ── All Courses ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meus Cursos</h2>
          <span className={styles.sectionCount}>{totalCourses} cursos</span>
        </div>
        <div className={styles.coursesGrid}>
          {mockCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
