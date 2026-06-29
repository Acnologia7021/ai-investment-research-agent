import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage.js";
import { ReportPage } from "./pages/ReportPage.js";

export const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </div>
  );
};
