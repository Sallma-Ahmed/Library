import { BrowserRouter, Routes, Route ,useNavigate } from "react-router-dom";

import StartPage from "./pages/StartPage";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateDetails from "./pages/TemplatesDetails";
import EnvironmentsPage from "./pages/EnvironmentsPage";
import EnvironmentDemoPage from "./pages/EnvironmentDemoPage"; 
import CreateNativeLO from "./pages/CreateNativeLO";
import CreateEnvironment from "./pages/CreateEnvironment";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/templates/:category" element={<TemplatesPage />} />
        <Route path="/template/:id" element={<TemplateDetails />} />
                <Route path="/environments/:id" element={<EnvironmentsPage />} />
                        <Route path="/environments/:id/:envId" element={<EnvironmentDemoPage />} />
                        <Route path="/create" element={<CreateNativeLO />} />
                        <Route path="/createEnvironment" element={<CreateEnvironment />} />

      </Routes>
    </BrowserRouter>
  );
}
