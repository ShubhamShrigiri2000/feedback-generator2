import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CandidateInfoForm from "../components/CandidateInfoForm";
import SkillsTable from "../components/SkillsTable";
import ConceptsTable from "../components/ConceptsTable";
import FinalRemarks from "../components/FinalRemarks";
import DownloadButton from "../components/DownloadButton";
import { useFeedbackForm } from "../hooks/useFeedbackForm";
import { validateForm } from "../utils/validation";
import { generatePDF } from "../utils/pdfGenerator";
import { useFeedbackContext } from "../context/FeedbackContext";

function FeedbackForm() {
  const {
    candidateName,
    setCandidateName,
    experience,
    setExperience,
    skills,
    concepts,
    finalRemarks,
    setFinalRemarks,
    errors,
    setErrors,
    handleSkillChange,
    addSkill,
    removeSkill,
    handleConceptChange,
    addConcept,
    removeConcept,
  } = useFeedbackForm();

  const { updateFormData } = useFeedbackContext();
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePreview = () => {
    const validationErrors = validateForm(candidateName, experience, skills, concepts);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Save form data to context
    updateFormData({
      candidateName,
      experience,
      skills,
      concepts,
      finalRemarks,
    });

    // Navigate to preview page
    navigate("/preview");
  };

  const handleDownloadPDF = async () => {
    const validationErrors = validateForm(candidateName, experience, skills, concepts);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsGeneratingPDF(true);

    try {
      await generatePDF(candidateName);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <Header />

      {/* Input Form */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-8 border border-gray-200">
        <CandidateInfoForm
          candidateName={candidateName}
          experience={experience}
          errors={errors}
          onNameChange={setCandidateName}
          onExperienceChange={setExperience}
        />

        <SkillsTable
          skills={skills}
          onSkillChange={handleSkillChange}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />

        <ConceptsTable
          concepts={concepts}
          onConceptChange={handleConceptChange}
          onAddConcept={addConcept}
          onRemoveConcept={removeConcept}
        />

        <FinalRemarks finalRemarks={finalRemarks} onRemarksChange={setFinalRemarks} />

        <DownloadButton
          onDownload={handleDownloadPDF}
          onPreview={handlePreview}
          isLoading={isGeneratingPDF}
        />
      </div>
    </div>
  );
}

export default FeedbackForm;
