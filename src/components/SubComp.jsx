import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SubComp=({subject})=>{
    
    const org=useSelector((state)=>state.auth.org);
    const currClass=useSelector((state)=>state.auth.subClass)
    
    return (
        <Link to={`/org/${org.name}/${currClass.name}/sub/${subject.name}`}><h3 className="text-xl font-semibold text-gray-800">{subject.name}</h3></Link>
)}

export default SubComp;