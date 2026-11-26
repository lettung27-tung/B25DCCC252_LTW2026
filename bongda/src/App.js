import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hasSaved } from "./store";
import useFetch from "./hooks/useFetch";
import useLocalStorage from "./hooks/useLocalStorage";
import useDebounce from "./hooks/useDebounce";
import { removeMatch, selectMatches, setGoals, setMatches } from "./features/matchesSlice";
import { useTheme } from "./context/ThemeContext";
import { useNotice } from "./context/NoticeContext";
import { RESULT_LABELS, ROUNDS } from "./data";
import { calcMatchStats, calcStandings, getTeamName } from "./utils";
import AddMatchForm from "./components/AddMatchForm";
import GoalPlanner from "./components/GoalPlanner";
import MatchRow from "./components/MatchRow";
import StandingsTable from "./components/StandingsTable";

const BUILD_TAG = "bd-5918";
const SITE_TITLE = "Giải bóng đá khoa";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const { data, loading, error } = useFetch("/data/matches.json");
  const [round, setRound] = useLocalStorage("ltw_bongda_round", "all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  // Chưa có dữ liệu lưu: nạp lịch thi đấu mẫu khi fetch xong
  useEffect(() => {
    if (hasSaved && data) dispatch(setMatches(data));
  }, [data, dispatch]);

  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => dispatch(setGoals({ id, homeGoals, awayGoals })),
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.homeId)} - ${getTeamName(match.awayId)}`);
    },
    [dispatch, showNotice]
  );

  const handleReset = useCallback(() => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice("Đã đặt lại dữ liệu mẫu");
  }, [dispatch, showNotice, data]);

  // Nhận sự kiện onChange của ô tìm kiếm, hoặc một chuỗi (dùng khi bấm Esc)
  const handleTeamShift = useCallback((e) => {
    setSearch(typeof e === "string" ? e : e.target.value);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/") {
        const el = document.activeElement;
        const tag = el ? el.tagName : "";
        const typing =
          tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (el && el.isContentEditable);
        if (!typing && searchRef.current) {
          e.preventDefault();
          searchRef.current.focus();
        }
      } else if (e.key === "Escape" && document.activeElement === searchRef.current) {
        handleTeamShift("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleTeamShift]);

  const roundMatches = useMemo(
    () => matches.filter((match) => round === "all" || match.round === Number(round)),
    [matches, round]
  );
  const visibleMatches = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (keyword === "") return roundMatches;
    return roundMatches.filter(
      (match) =>
        getTeamName(match.homeId).toLowerCase().includes(keyword) ||
        getTeamName(match.awayId).toLowerCase().includes(keyword)
    );
  }, [roundMatches, debouncedSearch]);
  const standings = useMemo(() => calcStandings(matches), [matches]);
  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);
  const leader = matches.length > 0 ? standings[0] : null;
  const leaderName = leader ? leader.name : null;

  useEffect(() => {
    document.title = leaderName ? `${leaderName} dẫn đầu – ${SITE_TITLE}` : SITE_TITLE;
  }, [leaderName]);

  // Đã có dữ liệu lưu thì không chờ fetch và không hiện lỗi fetch
  const renderTable = () => {
    if (hasSaved && loading) return <p>Đang tải lịch thi đấu...</p>;
    if (hasSaved && error) return <p>Không tải được lịch thi đấu</p>;
    if (visibleMatches.length === 0) return <p>Chưa có trận đấu nào</p>;
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
            <th>Số lần render</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {visibleMatches.map((match) => (
            <MatchRow key={match.id} match={match} onGoals={handleGoals} onRemove={handleRemove} />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>{SITE_TITLE}</h1>
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
          </select>{" "}
          <label htmlFor="search-team">Tìm đội</label>{" "}
          <input
            id="search-team"
            type="text"
            ref={searchRef}
            value={search}
            onChange={handleTeamShift}
          />
        </div>
        <p>{`Tìm thấy ${visibleMatches.length} trận`}</p>
        {renderTable()}
        <p>
          <button type="button" onClick={handleReset} disabled={!data}>
            Đặt lại dữ liệu mẫu
          </button>
        </p>
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
        <h3>Phân bố kết quả</h3>
        <ul>
          {Object.entries(RESULT_LABELS).map(([key, label]) => (
            <li key={key}>
              {`${label}: ${stats.counts[key]}`}{" "}
              <span
                style={{
                  display: "inline-block",
                  background: "#1976d2",
                  height: 10,
                  width: 24 * stats.counts[key],
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mục tiêu điểm</h2>
        <GoalPlanner standings={standings} />
      </section>
    </div>
  );
};

export default App;
