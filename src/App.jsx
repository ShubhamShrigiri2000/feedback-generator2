import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [candidateName, setCandidateName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([{ name: "", rating: "" }]);
  const [concepts, setConcepts] = useState([{ topic: "", remark: "" }]);
  const [finalRemarks, setFinalRemarks] = useState("");
  const [errors, setErrors] = useState({});

  const today = new Date().toLocaleDateString();

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let newErrors = {};

    if (!candidateName.trim()) newErrors.candidateName = "Candidate name is required";
    if (!experience.trim()) newErrors.experience = "Experience is required";

    skills.forEach((skill, index) => {
      if (!skill.name.trim() || !skill.rating.trim()) {
        newErrors[`skill-${index}`] = "Skill name & rating required";
      } else if (skill.rating < 1 || skill.rating > 5) {
        newErrors[`skill-${index}`] = "Rating must be between 1-5";
      }
    });

    concepts.forEach((concept, index) => {
      if (!concept.topic.trim() || !concept.remark.trim()) {
        newErrors[`concept-${index}`] = "Concept topic & remark required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SKILLS ----------------
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
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
  };

  // ---------------- CONCEPTS ----------------
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
    const updated = concepts.filter((_, i) => i !== index);
    setConcepts(updated);
  };

  // ---------------- PDF ----------------
  const downloadPDF = async () => {
    if (!validate()) return;

    const input = document.getElementById("preview");
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfImgWidth = pdfWidth - margin * 2;
    const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", margin, margin, pdfImgWidth, pdfImgHeight);
    pdf.save(`${candidateName}_Feedback.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-black border-b-4 border-red-600 pb-2">
        Neosoft Candidate Feedback
      </h2>

      {/* Input Form */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Candidate Name */}
        <div>
          <input
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          {errors.candidateName && (
            <p className="text-red-600 text-sm mt-1">{errors.candidateName}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <textarea
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500"
            placeholder="Professional Experience"
            rows="4"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          {errors.experience && (
            <p className="text-red-600 text-sm mt-1">{errors.experience}</p>
          )}
        </div>

        {/* Technical Skills */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-2 border-l-4 border-red-600 pl-2">
            Technical Skills
          </h3>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-2 text-left">Skill</th>
                <th className="p-2 text-center">Rating (1-5)</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {skills.map((skill, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded-md"
                      value={skill.name}
                      onChange={(e) =>
                        handleSkillChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-full p-1 border rounded-md text-center"
                      value={skill.rating}
                      onChange={(e) =>
                        handleSkillChange(index, "rating", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    {skills.length > 1 && (
                      <button
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => removeSkill(index)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:shadow-lg"
            onClick={addSkill}
          >
            Add Skill
          </button>
        </div>

        {/* Screening Concepts */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-2 border-l-4 border-red-600 pl-2">
            Screening Concepts
          </h3>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-2 text-left">Concept</th>
                <th className="p-2 text-left">Remark</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {concepts.map((concept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded-md"
                      value={concept.topic}
                      onChange={(e) =>
                        handleConceptChange(index, "topic", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded-md"
                      value={concept.remark}
                      onChange={(e) =>
                        handleConceptChange(index, "remark", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    {concepts.length > 1 && (
                      <button
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => removeConcept(index)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:shadow-lg"
            onClick={addConcept}
          >
            Add Concept
          </button>
        </div>

        {/* Final Remarks */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-2 border-l-4 border-red-600 pl-2">
            Final Remarks
          </h3>
          <textarea
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500"
            rows="4"
            value={finalRemarks}
            onChange={(e) => setFinalRemarks(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button
            className="bg-black text-white px-6 py-3 mt-4 rounded shadow hover:shadow-lg hover:bg-gray-800"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* ---------------- Preview ---------------- */}
      <div
        id="preview"
        className="bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-10 p-10 space-y-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black border-b-2 border-red-600 pb-2">
            Neosoft Candidate Feedback
          </h2>
          <p className="text-sm text-gray-600">Date: {today}</p>
        </div>

        {/* Candidate Info */}
        <table className="w-full border rounded-lg overflow-hidden mb-6">
          <tbody>
            <tr>
              <td className="border p-3 font-semibold w-1/3">Candidate Name</td>
              <td className="border p-3">{candidateName || "-"}</td>
            </tr>
            <tr>
              <td className="border p-3 font-semibold">Professional Experience</td>
              <td className="border p-3 whitespace-pre-wrap">{experience || "-"}</td>
            </tr>
          </tbody>
        </table>

        {/* Technical Skills */}
        <h3 className="font-semibold text-lg mb-2 border-l-4 border-red-600 pl-2 text-black">
          Technical Skills
        </h3>
        <table className="w-full border rounded-lg overflow-hidden mb-6" border="1" cellPadding="8">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2 text-left">Skill</th>
              <th className="p-2 text-center">Rating (Out of 5)</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, i) => (
              <tr key={i} className="bg-white">
                <td className="border p-2">{skill.name || "-"}</td>
                <td className="border p-2 text-center">{skill.rating ? `${skill.rating}/5` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Screening Concepts */}
        <h3 className="font-semibold text-lg mb-2 border-l-4 border-red-600 pl-2 text-black">
          Screening Concepts
        </h3>
        <table className="w-full border rounded-lg overflow-hidden mb-6" border="1" cellPadding="8">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2 text-left">Concept</th>
              <th className="p-2 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {concepts.map((concept, i) => (
              <tr key={i} className="bg-white">
                <td className="border p-2">{concept.topic || "-"}</td>
                <td className="border p-2">{concept.remark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Final Remarks */}
        <h3 className="font-semibold text-lg mb-2 border-l-4 border-red-600 pl-2 text-black">
          Final Remarks
        </h3>
        <table className="w-full border rounded-lg overflow-hidden">
          <tbody>
            <tr>
              <td className="border p-3 whitespace-pre-wrap">{finalRemarks || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
