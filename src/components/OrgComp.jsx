import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { enterOrg } from "../store/authSlice.js";

const OrgComp=({org})=>{
    
    const dispatch=useDispatch();
    const {name,address}=org;

    const handleClick=()=>{
        dispatch(enterOrg({org}))
    }
    
    return (
        <Link
        onClick={handleClick}
         to={`/org/${name}`}>
        <h3 className="font-semibold">{name}</h3>
        <p>{address}</p>
        </Link>
    )
}

export default OrgComp