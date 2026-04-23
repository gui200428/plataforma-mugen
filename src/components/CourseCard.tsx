import styles from "./CourseCard.module.css";

interface CourseCardProps {
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
  category: string;
}

export default function CourseCard({
  title,
  instructor,
  progress,
  totalLessons,
  completedLessons,
  thumbnail,
  category,
}: CourseCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <div
          className={styles.thumbnailImage}
          style={{ background: thumbnail }}
        />
        <span className={styles.category}>{category}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.instructor}>{instructor}</p>

        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              {completedLessons}/{totalLessons} aulas
            </span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
