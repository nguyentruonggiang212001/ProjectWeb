import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import store from "./store/store.js";
import AuthProvider from "./contexts/AuthContext.jsx";
import "../src/css/style.css";
import "../src/css/grid.css";
import ScrollRestoration from "./components/ScrollRestoration.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ScrollRestoration />
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </HashRouter>
);
