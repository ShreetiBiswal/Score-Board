import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import appwriteServices from '../appwrite/services.js';
import { exitClass } from '../store/authSlice.js';
import { useForm } from 'react-hook-form';
import authService from '../appwrite/auth.js';
import { FaCog } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ClassComp from '../components/ClassComp.jsx';

const Org = () => {
  const org = useSelector((state) => state?.auth?.org);
  const userId = useSelector((state) => state?.auth?.user?.$id);
  const isOwner = (org?.ownerId === userId);
  const [isOpen, setIsOpen] = useState(false);
  const [classList, setClassList] = useState([]);
  const [error, setError] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [load2,setLoad2]=useState(false)
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const getClasses = async () => {
    if (!org) {
      setLoading(false);
      return;
    }
    
    try {
      const classes = await appwriteServices.getClassFromOrg({ orgId: org.$id });
      setClassList(isOwner ? classes : classes.filter((c) => c.students.includes(userId)));
    } catch (err) {
      setError("Failed to fetch classes.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    dispatch(exitClass());
    getClasses();
  }, []);

  const createClass = async ({ name, adminMail }) => {
    try {
      if (classList.some(cls => cls.name === name)) throw new Error("Class with same name exists");
      const admin = await authService.getUserByEmail({ email: adminMail });
      if (!org.members.includes(admin.$id)) throw new Error("Admin is not a member of the org");
      
      const same=admin.$id==org.ownerId

      const newClass = await appwriteServices.createClass({ name, orgId: org.$id, admin:admin.$id, students: !same?[admin.$id, org.ownerId]:[admin.$id] });
      setClassList(prev => [...prev, newClass]);
      setError("");
      setIsOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(org.$id)
      .then(() => alert('Org ID copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const deleteOrg = async () => {
    try {
      await appwriteServices.deleteOrg({ orgId: org.$id });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const leaveOrg = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to leave this organization? This action cannot be undone."
    );
    if (!confirmation) return;
  
    setLoad2(true); // Start loading
    setError(""); // Reset error state
    try {
      await appwriteServices.exitOrg({ orgId: org.$id, userId });
      dispatch(exitClass());
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoad2(false); // Stop loading
    }
  };
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="border rounded-lg shadow-lg p-6 bg-white">
        {/* Organization Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded-lg shadow-lg mb-3">
  <div className="flex items-center space-x-4">
  

    {/* Organization Name and Address */}
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        {org?.name || "Unnamed Organization"}
      </h1>
      <p className="text-lg sm:text-xl text-gray-100 font-light mt-1">
        {org?.address || "No address provided"}
      </p>
    </div>
  </div>
</div>

  
        {/* Header with Buttons */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-lg font-semibold text-gray-800">All Classes</h2>
          <div className="flex flex-wrap items-center gap-4">
            {isOwner ? (
              <>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md transition hover:bg-blue-600"
                >
                  + Add Class
                </button>
                <button
  onClick={() => setIsSettingsOpen(true)}
  className="flex items-center justify-center bg-gray-100 border border-gray-300 p-2 rounded-lg shadow-md hover:bg-gray-200"
>
  <FaCog className="w-5 h-5" />
</button>
              </>
            ) : (
              <button
                onClick={leaveOrg}
                disabled={load2}
                className={`bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md transition hover:bg-yellow-600 ${
                  load2 ? "cursor-not-allowed" : ""
                }`}
              >
                {load2 ? (
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
                    <span>Leaving...</span>
                  </div>
                ) : (
                  "Leave Organization"
                )}
              </button>
            )}
          </div>
        </header>
  
        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="loader"></div>
          </div>
        ) : classList.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No classes available. {isOwner ? "Please add a new class." : "Join a class."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classList.map((cls) => (
              <div key={cls.$id} className="p-4 border rounded-lg bg-gray-100 transition hover:shadow-lg">
                <ClassComp classObj={cls} />
              </div>
            ))}
          </div>
        )}
  
        {/* Settings Modal */}
        {isOwner && isSettingsOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Organization Settings</h2>
              <div className="mb-4">
                <span className="font-medium">Org ID:</span>
                <span className="ml-2">{org.$id}</span>
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg transition hover:bg-blue-600"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={deleteOrg}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg transition hover:bg-red-600"
                >
                  Delete Org
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Add Class Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit(createClass)}
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            >
              <h2 className="text-xl font-bold mb-4">Add a New Class</h2>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="name">
                  Class Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="adminMail">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="adminMail"
                  {...register("adminMail", { required: true })}
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError("");
                  }}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg transition hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Org;
