import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import FeedbackForm from "./pages/FeedbackForm";
import PreviewPage from "./pages/PreviewPage";
import ManageSkills from "./pages/ManageSkill";
import ToastContainer from "./components/ToastContainer";

function App() {
  return (
    <FeedbackProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/manage-skills" element={<ManageSkills />} />
        </Routes>
      </BrowserRouter>
    </FeedbackProvider>
  );
}

export default App;
