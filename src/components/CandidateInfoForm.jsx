function CandidateInfoForm({ candidateName, experience, errors, onNameChange, onExperienceChange }) {
  return (
      <>
        {/* Candidate Name */}
        <div className="space-y-2" data-error="candidateName">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Candidate Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full border-2 rounded-xl p-4 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 bg-white text-gray-900 shadow-sm hover:border-gray-400 placeholder-gray-400 ${
              errors.candidateName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(e) => onNameChange(e.target.value)}
          />
          {errors.candidateName && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.candidateName}
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="space-y-2" data-error="experience">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Professional Experience <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full border-2 rounded-xl p-4 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 bg-white text-gray-900 shadow-sm hover:border-gray-400 resize-none placeholder-gray-400 ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe the candidate's professional experience..."
            rows="4"
            value={experience}
            onChange={(e) => onExperienceChange(e.target.value)}
          />
          {errors.experience && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.experience}
            </p>
          )}
        </div>
      </>
  );
}

export default CandidateInfoForm;
