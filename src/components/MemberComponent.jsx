import { useState } from "react";
import appwriteServices from "../appwrite/services";
import { useSelector } from "react-redux";

const MemberComponent = ({ userData, classId, setMembersList }) => {
  const [error, setError] = useState("");
  const [isKicked, setIsKicked] = useState(false);
  const currClass = useSelector((state) => state.auth.subClass);
  const ownerId = useSelector((state) => state.auth.org.ownerId);

  const kickMember = async () => {
    try {
      await appwriteServices.leaveClass({ classId, userId: userData.$id });
      setIsKicked(true); // Trigger the animation
      setTimeout(() => {
        setMembersList((prevArr) => prevArr.filter((member) => member.$id !== userData.$id));
      }, 500); // Delay removal to allow animation to play
    } catch (error) {
      setError(error.message); // Set the error message if the kick operation fails
    }
  };

  return (
    <tr
      className={`border-t hover:bg-gray-100 transition-all duration-500 ${
        isKicked ? "opacity-0 transform scale-95" : ""
      }`}
    >
      <td className="px-4 py-2">
        {userData.name}
        {userData.$id === ownerId && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            owner
          </span>
        )}
        {userData.$id === currClass.admin && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            admin
          </span>
        )}
      </td>
      <td className="px-4 py-2">{userData.email}</td>
      <td className="px-4 py-2">
        {
          userData.$id!=ownerId &&
          <button
          onClick={kickMember}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Kick
        </button>
        }
      </td>
      {error && <td className="px-4 py-2 text-red-500">{error}</td>}
    </tr>
  );
};

export default MemberComponent;
