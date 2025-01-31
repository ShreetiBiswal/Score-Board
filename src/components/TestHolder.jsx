import { Link } from "react-router-dom";
import TestComp from "./TestComp";
import { useSelector } from "react-redux";

const TestHolder = ({ tests }) => {


  const org=useSelector((state)=>state.auth.org)
  const currClass=useSelector((state)=>state.auth.subClass)
  const user=useSelector((state)=>state.auth.user)
  const isOwner=(user.$id===org?.ownerId)

  return (
    <div className="space-y-4 max-w-screen-lg mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      {isOwner && <div className="flex justify-end mb-4">
       <Link to={`/org/${org.name}/${currClass.name}/uploadClassTest`}>
       <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Upload Test
        </button>
        </Link>
      </div>}
      
     
      <div className="space-y-4 overflow-y-auto h-96 p-4 bg-white rounded-lg shadow-md">
        {tests.length !== 0 ? (
          tests.map((test) => (
            <div 
              key={test.$id} 
              className="border border-gray-300 p-4 rounded-md shadow-md bg-white hover:shadow-lg hover:bg-gray-50"
            >
              <TestComp test={test} />
            </div>
          ))
        ) : (
          <h1 className="text-center text-gray-700 font-bold text-lg">No tests</h1>
        )}
      </div>
    </div>
  );
};

export default TestHolder;
