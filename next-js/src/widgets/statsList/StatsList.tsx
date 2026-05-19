import StatCard from "@/shared/Ui/statCard/StatCard";
import scss from "./statsList.module.scss";
import { LiaClipboardListSolid } from "react-icons/lia";
import { GiGraduateCap } from "react-icons/gi";
import { FaBookOpen } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMdPaper } from "react-icons/io";

export default function StatsList() {
  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <h3>DATABASE STATISTICS</h3>
          <div className={scss.listStat}>
            <StatCard
              icon={<LiaClipboardListSolid />}
              value="682,821"
              label="
WORKS"
            />
            <StatCard
              icon={<GiGraduateCap />}
              value="76,281"
              label="
THESES"
            />
            <StatCard
              icon={<IoMdPaper />}
              value="260,448"
              label="
ARTICLES"
            />
            <StatCard
              icon={<FaBookOpen />}
              value="49,535"
              label="
JOURNALS"
            />
            <StatCard
              icon={<TbUsers />}
              value="867,863"
              label="
AUTHORS"
            />
            <StatCard
              icon={<FaArrowTrendUp />}
              value="8,359"
              label="
CONCEPTS"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
