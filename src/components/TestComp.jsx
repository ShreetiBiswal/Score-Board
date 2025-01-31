import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { enterTest } from "../store/authSlice";
import { useSelector } from "react-redux";

const TestComp=({test})=>{

    const dispatch=useDispatch();
    const org=useSelector((state)=>state.auth.org)
    const currClass=useSelector((state)=>state.auth.subClass)
    
    const handleClick=()=>{
        dispatch(enterTest({test:test}))
    }
  return (
  <Link
    onClick={handleClick}
    to={`/org/${org?.name}/${currClass?.name}/viewTest/${test?.name}`}
    className="block p-4 bg-white"
  >
    {/* Test Title */}
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
      {test.name}
    </h3>

    {/* Test Details */}
    <div className="text-sm sm:text-base text-gray-600 space-y-1">
      <p>
        <strong className="font-medium">Date:</strong> {test.date.split("T")[0]}
      </p>
      <p>
        <strong className="font-medium">Total Marks:</strong> {test.totalMarks}
      </p>
      {test.passMark!==0 && (
        <p>
          <strong className="font-medium">Pass Mark:</strong> {test.passMark}
        </p>
      )}
      {test.duration!==0 ? (
        <p>
          <strong className="font-medium">Duration:</strong> {test.duration} minutes
        </p>
      ):<></>}
    </div>
  </Link>
);

}

export default TestComp;