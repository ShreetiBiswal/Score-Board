import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import appwriteServices from '../appwrite/services.js';
import { useSelector, useDispatch } from 'react-redux';
import { exitOrg } from "../store/authSlice.js";
import OrgComp from "../components/OrgComp.jsx";
import ClassComp from '../components/ClassComp.jsx';

const Home = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false); 
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState("");
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const { register, handleSubmit } = useForm();
  const user = useSelector((state) => state.auth.user);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [creatingOrgInProgress, setCreatingOrgInProgress] = useState(false);
  const [searchedItem, setSearchedItem] = useState(null);
  const [searchedType, setSearchedType] = useState("orgId");

  // Function to fetch all organizations the user is part of
  const getAllOrgs = async () => {
    setLoadingOrgs(true);
    const listOrgs = [];
    if (userDetails) {
      for (const id in userDetails.orgs) {
        const org = await appwriteServices.getOrg({ orgId: userDetails.orgs[id] });
        if (org.name) {
          listOrgs.push(org);
        }
      }
      setOrgs(listOrgs);
    }
    setLoadingOrgs(false);
  };

  // Effect to fetch organizations when the component mounts or user details change
  useEffect(() => {
    dispatch(exitOrg());
    getAllOrgs();
  }, [dispatch, userDetails]);

  // Function to create a new organization
  const createOrg = async ({ name, address }) => {
    setCreatingOrgInProgress(true);
    try {
      // Check for duplicate organization names
      for (let curOrg in orgs) {
        if (orgs[curOrg].name === name) throw new Error("Org with same name exists");
      }
      // Create the new organization
      const newOrg = await appwriteServices.createOrg({ name, address, ownerId: user.$id });
      const newList = [...orgs, newOrg];
      setOrgs(newList);
      setError("");
      setCreatingOrgInProgress(false);
      setIsOpen(false);
    } catch (error) {
      setError(error.message);
      setCreatingOrgInProgress(false);
    }
  };

  // Function to handle search submissions
  const handleSearchClick = async ({ searched, searchType }) => {
    setError("");
    setIsSearchPopupOpen(true); 
    setSearchedType(searchType);
    try {
      if (!searched) throw new Error("Empty ID");

      let result;

      // Determine which type of search to perform
      if (searchType === "orgId") {
        if (userDetails.orgs.includes(searched)) throw new Error("You are already a part of this org");
        result = await appwriteServices.getOrg({ orgId: searched });
      } else if (searchType === 'classId') {
        result = await appwriteServices.getClass({ classId: searched });
      }

      if (!result) throw new Error("Unexpected Error");

      setSearchedItem(result);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to join an organization or class based on the searched item
  const join = async () => {
    setLoadingJoin(true);
    try {
      if (searchedType === "orgId") {
        await appwriteServices.joinAnOrg({ orgId: searchedItem.$id, userId: user.$id });
        setOrgs((prev) => [...prev, searchedItem]);
      } else if (searchedType === "classId") {
        await appwriteServices.joinClass({ classId: searchedItem.$id, userId: user.$id });
      }

      setSearchedItem(null);
      setIsSearchPopupOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingJoin(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-6 mt-12">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <form onSubmit={handleSubmit(handleSearchClick)} className="flex flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Search by class/org ID"
                {...register("searched")}
                className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
              />
              <div className="relative inline-block w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2">
                <select
                  {...register("searchType")}
                  className="appearance-none px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 w-full sm:w-auto text-gray-700 hover:bg-gray-50 pr-8"
                >
                  <option value="orgId">Search by Org ID</option>
                  <option value="classId">Search by Class ID</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                type='submit' 
                className="px-9 py-2 text-white max-w-fit bg-blue-500 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </form>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 max-w-fit text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            +Create Org
          </button>
        </div>

        {loadingOrgs ? (
          <div className="flex justify-center items-center py-10">
          <div className="loader"></div>
        </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {orgs.length === 0 ? (
              <h1 className="text-xl font-bold text-center text-gray-700 mt-6 col-span-full">You haven&apos;t joined any organizations yet. Start exploring!</h1>
            ) : (
              orgs.map(org => (
                <div key={org.$id} className="p-4 border rounded shadow">
                  <OrgComp org={org} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-96">
            <span
              className="relative float-right cursor-pointer text-gray-800 text-xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </span>
            <h2 className="text-xl font-semibold mb-4">Create Organization</h2>
            <form onSubmit={handleSubmit(createOrg)}>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="orgName">
                  Organization Name:
                </label>
                <input
                  id="orgName"
                  type="text"
                  {...register("name", { required: true })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="orgAddress">
                  Organization Address:
                </label>
                <input
                  id="orgAddress"
                  type="text"
                  {...register("address", { required: true })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <button
                type="submit"
                disabled={creatingOrgInProgress}
                className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                {creatingOrgInProgress ? "Creating..." : "Create"}
              </button>
            </form>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
          </div>
        </div>
      )}

      {isSearchPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-96">
            <span
              className="relative float-right cursor-pointer text-gray-800 text-xl mr-2"
              onClick={() => {
                setError("");
                setIsSearchPopupOpen(false);
                setSearchedItem(null);
              }}
            >
              &times;
            </span>
            {searchedItem && (
              <>
                <div className="p-4 border rounded shadow">
                  {searchedType === "orgId" ? <OrgComp org={searchedItem} /> : <ClassComp classObj={searchedItem} />}
                </div>
                <button
                  onClick={join}
                  className={`w-full mt-4 px-4 py-2 text-white rounded ${loadingJoin ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                  disabled={loadingJoin}
                >
                  {loadingJoin ? "Joining..." : searchedType === "orgId" ? "Join Org" : "Join Class"}
                </button>
              </>
            )}
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
