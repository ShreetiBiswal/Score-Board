import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SubComp from "./SubComp";

const SubHolder = ({ subjects }) => {
  const org = useSelector((state) => state.auth.org);
  const currClass = useSelector((state) => state.auth.subClass);
  const user = useSelector((state) => state.auth.user);
  const isOwner = user.$id === org?.ownerId; 

  return (
    <div className="space-y-4 max-w-screen-lg mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      {isOwner && (
        <div className="flex justify-end mb-4">
          <Link to={`/org/${org.name}/${currClass.name}/addSubject/aaaa`}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              +Add Subject
            </button>
          </Link>
        </div>
      )}

      <div className="space-y-4 overflow-y-auto h-96 p-4 bg-white rounded-lg shadow-md">
        {subjects.length !== 0 ? (
          subjects.map((subject) => (
            <div
              key={subject.$id}
              className="border border-gray-300 p-4 rounded-md shadow-md bg-white"
            >
              <SubComp subject={subject}/>
            </div>
          ))
        ) : (
          <h1 className="text-center text-gray-700 font-bold text-lg">No subjects</h1>
        )}
      </div>
    </div>
  );
};

export default SubHolder;
