const API_BASE_URL = "http://localhost:3001/skills";

/**
 * Get all skills with their nested structure
 */
export const getSkills = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};

/**
 * Get skills by department using JSON Server filtering
 */
export const getSkillsByDepartment = async (department) => {
  try {
    const url = `${API_BASE_URL}?department=${encodeURIComponent(department)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching skills for department ${department}:`, error);
    throw error;
  }
};

/**
 * Create a new skills record
 */
export const createSkills = async (skillData) => {
  try {
    if (!skillData.department) throw new Error("Department is required");
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating skills:", error);
    throw error;
  }
};

/**
 * Update an existing skills record
 */
export const updateSkills = async (id, skillData) => {
  try {
    if (!id) throw new Error("Skill ID is required");
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating skills ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a skills record
 */
export const deleteSkills = async (id) => {
  try {
    if (!id) throw new Error("Skill ID is required");
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting skills ${id}:`, error);
    throw error;
  }
};
