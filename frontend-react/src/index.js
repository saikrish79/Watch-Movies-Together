import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./css/index.css";
import "bootstrap/dist/css/bootstrap.css";
import Footer from "./components/footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
const footer = ReactDOM.createRoot(document.getElementById("footer"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
footer.render(<Footer />);
