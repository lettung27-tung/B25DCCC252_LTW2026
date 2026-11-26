import { MAX_GOALS, TEAMS } from "./data";

export const getTeamName = (id) => {
  const team = TEAMS.find((item) => item.id === id);
  return team ? team.name : "";
};

export const getResult = ({ homeGoals, awayGoals }) => {
  if (homeGoals > awayGoals) return "home";
  if (homeGoals < awayGoals) return "away";
  return "draw";
};

export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const formatDiff = (diff) => (diff > 0 ? `+${diff}` : `${diff}`);

export const calcStandings = (matches) => {
  const rows = TEAMS.map(({ id, name }) => ({
    id,
    name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));
  const findRow = (id) => rows.find((row) => row.id === id);

  matches.forEach((match) => {
    const home = findRow(match.homeId);
    const away = findRow(match.awayId);
    if (!home || !away) return;
    const result = getResult(match);
    home.played += 1;
    away.played += 1;
    home.gf += match.homeGoals;
    home.ga += match.awayGoals;
    away.gf += match.awayGoals;
    away.ga += match.homeGoals;
    if (result === "home") {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (result === "away") {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  rows.forEach((row) => {
    row.diff = row.gf - row.ga;
  });

  return [...rows].sort(
    (a, b) =>
      b.points - a.points ||
      b.diff - a.diff ||
      b.gf - a.gf ||
      a.name.localeCompare(b.name, "vi")
  );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;
  matches.forEach((match) => {
    goals += match.homeGoals + match.awayGoals;
    counts[getResult(match)] += 1;
  });
  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};

// Kiểm tra form thêm trận, trả về object lỗi (rỗng nếu hợp lệ)
export const validateMatchForm = (form, matches) => {
  const errors = {};
  const homeId = Number(form.homeId);
  const awayId = Number(form.awayId);

  if (form.homeId === "") {
    errors.homeId = "Hãy chọn đội nhà";
  }
  if (form.awayId === "") {
    errors.awayId = "Hãy chọn đội khách";
  } else if (form.homeId !== "" && homeId === awayId) {
    errors.awayId = "Hai đội phải khác nhau";
  } else if (
    form.homeId !== "" &&
    matches.some(
      (m) =>
        (m.homeId === homeId && m.awayId === awayId) ||
        (m.homeId === awayId && m.awayId === homeId)
    )
  ) {
    errors.awayId = "Hai đội đã đá với nhau rồi";
  }

  ["homeGoals", "awayGoals"].forEach((key) => {
    if (form[key] === "" || !isValidGoals(Number(form[key]))) {
      errors[key] = `Số bàn thắng phải là số nguyên từ 0 đến ${MAX_GOALS}`;
    }
  });

  return errors;
};
