import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "./hooks/useFetch";
import { removeMatch, selectMatches, setGoals, setMatches } from "./features/matchesSlice";
import { useTheme } from "./context/ThemeContext";
import { useNotice } from "./context/NoticeContext";
import { MAX_GOALS, RESULT_LABELS, ROUNDS } from "./data";
import { calcMatchStats, calcStandings, getResult, getTeamName, isValidGoals } from "./utils";
import AddMatchForm from "./components/AddMatchForm";
import StandingsTable from "./components/StandingsTable";
import GoalPlanner from "./components/GoalPlanner";

const BUILD_TAG = "bd-5918";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const { data, loading, error } = useFetch("/data/matches.json");
  const [round, setRound] = useState("all");

  useEffect(() => {
    if (data) dispatch(setMatches(data));
  }, [data, dispatch]);

  const shownMatches = useMemo(
    () => matches.filter((match) => round === "all" || match.round === Number(round)),
    [matches, round]
  );
  const standings = useMemo(() => calcStandings(matches), [matches]);
  const stats = useMemo(() => calcMatchStats(shownMatches), [shownMatches]);
  const leader = matches.length > 0 ? standings[0] : null;

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.homeId)} - ${getTeamName(match.awayId)}`);
  };

  const renderTable = () => {
    if (loading) return <p>Đang tải lịch thi đấu...</p>;
    if (error) return <p>Không tải được lịch thi đấu</p>;
    if (shownMatches.length === 0) return <p>Chưa có trận đấu nào</p>;
    return (
      <table>
        <thead>
          <tr>
            <th>Vòng</th>
            <th>Đội nhà</th>
            <th>BT nhà</th>
            <th>BT khách</th>
            <th>Đội khách</th>
            <th>Kết quả</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {shownMatches.map((match) => {
            const homeName = getTeamName(match.homeId);
            const awayName = getTeamName(match.awayId);
            const result = getResult(match);
            return (
              <tr
                key={match.id}
                style={result === "draw" ? { background: "rgba(255, 193, 7, 0.25)" } : undefined}
              >
                <td>{match.round}</td>
                <td>{homeName}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={MAX_GOALS}
                    aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
                    value={match.homeGoals}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      if (isValidGoals(value)) {
                        dispatch(setGoals({ id: match.id, homeGoals: value, awayGoals: match.awayGoals }));
                      }
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={MAX_GOALS}
                    aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
                    value={match.awayGoals}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      if (isValidGoals(value)) {
                        dispatch(setGoals({ id: match.id, homeGoals: match.homeGoals, awayGoals: value }));
                      }
                    }}
                  />
                </td>
                <td>{awayName}</td>
                <td>{RESULT_LABELS[result]}</td>
                <td>
                  <button type="button" onClick={() => handleRemove(match)}>
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      <button type="button" onClick={toggleTheme}>
        {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
      </button>

      <section>
        <h2>Lịch thi đấu</h2>
        <div>
          <label htmlFor="filter-round">Xem vòng</label>{" "}
          <select id="filter-round" value={round} onChange={(e) => setRound(e.target.value)}>
            <option value="all">Tất cả</option>
            {ROUNDS.map((r) => (
              <option key={r} value={String(r)}>{`Vòng ${r}`}</option>
            ))}
          </select>
        </div>
        {renderTable()}
      </section>

      <section>
        <h2>Thêm trận đấu</h2>
        <AddMatchForm />
      </section>

      <section>
        <h2>Bảng xếp hạng</h2>
        <StandingsTable standings={standings} />
      </section>

      <section>
        <h2>Thống kê</h2>
        <p>{`Số trận: ${stats.count}`}</p>
        <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
        <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
        <p>{leader ? `Đội dẫn đầu: ${leader.name} (${leader.points} điểm)` : "Đội dẫn đầu: —"}</p>
      </section>

      <section>
        <h2>Mục tiêu điểm</h2>
        <GoalPlanner standings={standings} />
      </section>
    </div>
  );
};

export default App;
