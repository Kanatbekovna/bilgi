import StatCard from "@/shared/Ui/statCard/StatCard";
import scss from "./statsList.module.scss";
import { LiaClipboardListSolid } from "react-icons/lia";
import { PiScrollLight } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";
import { TbLayoutGrid, TbUsers, TbTrendingUp } from "react-icons/tb";

export default function StatsList() {
  return (
    <section className={scss.section}>
      <div className="container">

        <div className={scss.heading}>
          <p className={scss.headingText}>DATABASE STATISTICS</p>
          <div className={scss.diamond}><span>◆</span></div>
        </div>

        <div className={scss.grid}>
          <StatCard
            icon={<LiaClipboardListSolid />}
            value="2,850+"
            label="НАУЧНЫЕ СТАТЬИ"
          />
          <StatCard
            icon={<PiScrollLight />}
            value="1,270+"
            label="РУКОПИСИ"
          />
          <StatCard
            icon={<FaBookOpen />}
            value="340+"
            label="ЖУРНАЛЫ"
          />
          <StatCard
            icon={<TbLayoutGrid />}
            value="56+"
            label="КАТЕГОРИИ"
          />
          <StatCard
            icon={<TbUsers />}
            value="980+"
            label="АВТОРЫ"
          />
          <StatCard
            icon={<TbTrendingUp />}
            value="15,600+"
            label="ЦИТИРОВАНИЯ"
          />
        </div>

      </div>
    </section>
  );
}
