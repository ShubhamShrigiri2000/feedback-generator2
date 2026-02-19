import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import FeedbackForm from "./pages/FeedbackForm";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <FeedbackProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </BrowserRouter>
    </FeedbackProvider>
  );
}

export default App;
