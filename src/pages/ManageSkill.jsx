// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import * as skillsService from "../services/skillsService";
// import * as skillsHelper from "../utils/skillsHelper";
// import { showSuccess, showError } from "../utils/toast";
// import Header from "../components/Header";

// export default function ManageSkills() {
//   const navigate = useNavigate();

//   const DEPARTMENTS = [
//     { label: "JavaScript", value: "javascript" },
//     { label: "Java", value: "java" },
//     { label: ".NET", value: "dotnet" },
//     { label: "Python", value: "python" },
//     { label: "DevOps", value: "devops" },
//   ];

//   const [data, setData] = useState({ id: null, department: "javascript", skills: [] });
//   const [skillType, setSkillType] = useState('internal');
//   const [clients, setClients] = useState([]);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [newClientName, setNewClientName] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   // collapse state per-skill (keyed by skill index)
//   const [collapsed, setCollapsed] = useState({});
//   const skillNameRefs = useRef({});
//   const conceptRefs = useRef({});
//   const [highlight, setHighlight] = useState({});
//   const [lastInserted, setLastInserted] = useState(null);

//   useEffect(() => { loadInitial(); /* eslint-disable-line */ }, []);
//   useEffect(() => {
//     // whenever department / skillType / selectedClient changes, reload appropriate data
//     if (skillType === 'internal') {
//       if (data.department) loadSkillsByDepartment(data.department);
//     } else {
//       // client mode: if selectedClient is an existing id, load for that client; if creating new client, clear
//       if (selectedClient && selectedClient !== '__new__') {
//         loadSkillsByDepartment(data.department, selectedClient);
//       } else {
//         // new client - clear skills for editing
//         setData((d)=>({ ...d, skills: [] }));
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.department, skillType, selectedClient]);

//   const loadInitial = async () => {
//     // fetch available clients (from existing records)
//     try {
//       const all = await skillsService.getSkills();
//       const clientsMap = {};
//       (all || []).forEach((rec) => {
//         if (rec.clientId || rec.clientName) {
//           const id = rec.clientId || rec.clientName;
//           if (!clientsMap[id]) clientsMap[id] = { clientId: rec.clientId || id, clientName: rec.clientName || rec.clientId || id };
//         }
//       });
//       const list = Object.values(clientsMap);
//       setClients(list);
//     } catch (err) {
//       // ignore - clients optional
//     }
//     // initial load for default internal
//     if (skillType === 'internal') loadSkillsByDepartment(data.department);
//   };
//   useEffect(() => { if (!successMessage) return; const t = setTimeout(() => setSuccessMessage(""), 3000); return () => clearTimeout(t); }, [successMessage]);

//   const loadSkillsByDepartment = async (department, clientId) => {
//     try {
//       setIsLoading(true); setError(null); setValidationErrors([]);
//       const res = await skillsService.getSkillsByDepartment(department, clientId);
//       if (res && res.length > 0) setData(res[0]);
//       else setData({ id: null, department, skills: [] });
//     } catch (err) { console.error(err); setError("Failed to load skills for the selected department."); showError("Failed to load skills for the selected department."); }
//     finally { setIsLoading(false); }
//   };

//   const handleSave = async () => {
//     try {
//       setIsSaving(true); setValidationErrors([]); setError(null);
//       const errors = skillsHelper.validateSkillData(data);
//       if (errors.length > 0) { setValidationErrors(errors); return; }
//       // prepare payload - include client info when in client mode
//       const payload = { ...data };
//       if (skillType === 'client') {
//         if (selectedClient === '__new__') {
//           const cid = `client-${Date.now()}`;
//           payload.clientId = cid;
//           payload.clientName = newClientName || cid;
//           // add to local client list for subsequent selection
//           setClients((c)=>[...c, { clientId: cid, clientName: payload.clientName }]);
//           setSelectedClient(cid);
//         } else if (selectedClient) {
//           const found = clients.find(c=>c.clientId === selectedClient);
//           payload.clientId = selectedClient;
//           payload.clientName = found ? found.clientName : selectedClient;
//         }
//       } else {
//         // ensure no client fields for internal mode
//         delete payload.clientId; delete payload.clientName;
//       }

