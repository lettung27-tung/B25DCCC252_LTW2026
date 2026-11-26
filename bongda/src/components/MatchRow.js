import { memo, useRef } from "react";
import { MAX_GOALS, RESULT_LABELS } from "../data";
import { getResult, getTeamName, isValidGoals } from "../utils";

const MatchRow = ({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const homeName = getTeamName(match.homeId);
  const awayName = getTeamName(match.awayId);
  const result = getResult(match);

  return (
    <tr style={result === "draw" ? { background: "rgba(255, 193, 7, 0.25)" } : undefined}>
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
            if (isValidGoals(value)) onGoals(match.id, value, match.awayGoals);
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
            if (isValidGoals(value)) onGoals(match.id, match.homeGoals, value);
          }}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td>{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default memo(MatchRow);
