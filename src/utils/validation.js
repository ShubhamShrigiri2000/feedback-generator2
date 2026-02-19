export const validateForm = (candidateName, experience, skills, concepts) => {
  const errors = {};

  if (!candidateName.trim()) {
    errors.candidateName = "Candidate name is required";
  }

  if (!experience.trim()) {
    errors.experience = "Experience is required";
  }

  skills.forEach((skill, index) => {
    if (!skill.name.trim() || !skill.rating.trim()) {
      errors[`skill-${index}`] = "Skill name & rating required";
    } else if (skill.rating < 1 || skill.rating > 5) {
      errors[`skill-${index}`] = "Rating must be between 1-5";
    }
  });

  concepts.forEach((concept, index) => {
    if (!concept.topic.trim() || !concept.remark.trim()) {
      errors[`concept-${index}`] = "Concept topic & remark required";
    }
  });

  return errors;
};
