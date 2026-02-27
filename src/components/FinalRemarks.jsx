function FinalRemarks({ finalRemarks, onRemarksChange, errors }) {
  return (
    <div className="space-y-2" data-error="finalRemarks">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-1 bg-red-600 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-800">Final Remarks <span className="text-red-500">*</span></h3>
      </div>
      <textarea
        className={`w-full border-2 rounded-xl p-4 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 bg-white text-gray-900 shadow-sm hover:border-gray-400 resize-none placeholder-gray-400 ${
          errors.finalRemarks ? "border-red-500" : "border-gray-300"
        }`}
        rows="5"
        placeholder="Add your final remarks about the candidate..."
        value={finalRemarks}
        onChange={(e) => onRemarksChange(e.target.value)}
      />
      {errors.finalRemarks && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <span>⚠️</span> {errors.finalRemarks}
        </p>
      )}
    </div>
  );
}

export default FinalRemarks;
