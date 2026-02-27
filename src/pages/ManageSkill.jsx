import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as skillsService from "../services/skillsService";
import Header from "../components/Header";
import Box from "../components/ui/Box";
import Stack from "../components/ui/Stack";
import Card from "../components/ui/Card";
import Paper from "../components/ui/Paper";
import Typography from "../components/ui/Typography";
import IconButton from "../components/ui/IconButton";
import { showSuccess, showError } from "../utils/toast";

export default function ManageSkills() {
  const navigate = useNavigate();

  const DEPARTMENTS = [
    { label: "JavaScript", value: "javascript" },
    { label: "Java", value: "java" },
    { label: ".NET", value: "dotnet" },
    { label: "Python", value: "python" },
    { label: "DevOps", value: "devops" },
  ];

  const [skillType, setSkillType] = useState("internal");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClientName, setNewClientName] = useState("");

  const [data, setData] = useState({
    id: null,
    department: "javascript",
    skills: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /* ---------------- LOAD CLIENT LIST ---------------- */
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const all = await skillsService.getSkills("client");

      const map = {};
      (all || []).forEach((r) => {
        if (r.clientId) {
          map[r.clientId] = {
            clientId: r.clientId,
            clientName: r.clientName || r.clientId,
          };
        }
      });

      setClients(Object.values(map));
    } 
    catch (err) {
      console.error("Error loading clients:", err);
    }
  };

  /* ---------------- LOAD SKILLS ---------------- */
  useEffect(() => {
    loadSkills();
    // eslint-disable-next-line
  }, [data.department, skillType, selectedClient]);

  const loadSkills = async () => {
    try {
      setIsLoading(true);

      const res = await skillsService.getSkillsByDepartment(
        data.department,
        selectedClient,
        skillType
      );

      if (res?.length) setData(res[0]);
      else
        setData({
          id: null,
          department: data.department,
          skills: [],
        });
    } catch {
      showError("Load failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload = {
        ...data,
        id: data.id || Date.now().toString(),
      };

      if (skillType === "client") {
        if (selectedClient === "__new__") {
          const cid = `client-${Date.now()}`;
          payload.clientId = cid;
          payload.clientName = newClientName || cid;
        } else {
          const found = clients.find((c) => c.clientId === selectedClient);
          payload.clientId = selectedClient;
          payload.clientName = found?.clientName;
        }
      } else {
        delete payload.clientId;
        delete payload.clientName;
      }

      if (data.id) {
        await skillsService.updateSkills(data.id, payload, skillType);
        showSuccess("Updated");
      } else {
        const created = await skillsService.createSkills(payload, skillType);
        setData(created);
        showSuccess("Created");
      }

      loadClients();
    } catch {
      showError("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  const addSkill = () => {
    setData((p) => ({
      ...p,
      skills: [...(p.skills || []), { id: Date.now(), name: "", concepts: [] }],
    }));
  };

  const updateSkill = (i, value) => {
    const copy = [...data.skills];
    copy[i].name = value;
    setData({ ...data, skills: copy });
  };

  const addConcept = (i) => {
    const copy = Array.isArray(data.skills) ? [...data.skills] : [];
    const skill = copy[i] ? { ...copy[i] } : { id: Date.now().toString(), name: "", concepts: [] };
    const concepts = Array.isArray(skill.concepts) ? [...skill.concepts, ""] : [""];
    skill.concepts = concepts;
    copy[i] = skill;
    setData({ ...data, skills: copy });
  };

  const updateConcept = (si, ci, value) => {
    const copy = Array.isArray(data.skills) ? [...data.skills] : [];
    const skill = copy[si] ? { ...copy[si] } : null;
    if (!skill) return;
    const concepts = Array.isArray(skill.concepts) ? [...skill.concepts] : [];
    concepts[ci] = value;
    skill.concepts = concepts;
    copy[si] = skill;
    setData({ ...data, skills: copy });
  };

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <Header />

      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Back
        </button>

        {/* TYPE */}
        <div className="flex gap-6">
          <label>
            <input
              type="radio"
              checked={skillType === "internal"}
              onChange={() => setSkillType("internal")}
            />{" "}
            Internal
          </label>

          <label>
            <input
              type="radio"
              checked={skillType === "client"}
              onChange={() => {
                setSkillType("client");
                setSelectedClient(
                  clients?.length ? clients[0].clientId : "__new__"
                );
              }}
            />{" "}
            Client
          </label>
        </div>

        {/* CLIENT */}
        {skillType === "client" && (
          <>
            <select
              value={selectedClient || "__new__"}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="border p-2"
            >
              {clients.map((c) => (
                <option key={c.clientId} value={c.clientId}>
                  {c.clientName}
                </option>
              ))}
              <option value="__new__">+ Add new</option>
            </select>

            {selectedClient === "__new__" && (
              <input
                placeholder="Client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="border p-2 w-full"
              />
            )}
          </>
        )}

        {/* DEPARTMENT */}
        <select
          value={data.department}
          onChange={(e) =>
            setData({ ...data, department: e.target.value })
          }
          className="border p-2 w-full"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* SKILLS */}
        <div className="mb-6">
          <button
            onClick={addSkill}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            + Add Skill
          </button>
        </div>

        {data.skills.map((s, si) => (
          <Card key={s.id} className="relative">
            <Box className="flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <input
                  value={s.name}
                  onChange={(e) => updateSkill(si, e.target.value)}
                  placeholder="Skill name"
                  className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </Box>
              <Box className="flex items-center gap-2">
                <IconButton
                  onClick={() => {
                    if (!window.confirm('Delete this skill and its concepts?')) return;
                    const copy = Array.isArray(data.skills) ? [...data.skills] : [];
                    copy.splice(si, 1);
                    setData({ ...data, skills: copy });
                  }}
                  className="bg-red-600 text-white"
                  aria-label="Remove skill"
                >
                  ✕
                </IconButton>
                <button onClick={() => addConcept(si)} className="px-3 py-1 bg-green-600 text-white rounded">＋</button>
              </Box>
            </Box>

            <Box className="mt-3">
              {(s.concepts || []).map((c, ci) => (
                <div
                  key={ci}
                  className="flex items-center gap-2 mt-2 pl-6 py-2 border-b border-gray-100 last:border-b-0"
                >
                  <input
                    value={c}
                    onChange={(e) => updateConcept(si, ci, e.target.value)}
                    placeholder="Concept"
                    className="flex-1 bg-white border border-gray-300 rounded-md px-2 text-sm h-9 leading-5"
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (!window.confirm('Delete this concept?')) return;
                      const skillsCopy = Array.isArray(data.skills) ? [...data.skills] : [];
                      const concepts = Array.isArray(skillsCopy[si].concepts) ? [...skillsCopy[si].concepts] : [];
                      concepts.splice(ci, 1);
                      skillsCopy[si] = { ...skillsCopy[si], concepts };
                      setData({ ...data, skills: skillsCopy });
                    }}
                    className="text-red-600"
                    aria-label="Remove concept"
                  >
                    ✕
                  </IconButton>
                </div>
              ))}
            </Box>
          </Card>
        ))}

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-red-600 text-white rounded-lg"
        >
          {isSaving ? "Saving..." : data.id ? "Update Skills" : "Create Skills"}
        </button>
      </div>
    </div>
  );
}
