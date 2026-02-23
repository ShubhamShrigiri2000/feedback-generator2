// const API_BASE_URL = "http://localhost:3001/skills";

// /**
//  * Get all skills with their nested structure
//  */
// export const getSkills = async () => {
//   try {
//     const response = await fetch(API_BASE_URL);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching skills:", error);
//     throw error;
//   }
// };

// /**
//  * Get skills by department using JSON Server filtering
//  */
// export const getSkillsByDepartment = async (department, clientId) => {
//   try {
//     let url = `${API_BASE_URL}?department=${encodeURIComponent(department)}`;
//     if (clientId) url += `&clientId=${encodeURIComponent(clientId)}`;
//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching skills for department ${department}${clientId ? ` and client ${clientId}` : ''}:`, error);
//     throw error;
//   }
// };

// /**
//  * Create a new skills record
//  */
// export const createSkills = async (skillData) => {
//   try {
//     if (!skillData.department) throw new Error("Department is required");
//     const response = await fetch(API_BASE_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(skillData),
//     });
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return await response.json();
//   } catch (error) {
//     console.error("Error creating skills:", error);
//     throw error;
//   }
// };

// /**
//  * Update an existing skills record
//  */
// export const updateSkills = async (id, skillData) => {
//   try {
//     if (!id) throw new Error("Skill ID is required");
//     const response = await fetch(`${API_BASE_URL}/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(skillData),
//     });
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return await response.json();
//   } catch (error) {
//     console.error(`Error updating skills ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Delete a skills record
//  */
// export const deleteSkills = async (id) => {
//   try {
//     if (!id) throw new Error("Skill ID is required");
//     const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return { success: true, id };
//   } catch (error) {
//     console.error(`Error deleting skills ${id}:`, error);
//     throw error;
//   }
// };



const INTERNAL_URL = "http://localhost:3001/skills";
const CLIENT_URL = "http://localhost:3001/clientSkills";

/* GET ALL */
export const getSkills = async (type = "internal") => {
  const url = type === "client" ? CLIENT_URL : INTERNAL_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed fetch");
  return res.json();
};

/* GET BY DEPARTMENT */
export const getSkillsByDepartment = async (
  department,
  clientId,
  type = "internal"
) => {
  let url;

  if (type === "client") {
    url = `${CLIENT_URL}?department=${department}&clientId=${clientId}`;
  } else {
    url = `${INTERNAL_URL}?department=${department}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed fetch");
  return res.json();
};

/* CREATE */
export const createSkills = async (data, type = "internal") => {
  const url = type === "client" ? CLIENT_URL : INTERNAL_URL;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

/* UPDATE */
export const updateSkills = async (id, data, type = "internal") => {
  const url =
    type === "client"
      ? `${CLIENT_URL}/${id}`
      : `${INTERNAL_URL}/${id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

/* DELETE */
export const deleteSkills = async (id, type = "internal") => {
  const url =
    type === "client"
      ? `${CLIENT_URL}/${id}`
      : `${INTERNAL_URL}/${id}`;

  await fetch(url, { method: "DELETE" });
};
