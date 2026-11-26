import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import { NoticeProvider } from "./context/NoticeContext";

// Không bọc <React.StrictMode> để bộ đếm "Số lần render" không bị đếm đôi ở chế độ dev
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <NoticeProvider>
        <App />
      </NoticeProvider>
    </ThemeProvider>
  </Provider>
);
