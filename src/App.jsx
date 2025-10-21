import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateDetails from "./pages/TemplatesDetails";
import EnvironmentsPage from "./pages/EnvironmentsPage";
import EnvironmentDemoPage from "./pages/EnvironmentDemoPage"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/templates/:category" element={<TemplatesPage />} />
        <Route path="/template/:id" element={<TemplateDetails />} />
                <Route path="/environments/:id" element={<EnvironmentsPage />} />
                        <Route path="/environments/:id/:envId" element={<EnvironmentDemoPage />} />

      </Routes>
    </BrowserRouter>
  );
}
