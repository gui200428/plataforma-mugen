import styles from "./StatsCard.module.css";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  icon,
  value,
  label,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.info}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
      {trend && (
        <span
          className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      )}
    </div>
  );
}
