import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice(
    {
        name:"auth",
        initialState:{
            loggedIn:false,
            user:null,
            userDetails:null,
            org:null,
            subClass:null,
            subject:null,
            test:null,
        },
        reducers:{
            login:(state,action)=>{
                state.loggedIn=true,
                state.user=action.payload.user
                state.userDetails=action.payload.userDetails
                
            },
            logout:(state)=>{
                state.loggedIn=false,
                state.user=null,
                state.userDetails=null,
                state.org=null,
                state.subClass=null,
                state.subject=null,
                state.test=null
            },
            enterOrg:(state,action)=>{
                state.org=action.payload.org
            },
            exitOrg:(state)=>{
                state.org=null
            },
            enterClass:(state,action)=>{
                state.subClass=action.payload.subClass
            },
            exitClass:(state)=>{
                state.subClass=null
            },
            enterTest:(state,action)=>{
                state.test=action.payload.test
            },
            exitTest:(state)=>{
                state.test=null
            }
        }
    })

    export const {login,logout,enterOrg,exitOrg,enterClass,exitClass,enterTest,exitTest}=authSlice.actions;

    export default authSlice.reducer