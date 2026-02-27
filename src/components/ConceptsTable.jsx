function ConceptsTable({ concepts, onConceptChange, onAddConcept, onRemoveConcept, errors }) {
  return (
    <div className="space-y-4" data-error="concepts">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-1 bg-red-600 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-800">Screening Concepts <span className="text-red-500">*</span></h3>
      </div>
      {errors.concepts && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-2">
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>⚠️</span> {errors.concepts}
          </p>
        </div>
      )}
      <div className="overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Concept Topic</th>
              <th className="p-4 text-left font-semibold">Remark</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {concepts.map((concept, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-3">
                  <input
                    className={`w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all bg-white text-gray-900 placeholder-gray-400 ${
                      errors[`concept-${index}`] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Data Structures"
                    value={concept.topic}
                    onChange={(e) => onConceptChange(index, "topic", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    className={`w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all bg-white text-gray-900 placeholder-gray-400 ${
                      errors[`concept-${index}`] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your remark..."
                    value={concept.remark}
                    onChange={(e) => onConceptChange(index, "remark", e.target.value)}
                  />
                  {errors[`concept-${index}`] && (
                    <p className="text-red-600 text-xs mt-1">{errors[`concept-${index}`]}</p>
                  )}
                </td>
                <td className="p-3 text-center">
                  {concepts.length > 1 && (
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      onClick={() => onRemoveConcept(index)}
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
        onClick={onAddConcept}
      >
        <span>+</span> Add Concept
      </button>
    </div>
  );
}

export default ConceptsTable;
