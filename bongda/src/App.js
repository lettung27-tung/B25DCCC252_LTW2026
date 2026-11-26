import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import useFetch from "./hooks/useFetch";
import matchesReducer from "./matchesReducer";
import { MAX_GOALS, RESULT_LABELS, ROUNDS, TEAMS } from "./data";
import {
  calcMatchStats,
  calcStandings,
  formatDiff,
  getResult,
  getTeamName,
  isValidGoals,
  validateMatchForm,
} from "./utils";

const BUILD_TAG = "bd-5918";

const emptyForm = { round: "1", homeId: "", awayId: "", homeGoals: "", awayGoals: "" };

const App = () => {
  const { data, loading, error } = useFetch("/data/matches.json");
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [round, setRound] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  useEffect(() => {
    if (data) dispatch({ type: "LOAD", payload: data });
  }, [data]);

  const shownMatches = useMemo(
    () => matches.filter((match) => round === "all" || match.round === Number(round)),
    [matches, round]
  );
  const standings = useMemo(() => calcStandings(matches), [matches]);
  const stats = useMemo(() => calcMatchStats(shownMatches), [shownMatches]);
  const leader = matches.length > 0 ? standings[0] : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateMatchForm(form, matches);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    dispatch({
      type: "ADD",
      payload: {
        round: Number(form.round),
        homeId: Number(form.homeId),
        awayId: Number(form.awayId),
        homeGoals: Number(form.homeGoals),
        awayGoals: Number(form.awayGoals),
      },
    });
    setForm(emptyForm);
    homeRef.current.focus();
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
                        dispatch({
                          type: "SET_GOALS",
                          payload: { id: match.id, homeGoals: value, awayGoals: match.awayGoals },
                        });
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
                        dispatch({
                          type: "SET_GOALS",
                          payload: { id: match.id, homeGoals: match.homeGoals, awayGoals: value },
                        });
                      }
                    }}
                  />
                </td>
                <td>{awayName}</td>
                <td>{RESULT_LABELS[result]}</td>
                <td>
                  <button type="button" onClick={() => dispatch({ type: "REMOVE", payload: match.id })}>
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
    <div className="app" data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>

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
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="form-round">Vòng</label>{" "}
            <select id="form-round" name="round" value={form.round} onChange={handleChange}>
              {ROUNDS.map((r) => (
                <option key={r} value={String(r)}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="form-home">Đội nhà</label>{" "}
            <select id="form-home" name="homeId" ref={homeRef} value={form.homeId} onChange={handleChange}>
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((team) => (
                <option key={team.id} value={String(team.id)}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.homeId && <p role="alert">{errors.homeId}</p>}
          </div>
          <div>
            <label htmlFor="form-away">Đội khách</label>{" "}
            <select id="form-away" name="awayId" value={form.awayId} onChange={handleChange}>
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((team) => (
                <option key={team.id} value={String(team.id)}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.awayId && <p role="alert">{errors.awayId}</p>}
          </div>
          <div>
            <label htmlFor="form-home-goals">Bàn thắng đội nhà</label>{" "}
            <input
              id="form-home-goals"
              type="number"
              name="homeGoals"
              value={form.homeGoals}
              onChange={handleChange}
            />
            {errors.homeGoals && <p role="alert">{errors.homeGoals}</p>}
          </div>
          <div>
            <label htmlFor="form-away-goals">Bàn thắng đội khách</label>{" "}
            <input
              id="form-away-goals"
              type="number"
              name="awayGoals"
              value={form.awayGoals}
              onChange={handleChange}
            />
            {errors.awayGoals && <p role="alert">{errors.awayGoals}</p>}
          </div>
          <button type="submit">Thêm trận</button>
        </form>
      </section>

      <section>
        <h2>Bảng xếp hạng</h2>
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Đội</th>
              <th>Trận</th>
              <th>Thắng</th>
              <th>Hòa</th>
              <th>Thua</th>
              <th>BT</th>
              <th>BB</th>
              <th>HS</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => (
              <tr
                key={row.id}
                style={index === standings.length - 1 ? { color: "#c62828" } : undefined}
              >
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.gf}</td>
                <td>{row.ga}</td>
                <td>{formatDiff(row.diff)}</td>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Thống kê</h2>
        <p>{`Số trận: ${stats.count}`}</p>
        <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
        <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
        <p>{leader ? `Đội dẫn đầu: ${leader.name} (${leader.points} điểm)` : "Đội dẫn đầu: —"}</p>
      </section>
    </div>
  );
};

export default App;