//       if (data.id) { await skillsService.updateSkills(data.id, payload); setSuccessMessage("✓ Skills updated successfully!"); showSuccess("Skills updated"); }
//       else { const created = await skillsService.createSkills(payload); setData(created); setSuccessMessage("✓ Skills created successfully!"); showSuccess("Skills created"); }
//     } catch (err) { console.error(err); setError("Failed to save skills. Please try again."); showError("Failed to save skills. Please try again."); }
//     finally { setIsSaving(false); }
//   };

//   const addSkill = () => {
//     const firstEmpty = (data.skills || []).findIndex((s) => !s.name || !s.name.trim());
//     if (firstEmpty !== -1) { setLastInserted({ type: 'skill', skillIndex: firstEmpty }); setCollapsed((c)=>({ ...c, [firstEmpty]: false })); return; }
//     const newIndex = 0;
//     setData((p) => skillsHelper.insertSkillHelper(p, newIndex));
//     setLastInserted({ type: 'skill', skillIndex: newIndex });
//     setCollapsed((c) => ({ ...c, [newIndex]: false }));
//   };
//   const removeSkill = (si) => { setDeleteConfirm(null); setData((p) => skillsHelper.removeSkillHelper(p, si)); };
//   const updateSkillName = (si, value) => setData((p) => skillsHelper.updateSkillNameHelper(p, si, value));

//   const addConcept = (si) => {
//     const concepts = (data.skills?.[si]?.concepts) || [];
//     const emptyIdx = concepts.findIndex((c) => !c || !c.toString().trim());
//     if (emptyIdx !== -1) { setLastInserted({ type: 'concept', skillIndex: si, conceptIndex: emptyIdx }); setCollapsed((c)=>({ ...c, [si]: false })); return; }
//     setData((p) => skillsHelper.insertConceptHelper(p, si, 0));
//     setLastInserted({ type: 'concept', skillIndex: si, conceptIndex: 0 });
//     setCollapsed((c) => ({ ...c, [si]: false }));
//   };
//   const updateConcept = (si, ci, value) => setData((p) => skillsHelper.updateConceptHelper(p, si, ci, value));
//   const removeConcept = (si, ci) => { setDeleteConfirm(null); setData((p) => skillsHelper.removeConceptHelper(p, si, ci)); };

//   const insertSkillAfter = (si) => {
//     const newIndex = si + 1;
//     setData((p) => skillsHelper.insertSkillHelper(p, newIndex));
//     setLastInserted({ type: 'skill', skillIndex: newIndex });
//     setCollapsed((c) => ({ ...c, [newIndex]: false }));
//   };

//   const insertConceptAfter = (si, ci) => {
//     const concepts = (data.skills?.[si]?.concepts) || [];
//     const idx = Math.max(0, Math.min(ci + 1, concepts.length));
//     const emptyIdx = concepts.findIndex((c) => !c || !c.toString().trim());
//     if (emptyIdx !== -1) { setLastInserted({ type: 'concept', skillIndex: si, conceptIndex: emptyIdx }); setCollapsed((c)=>({ ...c, [si]: false })); return; }
//     setData((p) => skillsHelper.insertConceptHelper(p, si, idx));
//     setLastInserted({ type: 'concept', skillIndex: si, conceptIndex: idx });
//     setCollapsed((c) => ({ ...c, [si]: false }));
//   };

//   // Toggle collapse for a skill (preserve other skills' state)
//   const toggleSkill = (si) => setCollapsed((prev) => ({ ...prev, [si]: !prev[si] }));

//   // keep collapse state keys in sync with skills length, preserve existing values
//   const skillsLen = (data.skills || []).length;
//   useEffect(() => {
//     setCollapsed((prev) => {
//       const next = {};
//       (data.skills || []).forEach((_, i) => {
//         next[i] = Object.prototype.hasOwnProperty.call(prev, i) ? prev[i] : false; // default collapsed = false
//       });
//       return next;
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [skillsLen]);

