const StudentItem = ({ student, index, onDelete }) => {
  const { id, name, score, class: className } = student;

  let rank = "Trung bình";
  if (score >= 8) rank = "Giỏi";
  else if (score < 5) rank = "Trượt";

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{className}</td>
      <td>{score}</td>
      <td>
        <span className={`badge ${score >= 8 ? "good" : score < 5 ? "fail" : "mid"}`}>
          {rank}
        </span>
      </td>
      <td>
        <button className="btn-delete" onClick={() => onDelete(id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
