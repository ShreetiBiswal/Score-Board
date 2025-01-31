import { useSelector } from "react-redux";
import appwriteServices from "../appwrite/services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const org = useSelector((state) => state.auth.org);
  const subClass = useSelector((state) => state.auth.subClass);
  const user = useSelector((state) => state.auth.user);
  const test = useSelector((state) => state.auth.test);
  const navigate = useNavigate();

  const [resultsMain, setResultsMain] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Set loading to true initially
  const [dltLoader,setDltLoader]=useState(false)

  useEffect(() => {
    verify();
    getResult();
  }, []);

  const verify = () => {
    if (!user || !org || !subClass || !test) {
      alert("Request denied");
      navigate("/");
    }
  };

  const getResult = async () => {
    try {
      if (org.ownerId === user.$id || subClass.admin === user.$id) {
        const results = await appwriteServices.getResultFromTest({ testId: test.$id });
        setResultsMain(results);
      } else {
        const result = await appwriteServices.getResultOfStudent({ testId: test.$id, studentId: user.$id });
        setResultsMain(result);
      }
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const deleteTest = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this test? This action cannot be undone.");
    if (!confirmation) return;

    try {
      setDltLoader(true);
      await appwriteServices.deleteTest({ testId: test.$id });
      setDltLoader(false);
      navigate(`/org/${org.name}/${subClass.name}`, { replace: true });
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Delete Button */}
      {(org?.ownerId === user?.$id || subClass?.admin === user?.$id) && (
        <div className="w-full max-w-5xl flex justify-end mb-4">
          <button
            onClick={deleteTest}
            disabled={dltLoader}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 transition-all transform hover:scale-105"
          >
            {dltLoader ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete Test"
            )}
          </button>
        </div>
      )}

      {/* Test Holder */}
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-500">
        <header className="bg-gradient-to-tr from-blue-400 to-blue-600 text-white p-4 relative flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center">{test?.name || "Test Details"}</h1>
          <p className="text-center text-sm mt-1">
            {test?.date ? new Date(test.date).toLocaleDateString() : "Date: N/A"}
          </p>
          <div className="flex justify-around mt-4 w-full">
            <p className="text-sm">
              <span className="font-semibold">Total Marks:</span> {test?.totalMarks || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Duration:</span> {test?.duration || "N/A"} mins
            </p>
          </div>
        </header>
        {error && (
          <div className="bg-red-100 text-red-600 text-center py-2 px-4 border border-red-300 rounded-lg mb-4">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 animate-spin text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span className="text-gray-600">Loading Results...</span>
            </div>
          </div>
        ) : resultsMain.length > 0 ? (
          <div className="p-6">
            <div className="overflow-auto max-h-96 border border-gray-200 rounded-lg">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-gray-800">
                    <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
                    {test.subNames && test.subNames.length > 1 ? (
                      test.subNames.slice(1).map((subName, index) => (
                        <th key={index} className="border border-gray-300 px-4 py-2 text-center">
                          {subName || <span className="font-bold">N/A</span>}
                        </th>
                      ))
                    ) : (
                      <th className="border border-gray-300 px-4 py-2 font-bold text-center">N/A</th>
                    )}
                    <th className="border border-gray-300 px-4 py-2 text-center">Total Marks</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsMain.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {result.student_Name || <span className="font-bold">N/A</span>}
                      </td>
                      {test.subNames.slice(1).map((_, i) => (
                        <td key={i} className="border border-gray-300 px-4 py-2 text-center">
                          {result.marks[i] || <span className="font-bold">N/A</span>}
                        </td>
                      ))}
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {result.marks
                          ? result.marks.filter(mark => !isNaN(parseInt(mark))) 
                          .reduce((a, b) => parseInt(a) + parseInt(b), 0)
                          : <span className="font-bold">N/A</span>}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {result.grade || <span className="font-bold">N/A</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-gray-700">No Results Available</p>
            <p className="text-gray-500 mt-2">Results for this test have not been uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
