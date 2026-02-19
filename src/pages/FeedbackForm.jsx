import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CandidateInfoForm from "../components/CandidateInfoForm";
import SkillsTable from "../components/SkillsTable";
import ConceptsTable from "../components/ConceptsTable";
import FinalRemarks from "../components/FinalRemarks";
import DownloadButton from "../components/DownloadButton";
import { useFeedbackForm } from "../hooks/useFeedbackForm";
import { validateForm } from "../utils/validation";
import { useFeedbackContext } from "../context/FeedbackContext";

function FeedbackForm() {
  const {
    candidateName,
    setCandidateName,
    experience,
    setExperience,
    skills,
    setSkills,
    concepts,
    setConcepts,
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

  const { formData, updateFormData } = useFeedbackContext();
  const navigate = useNavigate();

  // Restore form data from context when component mounts (when returning from preview)
  useEffect(() => {
    if (formData.candidateName || formData.experience || formData.skills?.length > 0 || formData.concepts?.length > 0 || formData.finalRemarks) {
      if (formData.candidateName) setCandidateName(formData.candidateName);
      if (formData.experience) setExperience(formData.experience);
      if (formData.skills && formData.skills.length > 0) setSkills(formData.skills);
      if (formData.concepts && formData.concepts.length > 0) setConcepts(formData.concepts);
      if (formData.finalRemarks) setFinalRemarks(formData.finalRemarks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreview = () => {
    const validationErrors = validateForm(candidateName, experience, skills, concepts, finalRemarks);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      setTimeout(() => {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
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
          errors={errors}
        />

        <ConceptsTable
          concepts={concepts}
          onConceptChange={handleConceptChange}
          onAddConcept={addConcept}
          onRemoveConcept={removeConcept}
          errors={errors}
        />

        <FinalRemarks finalRemarks={finalRemarks} onRemarksChange={setFinalRemarks} errors={errors} />

        <DownloadButton
          onPreview={handlePreview}
        />
      </div>
    </div>
  );
}

export default FeedbackForm;
