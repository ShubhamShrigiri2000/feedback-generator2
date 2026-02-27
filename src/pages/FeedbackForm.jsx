import { useState, useEffect } from "react";
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

  const { updateFormData } = useFeedbackContext();
  const navigate = useNavigate();

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [dbData, setDbData] = useState({ skills: [], clientSkills: [] });

  const [feedbackType, setFeedbackType] = useState("internal");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  /* ---------- Load db.json ---------- */
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await fetch("/db.json");
  //       const json = await res.json();
  //       setDbData(json || { skills: [], clientSkills: [] });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, clientSkillsRes] = await Promise.all([
          fetch("http://localhost:3001/skills"),
          fetch("http://localhost:3001/clientSkills"),
        ]);

        const skills = await skillsRes.json();
        const clientSkills = await clientSkillsRes.json();

        setDbData({
          skills: skills || [],
          clientSkills: clientSkills || [],
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);
  /* ---------- Reset when toggle changes ---------- */
  useEffect(() => {
    setSelectedDepartment("");
    setSelectedClient("");
    setSkills([{ name: "", rating: "" }]);
    setConcepts([{ topic: "", remark: "" }]);
  }, [feedbackType]);

  /* ---------- Reset department when client changes ---------- */
  useEffect(() => {
    setSelectedDepartment("");
  }, [selectedClient]);

  /* ---------- Client dropdown options ---------- */
  const clientOptions = (dbData.clientSkills || []).map((c) => ({
    id: c.clientId,
    name: c.clientName,
  }));

  /* ---------- Dynamic department options ---------- */
  const departmentOptions = (() => {
    if (feedbackType === "internal") {
      return [...new Set((dbData.skills || []).map((d) => d.department))];
    }

    if (feedbackType === "client") {
      if (!selectedClient) return [];

      return [
        ...new Set(
          (dbData.clientSkills || [])
            .filter((c) => c.clientId === selectedClient)
            .map((d) => d.department),
        ),
      ];
    }

    return [];
  })();

  /* ---------- Load skills + concepts ---------- */
  useEffect(() => {
    if (!selectedDepartment) return;

    const source =
      feedbackType === "internal" ? dbData.skills : dbData.clientSkills;

    let deptEntries = (source || []).filter(
      (d) => d.department === selectedDepartment,
    );

    if (feedbackType === "client" && selectedClient) {
      deptEntries = deptEntries.filter((d) => d.clientId === selectedClient);
    }

    const newSkills = [];
    const newConcepts = [];

    deptEntries.forEach((d) => {
      (d.skills || []).forEach((s) => {
        newSkills.push({ name: s.name || "", rating: "" });

        (s.concepts || []).forEach((c) => {
          newConcepts.push({ topic: c, remark: "" });
        });
      });
    });

    setSkills(newSkills.length ? newSkills : [{ name: "", rating: "" }]);
    setConcepts(newConcepts.length ? newConcepts : [{ topic: "", remark: "" }]);
  }, [selectedDepartment, selectedClient, feedbackType, dbData]);

  /* ---------- Derive client name ---------- */
  const selectedClientObj = (dbData.clientSkills || []).find(
    (c) => c.clientId === selectedClient,
  );
  const clientName = selectedClientObj?.clientName || "";

  /* ---------- Preview ---------- */
  const handlePreview = () => {
    const validationErrors = validateForm(
      candidateName,
      experience,
      skills,
      concepts,
    );

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    updateFormData({
      candidateName,
      experience,
      skills,
      concepts,
      finalRemarks,

      feedbackType,
      clientId: selectedClient,
      clientName,
      department: selectedDepartment,
    });

    navigate("/preview");
  };

  /* ---------- PDF ---------- */
  const handleDownloadPDF = async () => {
    const validationErrors = validateForm(
      candidateName,
      experience,
      skills,
      concepts,
    );

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    updateFormData({
      candidateName,
      experience,
      skills,
      concepts,
      finalRemarks,
      feedbackType,
      clientId: selectedClient,
      clientName,
      department: selectedDepartment,
    });

    setIsGeneratingPDF(true);
    try {
      await generatePDF(candidateName);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <Header />

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-8 border border-gray-200">
        {/* Toggle + Dropdowns */}
        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setFeedbackType("internal")}
              className={`px-4 py-1 rounded ${
                feedbackType === "internal"
                  ? "bg-red-600 text-white"
                  : "bg-white border"
              }`}
            >
              Internal
            </button>

            <button
              onClick={() => setFeedbackType("client")}
              className={`px-4 py-1 rounded ${
                feedbackType === "client"
                  ? "bg-red-600 text-white"
                  : "bg-white border"
              }`}
            >
              Client
            </button>
          </div>

          {/* Client dropdown */}
          {feedbackType === "client" && (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select client</option>
              {clientOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Department dropdown */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select department</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

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

        <FinalRemarks
          finalRemarks={finalRemarks}
          onRemarksChange={setFinalRemarks}
        />

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