//   useEffect(()=>{
//     if (!lastInserted) return;
//     const id = `${lastInserted.type}-${lastInserted.skillIndex}${lastInserted.conceptIndex !== undefined ? `-${lastInserted.conceptIndex}` : ''}`;
//     setHighlight((h)=>({ ...h, [id]: true }));
//     requestAnimationFrame(()=>{
//       if (lastInserted.type === 'skill'){
//         const el = skillNameRefs.current[lastInserted.skillIndex];
//         if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
//       } else if (lastInserted.type === 'concept'){
//         const el = conceptRefs.current[`${lastInserted.skillIndex}-${lastInserted.conceptIndex}`];
//         if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
//       }
//     });
//     const t = setTimeout(()=>{ setHighlight((h)=>{ const copy = { ...h }; delete copy[id]; return copy; }); setLastInserted(null); }, 1200);
//     return ()=>clearTimeout(t);
//   }, [lastInserted]);

//   if (isLoading) return (
//     <div className="min-h-screen bg-white py-8 px-4"><Header /><div className="max-w-5xl mx-auto flex items-center justify-center py-32"><div className="flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-r-transparent"></div><p className="text-gray-600 font-medium">Loading skills...</p></div></div></div>
//   );

//   return (
//     <div className="min-h-screen bg-white py-8 px-4">
//       <Header />
//       <div className="max-w-5xl mx-auto">
//         <div className="mb-6 flex justify-between items-center">
//           <button onClick={() => navigate("/")} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">Back to Form</button>
//         </div>

//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Manage Skills</h1>
//           <p className="text-gray-600">Organize and manage technical skills and concepts</p>
//         </div>

//         {error && <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">{error}</div>}
//         {validationErrors.length > 0 && (
//           <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"><p className="font-semibold text-yellow-800 mb-2">⚠️ Please fix the following errors:</p><ul className="space-y-1">{validationErrors.map((e,i)=>(<li key={i} className="text-yellow-700 text-sm">{e}</li>))}</ul></div>
//         )}
//         {successMessage && <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700">{successMessage}</div>}

//         <div className="bg-white shadow rounded-2xl border-2 border-gray-200 p-8">
//           <div className="mb-8 pb-8 border-b-2 border-gray-200">
//             <div className="mb-4 flex items-center gap-6">
//               <div className="flex items-center gap-3">
//                 <label className="font-medium">Skill Type:</label>
//                 <label className="flex items-center gap-2"><input type="radio" name="skillType" checked={skillType==='internal'} onChange={()=>{ setSkillType('internal'); setSelectedClient(null); setNewClientName(''); }} /> Internal</label>
//                 <label className="flex items-center gap-2"><input type="radio" name="skillType" checked={skillType==='client'} onChange={()=>{ setSkillType('client'); setSelectedClient(clients && clients.length>0 ? clients[0].clientId : '__new__'); }} /> Client</label>
//               </div>
//             </div>

//             {skillType === 'client' && (
//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
//                 <select value={selectedClient || '__new__'} onChange={(e)=>setSelectedClient(e.target.value)} className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white">
//                   {clients.map(c=> (<option key={c.clientId} value={c.clientId}>{c.clientName}</option>))}
//                   <option value="__new__">+ Add new client...</option>
//                 </select>
//                 {selectedClient === '__new__' && (
//                   <input value={newClientName} onChange={(e)=>setNewClientName(e.target.value)} placeholder="New client name" className="mt-3 w-full border-2 border-gray-300 rounded-xl p-3" />
//                 )}
//               </div>
//             )}

//             <label className="block text-sm font-semibold text-gray-700 mb-3">Department <span className="text-red-500">*</span></label>
//             <select value={data.department} onChange={(e)=>setData({...data, department: e.target.value})} className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-red-600 bg-white">
//               {DEPARTMENTS.map(d=> (<option key={d.value} value={d.value}>{d.label}</option>))}
//             </select>
//           </div>

//           <div className="mb-6"><button onClick={addSkill} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg">+ Add Skill</button></div>

