import { useState } from "react";
import StudentList from "./components/StudentList";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn An", score: 8.5, class: "D25CQCN01" },
  { id: 2, name: "Trần Thị Bình", score: 6.5, class: "D25CQCN01" },
  { id: 3, name: "Lê Hoàng Cường", score: 4.0, class: "D25CQCN02" },
  { id: 4, name: "Phạm Minh Dũng", score: 9.0, class: "D25CQCN02" },
];

const emptyForm = { name: "", score: "", class: "" };

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all"); // all | good | fail
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const { name, score, class: className } = form;

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm({ ...form, [field]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const scoreNum = Number(score);

    if (!name.trim() || !className.trim() || score.trim() === "") {
      setError("Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp.");
      return;
    }
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số phải là số trong khoảng từ 0 đến 10.");
      return;
    }

    const newId = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const newStudent = {
      id: newId,
      name: name.trim(),
      score: scoreNum,
      class: className.trim(),
    };

    setStudents([...students, newStudent]);
    setForm(emptyForm);
    setError("");
  };

  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter(({ score: s }) => {
    if (filter === "good") return s >= 8;
    if (filter === "fail") return s < 5;
    return true;
  });

  const total = students.length;
  const average =
    total === 0
      ? 0
      : students.reduce((sum, { score: s }) => sum + s, 0) / total;

  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>

      <form className="form" onSubmit={handleAdd}>
        <input name="name" placeholder="Họ tên" value={name} onChange={handleChange} />
        <input
          name="score"
          type="number"
          step="0.1"
          placeholder="Điểm số (0 - 10)"
          value={score}
          onChange={handleChange}
        />
        <input name="class" placeholder="Lớp" value={className} onChange={handleChange} />
        <button type="submit">Thêm</button>
      </form>
      {error && <p className="error">{error}</p>}

      <div className="stats">
        <span>{`Tổng số sinh viên: ${total}`}</span>
        <span>{`Điểm trung bình lớp: ${average.toFixed(2)}`}</span>
        <span>{`Đang hiển thị: ${filteredStudents.length}`}</span>
      </div>

      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          Tất cả
        </button>
        <button className={filter === "good" ? "active" : ""} onClick={() => setFilter("good")}>
          Giỏi (≥ 8)
        </button>
        <button className={filter === "fail" ? "active" : ""} onClick={() => setFilter("fail")}>
          Trượt (&lt; 5)
        </button>
      </div>

      <StudentList students={filteredStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;
