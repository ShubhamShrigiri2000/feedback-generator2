export const validateForm = (candidateName, experience, skills, concepts, finalRemarks) => {
  const errors = {};

  if (!candidateName.trim()) {
    errors.candidateName = "Candidate name is required";
  }

  if (!experience.trim()) {
    errors.experience = "Experience is required";
  }

  // Validate skills - at least one skill with name and rating is required
  const validSkills = skills.filter(skill => skill.name.trim() && skill.rating.trim());
  if (validSkills.length === 0) {
    errors.skills = "At least one technical skill with name and rating is required";
  } else {
    skills.forEach((skill, index) => {
      if (skill.name.trim() && !skill.rating.trim()) {
        errors[`skill-${index}`] = "Rating is required for this skill";
      } else if (skill.rating.trim() && !skill.name.trim()) {
        errors[`skill-${index}`] = "Skill name is required";
      } else if (skill.name.trim() && skill.rating.trim()) {
        if (skill.rating < 1 || skill.rating > 5) {
          errors[`skill-${index}`] = "Rating must be between 1-5";
        }
      }
    });
  }

  // Validate concepts - at least one concept with topic and remark is required
  const validConcepts = concepts.filter(concept => concept.topic.trim() && concept.remark.trim());
  if (validConcepts.length === 0) {
    errors.concepts = "At least one screening concept with topic and remark is required";
  } else {
    concepts.forEach((concept, index) => {
      if (concept.topic.trim() && !concept.remark.trim()) {
        errors[`concept-${index}`] = "Remark is required for this concept";
      } else if (concept.remark.trim() && !concept.topic.trim()) {
        errors[`concept-${index}`] = "Concept topic is required";
      }
    });
  }

  if (!finalRemarks.trim()) {
    errors.finalRemarks = "Final remarks are required";
  }

  return errors;
};
