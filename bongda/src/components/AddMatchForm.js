import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMatch, selectMatches } from "../features/matchesSlice";
import { useNotice } from "../context/NoticeContext";
import { ROUNDS, TEAMS } from "../data";
import { getTeamName, validateMatchForm } from "../utils";

const emptyForm = { round: "1", homeId: "", awayId: "", homeGoals: "", awayGoals: "" };

const AddMatchForm = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const showNotice = useNotice();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateMatchForm(form, matches);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const homeId = Number(form.homeId);
    const awayId = Number(form.awayId);
    dispatch(
      addMatch({
        round: Number(form.round),
        homeId,
        awayId,
        homeGoals: Number(form.homeGoals),
        awayGoals: Number(form.awayGoals),
      })
    );
    showNotice(`Đã thêm trận ${getTeamName(homeId)} - ${getTeamName(awayId)}`);
    setForm(emptyForm);
    homeRef.current.focus();
  };

  return (
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
  );
};

export default AddMatchForm;
