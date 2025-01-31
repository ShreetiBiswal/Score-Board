import { Outlet, useNavigate } from "react-router-dom"
import {  useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import authService from "./appwrite/auth";
import appwriteServices from "./appwrite/services";
import { login as authLogin } from "./store/authSlice";


const App=()=>{

    const navigate=useNavigate(); 
    const dispatch=useDispatch();  
    const loggedIn=useSelector((state)=>state.auth.loggedIn)
    
    
    
    const checkSession=async()=>{
        try {
          const user=await authService.getCurrentUser()
           if(user){
            const userDetails=await appwriteServices.getUserDetails(user.$id)
            if(user && userDetails){
                dispatch(authLogin({user,userDetails}))
                navigate("/")
            }else{
              await authService.logout()
            }
         }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        checkSession();
        if(!loggedIn){
            navigate("/login")
        }

    },[loggedIn])

   
    return (
        <div className="flex flex-col min-h-screen">
        {loggedIn && <Header/>}
        <main className="flex-grow bg-gray-100">
          <div className="container mx-auto px-4 py-8">
           <Outlet/>
          </div>
        </main>
        <Footer />
      </div>
    )
}

export default App;