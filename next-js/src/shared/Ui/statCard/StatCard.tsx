import scss from "./statCard.module.scss";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <div className={scss.card}>
      <div className={scss.icon}>{icon}</div>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}