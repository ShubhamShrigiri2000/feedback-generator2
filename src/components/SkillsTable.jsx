function SkillsTable({ skills, onSkillChange, onAddSkill, onRemoveSkill, errors }) {
  return (
    <div className="space-y-4" data-error="skills">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-1 bg-red-600 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-800">Technical Skills <span className="text-red-500">*</span></h3>
      </div>
      {errors.skills && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-2">
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>⚠️</span> {errors.skills}
          </p>
        </div>
      )}
      <div className="overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Skill Name</th>
              <th className="p-4 text-center font-semibold">Rating (1-5)</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {skills.map((skill, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-3">
                  <input
                    className={`w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all bg-white text-gray-900 placeholder-gray-400 ${
                      errors[`skill-${index}`] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., React, Node.js"
                    value={skill.name}
                    onChange={(e) => onSkillChange(index, "name", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className={`w-full p-2 border-2 rounded-lg text-center focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all bg-white text-gray-900 font-semibold placeholder-gray-400 ${
                      errors[`skill-${index}`] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1-5"
                    value={skill.rating}
                    onChange={(e) => onSkillChange(index, "rating", e.target.value)}
                  />
                  {errors[`skill-${index}`] && (
                    <p className="text-red-600 text-xs mt-1">{errors[`skill-${index}`]}</p>
                  )}
                </td>
                <td className="p-3 text-center">
                  {skills.length > 1 && (
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      onClick={() => onRemoveSkill(index)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
        onClick={onAddSkill}
      >
        <span>+</span> Add Skill
      </button>
    </div>
  );
}

export default SkillsTable;
