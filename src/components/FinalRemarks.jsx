function FinalRemarks({ finalRemarks, onRemarksChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-1 bg-red-600 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-800">Final Remarks</h3>
      </div>
      <textarea
        className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 bg-white text-gray-900 shadow-sm hover:border-gray-400 resize-none placeholder-gray-400"
        rows="5"
        placeholder="Add your final remarks about the candidate..."
        value={finalRemarks}
        onChange={(e) => onRemarksChange(e.target.value)}
      />
    </div>
  );
}

export default FinalRemarks;
