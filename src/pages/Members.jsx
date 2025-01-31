import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import authService from "../appwrite/auth";
import MemberComponent from "../components/MemberComponent"; // Import the MemberComponent

const Members = () => {
  const org = useSelector((state) => state.auth.org);
  const currClass = useSelector((state) => state.auth.subClass);
  const user = useSelector((state) => state.auth.user);
  const [membersList, setMembersList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const isValid = user && (user.$id === org.ownerId || user.$id === currClass.admin);

  useEffect(() => {
    if (isValid) {
      getMembers();
    }
  }, [isValid]);

  const getMembers = async () => {
    try {
      const list = [];
      const idList = currClass.students;

      for (let i = 0; i < idList.length; i++) {
        if (idList[i] !== user.$id) {
          const nowMember = await authService.getUserById({ userId: idList[i] });
          list.push(nowMember);
        }
      }

      setMembersList(list);
      setLoading(false); // Stop loading once data is fetched
    } catch (error) {
      setError(error.message);
      setLoading(false); // Stop loading on error
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

      {/* Main Content */}
      <div className="border rounded-lg shadow-lg bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-gray-50">
          <h1 className="text-2xl font-bold">Class Members</h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              {/* Loading Spinner */}
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
                <span className="text-gray-600">Loading Members...</span>
              </div>
            </div>
          ) : (
            <div className="transition-opacity duration-500 opacity-100"> {/* Fade In Transition */}
              {membersList.length > 0 ? (
                <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersList.map((member, index) => (
                      <MemberComponent
                        key={member.$id}
                        userData={member}  // Pass member data to the MemberComponent
                        classId={currClass.$id}  // Pass the classId to the MemberComponent
                        setMembersList={setMembersList}  // Pass setMembersList if needed
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">No members found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