//           {data.skills && data.skills.length > 0 ? (
//             <div className="space-y-4">
//               {data.skills.map((skill, si) => (
//                 <div key={skill.id || si} className={`border-2 border-gray-200 rounded-xl overflow-hidden ${highlight[`skill-${si}`] ? 'ring-4 ring-yellow-200' : ''}`}>
//                   {/* Skill header - clickable to toggle collapse */}
//                   <div role="button" tabIndex={0} onClick={() => toggleSkill(si)} onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' ') toggleSkill(si); }} className="p-4 flex items-center justify-between bg-gray-50 cursor-pointer">
//                     <div className="flex items-center gap-3">
//                       <div className="w-3 h-3 rounded-full bg-red-600" />
//                       <div className="font-medium text-gray-900">{skill.name || 'Untitled skill'}</div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button onClick={(e)=>{ e.stopPropagation(); setDeleteConfirm(`skill-${si}`); }} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
//                       <button onClick={(e)=>{ e.stopPropagation(); insertSkillAfter(si); }} title="Add skill below" className="px-3 py-1 bg-green-600 text-white rounded">＋</button>
//                       <button onClick={(e)=>{ e.stopPropagation(); toggleSkill(si); }} className="px-3 py-1 bg-gray-200 rounded">{collapsed[si] ? 'Expand' : 'Collapse'}</button>
//                     </div>
//                   </div>

//                   {deleteConfirm===`skill-${si}` && (
//                     <div className="p-4 bg-red-50 border-t-2 border-red-200 flex items-center justify-between">
//                       <p className="text-red-700">Delete this skill and its concepts?</p>
//                       <div className="flex gap-2"><button onClick={()=>setDeleteConfirm(null)} className="px-3 py-1 bg-gray-600 text-white rounded">Cancel</button><button onClick={()=>removeSkill(si)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button></div>
//                     </div>
//                   )}

//                   {!collapsed[si] && (
//                     <div className="p-5 border-t-2 border-gray-200 space-y-4">
//                       <div className="flex items-center gap-3">
//                         <input ref={(el)=>{ if(el) skillNameRefs.current[si]=el; }} value={skill.name} onChange={(e)=>updateSkillName(si, e.target.value)} placeholder="Skill name" className={`flex-1 bg-white border-2 border-gray-300 rounded-lg p-3 ${highlight[`skill-${si}`] ? 'ring-2 ring-yellow-300' : ''}`} />
//                       </div>

//                       {/* Concepts inline list */}
//                       <div className="space-y-2">
//                         {(skill.concepts || []).length > 0 ? (
//                           (skill.concepts || []).map((concept, ci) => (
//                             <div key={ci} className={`flex items-center gap-3 ${highlight[`concept-${si}-${ci}`] ? 'ring-2 ring-yellow-300 rounded-md' : ''}`}>
//                               <input ref={(el)=>{ if(el) conceptRefs.current[`${si}-${ci}`]=el; }} value={concept} onChange={(e)=>updateConcept(si, ci, e.target.value)} placeholder="Concept" className="flex-1 bg-white border-2 border-gray-300 rounded-lg p-2" />
//                               <div className="flex gap-2">
//                                 <button onClick={()=>setDeleteConfirm(`concept-${si}-${ci}`)} className="px-2 py-1 bg-red-600 text-white rounded">✕</button>
//                                 <button onClick={()=>insertConceptAfter(si, ci)} className="px-2 py-1 bg-green-600 text-white rounded">＋</button>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-gray-400 italic">No concepts yet.</p>
//                         )}

//                         <div>
//                           <button onClick={()=>addConcept(si)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg">+ Add Concept</button>
//                         </div>
//                       </div>

//                       {deleteConfirm?.startsWith(`concept-${si}-`) && (
//                         <div className="bg-red-50 border-2 border-red-200 p-3 rounded mt-2 flex items-center justify-between">
//                           <p className="text-red-700">Delete this concept?</p>
//                           <div className="flex gap-2"><button onClick={()=>setDeleteConfirm(null)} className="px-3 py-1 bg-gray-600 text-white rounded">Cancel</button><button onClick={()=>{ const parts = deleteConfirm.split("-"); const ci = parseInt(parts[2]); removeConcept(si, ci); }} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button></div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"><p className="text-gray-500">No skills added yet</p></div>
//           )}

//           <div className="mt-8 flex gap-4 justify-end">
//             <button onClick={()=>loadSkillsByDepartment(data.department)} disabled={isSaving} className="px-6 py-3 bg-gray-600 text-white rounded-lg">↻ Refresh</button>
//             <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-red-600 text-white rounded-lg">{isSaving?"Saving...": data.id?"Update Skills":"Create Skills"}</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




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
