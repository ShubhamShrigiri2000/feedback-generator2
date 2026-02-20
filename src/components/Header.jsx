import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="text-center mb-2">
        <h1 className="text-5xl font-extrabold mb-3">
          <span className="text-black">Neo</span>
          <span className="text-red-600">SOFT</span>
          <span className="text-black text-2xl align-super">®</span>
          <span className="text-black ml-4">Candidate Feedback</span>
        </h1>
        <div className="w-32 h-1 bg-red-600 mx-auto rounded-full"></div>
      </div>
      <p className="text-center text-gray-600 mt-4 text-lg">Generate professional feedback reports for candidates</p>

      <div className="mt-4 flex justify-center gap-4">
        <Link to="/" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">Form</Link>
        <Link to="/manage-skills" className="text-sm px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100">Manage Skills</Link>
      </div>
    </div>
  );
}

export default Header;
