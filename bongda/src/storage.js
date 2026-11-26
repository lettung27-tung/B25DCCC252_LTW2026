const MATCHES_KEY = "ltw_bongda_matches";

// Trả về mảng trận đã lưu, hoặc null nếu chưa có / dữ liệu hỏng
export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(MATCHES_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (error) {
    // bỏ qua lỗi ghi (bộ nhớ đầy, chế độ riêng tư...)
  }
};
