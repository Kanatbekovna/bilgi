import scss from "./statCard.module.scss";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className={scss.card}>
      <div className={scss.iconWrap}>{icon}</div>
      <p className={scss.value}>{value}</p>
      <p className={scss.label}>{label}</p>
      <div className={scss.underline} />
    </div>
  );
}
