function Preview({
  candidateName,
  clientName,
  experience,
  skills,
  concepts,
  finalRemarks,
  date,
  showTitle = true,
}) {
  console.log("Preview props:", {
    candidateName,
    clientName,
    experience,
    skills,
    concepts,
    finalRemarks,
    date,
  });
  return (
    <div className="max-w-5xl mx-auto mb-8">
      {showTitle && (
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Preview</h2>
          <p className="text-gray-600">
            This is how your feedback will look in the PDF
          </p>
        </div>
      )}
      <div
        id="preview"
        className="bg-white shadow-2xl rounded-2xl p-10 space-y-8 border-4 border-gray-200"
      >
        {/* Header */}
        <div className="border-b-4 border-red-600 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold">
              <span className="text-black">Neo</span>
              <span className="text-red-600">SOFT</span>
              <span className="text-black text-xl align-super">®</span>
              <span className="text-black ml-3">Candidate Feedback</span>
            </h2>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-600">Date</p>
              <p className="text-sm text-gray-800">{date}</p>
            </div>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Candidate Information
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-700 w-1/3 bg-white/50 rounded-tl-lg">
                    Candidate Name
                  </td>
                  <td className="p-4 text-gray-800 bg-white/30">
                    {candidateName || "-"}
                  </td>
                </tr>
                {clientName && (
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-gray-700 w-1/3 bg-white/50 rounded-tl-lg">
                      Client Name
                    </td>
                    <td className="p-4 text-gray-800 bg-white/30">
                      {clientName || "-"}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-white/50 rounded-bl-lg">
                    Professional Experience
                  </td>
                  <td className="p-4 text-gray-800 bg-white/30 whitespace-pre-wrap">
                    {experience || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="h-8 w-1 bg-red-600 rounded-full"></div>
            Technical Skills
          </h3>
          <div className="overflow-hidden rounded-xl border-2 border-gray-200">
            <table className="w-full" border="1" cellPadding="8">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Skill</th>
                  <th className="p-3 text-center font-semibold">
                    Rating (Out of 5)
                  </th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-200 p-3 text-gray-800 font-medium">
                      {skill.name || "-"}
                    </td>
                    <td className="border border-gray-200 p-3 text-center font-semibold text-red-600">
                      {skill.rating ? `${skill.rating}/5` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Screening Concepts */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="h-8 w-1 bg-red-600 rounded-full"></div>
            Screening Concepts
          </h3>
          <div className="overflow-hidden rounded-xl border-2 border-gray-200">
            <table className="w-full" border="1" cellPadding="8">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Concept</th>
                  <th className="p-3 text-left font-semibold">Remark</th>
                </tr>
              </thead>
              <tbody>
                {concepts.map((concept, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-200 p-3 text-gray-800 font-medium">
                      {concept.topic || "-"}
                    </td>
                    <td className="border border-gray-200 p-3 text-gray-700">
                      {concept.remark || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Remarks */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="h-8 w-1 bg-red-600 rounded-full"></div>
            Final Remarks
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {finalRemarks || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
