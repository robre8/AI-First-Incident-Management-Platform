import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/incidents/new" element={<CreateIncidentPage />} />
            <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
