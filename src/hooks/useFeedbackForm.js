import { useState } from "react";

export const useFeedbackForm = () => {
  const [candidateName, setCandidateName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([{ name: "", rating: "" }]);
  const [concepts, setConcepts] = useState([{ topic: "", remark: "" }]);
  const [finalRemarks, setFinalRemarks] = useState("");
  const [errors, setErrors] = useState({});

  const handleSkillChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const addSkill = () => {
    const lastSkill = skills[skills.length - 1];
    if (!lastSkill.name.trim() || !lastSkill.rating.trim()) return;
    setSkills([...skills, { name: "", rating: "" }]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const updated = skills.filter((_, i) => i !== index);
      setSkills(updated);
    }
  };

  const handleConceptChange = (index, field, value) => {
    const updated = [...concepts];
    updated[index][field] = value;
    setConcepts(updated);
  };

  const addConcept = () => {
    const lastConcept = concepts[concepts.length - 1];
    if (!lastConcept.topic.trim() || !lastConcept.remark.trim()) return;
    setConcepts([...concepts, { topic: "", remark: "" }]);
  };

  const removeConcept = (index) => {
    if (concepts.length > 1) {
      const updated = concepts.filter((_, i) => i !== index);
      setConcepts(updated);
    }
  };

  return {
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
  };
};
