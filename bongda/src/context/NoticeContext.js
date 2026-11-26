import { createContext, useCallback, useContext, useEffect, useState } from "react";

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState(null);

  // Mỗi lần gọi tạo object mới nên effect bên dưới chạy lại và đếm lại 3 giây
  const showNotice = useCallback((text) => {
    setNotice({ text });
  }, []);

  useEffect(() => {
    if (notice === null) return undefined;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice && <div role="status">{notice.text}</div>}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const showNotice = useContext(NoticeContext);
  if (showNotice === null) {
    throw new Error("useNotice phải dùng bên trong NoticeProvider");
  }
  return showNotice;
};
