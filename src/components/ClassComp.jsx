import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { enterClass } from "../store/authSlice";
import { useSelector } from "react-redux";

const ClassComp=({classObj})=>{

   const {name}=classObj;
   const dispatch=useDispatch();
   const org=useSelector((state)=>state.auth.org)
   
   const handleClick=()=>{
    dispatch(enterClass({subClass:classObj}))
   }

   if(org){return (
      <Link
      onClick={handleClick}
       to={`/org/${org.name}/${name}`}>
      <h3 className="font-semibold">{name}</h3>
      </Link>
     )}else{
      return <h3 className="font-semibold">{name}</h3>
     }


}

export default ClassComp;