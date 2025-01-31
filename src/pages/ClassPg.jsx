import { useEffect, useState } from 'react';
import TestHolder from '../components/TestHolder';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import appwriteServices from '../appwrite/services';
import SubHolder from '../components/SubHolder';
import { exitTest, exitClass, exitOrg } from '../store/authSlice';

const ClassPg = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currClass = useSelector((state) => state.auth.subClass);
  const org = useSelector((state) => state.auth.org);
  const usr = useSelector((state) => state.auth.user);
  const isOwner = org.ownerId == usr.$id || usr.$id == currClass.admin;
  const [displayContent, setDisplayContent] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [classTests, setClassTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!org || !currClass) {
      alert("Error!! No local class found");
      navigate("/");
    }
    dispatch(exitTest());
    getClassTests();
    getSubjects();
  }, []);

  const getClassTests = async () => {
    try {
      const tests = await appwriteServices.getTestFromClass({ classId: currClass.$id });
      setClassTests(tests);
    } catch (error) {
      setError(error.message);
    }
  };

  const getSubjects = async () => {
    try {
      const subjects = await appwriteServices.getSubFromClass({ classId: currClass.$id });
      setSubjects(subjects);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currClass.$id);
    alert("Class ID copied to clipboard!");
  };

  const deleteClass = async () => {
    setLoading(true);
    setError("");
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete the class? This action cannot be undone."
      );
      if (!confirm) return;
      await appwriteServices.deleteClass({ classId: currClass.$id });
      dispatch(exitClass());
      dispatch(exitOrg());
      navigate(`/`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const redirectToMembers = () => {
    navigate(`/org/${org.name}/${currClass.name}/members`);
  };

  const leaveClass = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to leave this class? This action cannot be undone."
    );
    if (!confirmation) return;

    setLoading(true);
    setError("");
    try {
      await appwriteServices.leaveClass({ classId: currClass.$id, userId: usr.$id });
      dispatch(exitOrg());
      dispatch(exitClass());
      navigate(`/`, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-3/4 sm:w-1/2 lg:w-1/3 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Class ID</h2>
            <p className="text-gray-700 break-all">{currClass.$id}</p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="border rounded-lg shadow-lg bg-white">
        {/* Header with Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-gray-50">
          <h1 className="text-2xl font-bold">Class Management</h1>
          <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
            {isOwner ? (
              <>
                <button
                  onClick={() => setShowPopup(!showPopup)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow focus:outline-none focus:ring-2"
                >
                  Show Class ID
                </button>
                <button
                  onClick={deleteClass}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  {loading ? "Deleting..." : "Delete Class"}
                </button>
                <button
                  onClick={redirectToMembers}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow focus:outline-none focus:ring-2"
                >
                  Members
                </button>
              </>
            ) : (
              <button
                onClick={leaveClass}
                disabled={loading}
                className={`px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
              >
                {loading ? "Leaving..." : "Leave Class"}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-100">
          <div
            onClick={() => setDisplayContent("subjects")}
            className={`flex-grow text-center cursor-pointer py-2 border-b-4 ${
              displayContent === "subjects"
                ? "border-green-500 text-green-700"
                : "border-gray-300 text-gray-600"
            }`}
          >
            <h1 className="text-lg font-semibold">Subjects</h1>
          </div>
          <div
            onClick={() => setDisplayContent("classTests")}
            className={`flex-grow text-center cursor-pointer py-2 border-b-4 ${
              displayContent === "classTests"
                ? "border-blue-500 text-blue-700"
                : "border-gray-300 text-gray-600"
            }`}
          >
            <h1 className="text-lg font-semibold">Class Tests</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {displayContent === "subjects" && <SubHolder subjects={subjects} />}
          {displayContent === "classTests" && <TestHolder tests={classTests} />}
        </div>
      </div>
    </div>
  );
};

export default ClassPg;
