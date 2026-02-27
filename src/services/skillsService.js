
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
