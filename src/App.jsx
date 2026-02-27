import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import FeedbackForm from "./pages/FeedbackForm";
import PreviewPage from "./pages/PreviewPage";
import ManageSkills from "./pages/ManageSkill";
import ToastContainer from "./components/ToastContainer";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
    <FeedbackProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/manage-skills" element={ <ProtectedRoute>
                  <ManageSkills />
                </ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
        </Routes>
        
      </BrowserRouter>
    </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;
