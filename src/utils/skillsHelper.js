// Helper utilities for new structure: Department -> Skill -> Concept

const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

export const addSkillHelper = (data) => ({
  ...data,
  skills: [...(data.skills || []), { id: generateId(), name: "", concepts: [] }],
});

export const insertSkillHelper = (data, index) => {
  const newSkill = { id: generateId(), name: "", concepts: [] };
  const skills = Array.isArray(data.skills) ? [...data.skills] : [];
  const idx = Math.max(0, Math.min(index, skills.length));
  skills.splice(idx, 0, newSkill);
  return { ...data, skills };
};

export const removeSkillHelper = (data, skillIndex) => ({
  ...data,
  skills: (data.skills || []).filter((_, i) => i !== skillIndex),
});

export const updateSkillNameHelper = (data, skillIndex, newName) => {
  const newSkills = (data.skills || []).map((s, i) => (i === skillIndex ? { ...s, name: newName } : s));
  return { ...data, skills: newSkills };
};

export const addConceptHelper = (data, skillIndex) => {
  const newSkills = (data.skills || []).map((s, i) => (i === skillIndex ? { ...s, concepts: [...(s.concepts || []), ""] } : s));
  return { ...data, skills: newSkills };
};

export const insertConceptHelper = (data, skillIndex, insertAt) => {
  const skills = (data.skills || []).map((s) => ({ ...s, concepts: Array.isArray(s.concepts) ? [...s.concepts] : [] }));
  const target = skills[skillIndex];
  if (!target) return data;
  const idx = Math.max(0, Math.min(insertAt, target.concepts.length));
  target.concepts.splice(idx, 0, "");
  skills[skillIndex] = { ...target };
  return { ...data, skills };
};

export const updateConceptHelper = (data, skillIndex, conceptIndex, value) => {
  const newSkills = (data.skills || []).map((s, i) => {
    if (i !== skillIndex) return s;
    const newConcepts = (s.concepts || []).map((c, ci) => (ci === conceptIndex ? value : c));
    return { ...s, concepts: newConcepts };
  });
  return { ...data, skills: newSkills };
};

export const removeConceptHelper = (data, skillIndex, conceptIndex) => {
  const newSkills = (data.skills || []).map((s, i) => (i === skillIndex ? { ...s, concepts: (s.concepts || []).filter((_, ci) => ci !== conceptIndex) } : s));
  return { ...data, skills: newSkills };
};

export const validateSkillData = (data) => {
  const errors = [];
  if (!data.department || !data.department.toString().trim()) errors.push("Department is required");
  (data.skills || []).forEach((s, si) => {
    if (!s.name || !s.name.trim()) errors.push(`Skill ${si + 1}: name is required`);
    (s.concepts || []).forEach((c, ci) => {
      if (!c || !c.toString().trim()) errors.push(`Skill ${si + 1}, Concept ${ci + 1}: text is required`);
    });
  });
  return errors;
};
