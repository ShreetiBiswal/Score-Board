import conf from "../conf/conf.js";
import {Client,Account,ID,Databases, Query} from "appwrite"
import * as sdk from "node-appwrite"

export class AuthService{

    client=new Client();
    nodeClient=new sdk.Client();
    databases;
    account;
    users;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)

        this.nodeClient
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        .setKey(conf.appwriteAPIKey)

        this.users=new sdk.Users(this.nodeClient) 
        this.account=new Account(this.client)
        this.databases=new Databases(this.client)
    }

   async createAccount({email,password,name}) {

        try {
            const userAccount=await this.account.create(ID.unique(),email.trim(),password.trim(),name.trim());

            

            await this.login({email,password});

            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserDetailsId,
                ID.unique(),
                {
                    userId:userAccount.$id,
                    isStudent:false
                }

                
            )
            return userAccount;

        } catch (error) {
           console.log("At createAccount::ERROR",error.message)
           throw error;
        }
        
    }

    async login({email,password}){
        try{
            return await this.account.createEmailPasswordSession(email,password)
        }catch(err){
            console.log("At login::ERROR",err.message)
            throw err
        }
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
           console.log("At logout::ERROR",error.message)
           throw error
        }
    }

    async getCurrentUser(){
        try{
            const currUser= await this.account.get();
            if(!currUser){
                throw new Error("Could not get current user")
            }
            return currUser;
        }catch(error){
             console.log("At getCurrentUser::ERROR",error.message)
             throw error;
        }
    }

    async getUserByEmail({email}){
       try {
        const result=await this.users.list(
            [Query.equal("email",email)]
        )
        if(!result.users[0]){
            throw new Error(`No user exists with the mail:${email}`)
        }
        return result.users[0]
   
       } catch (error) {
        console.log("At getUserByEmail::ERROR",error.message)
        throw error;
       }
    }

    async getUserByName({name}){
        try{
           
            const result=await this.users.list(
                [Query.equal("name",name)]
            )
           
            return result.users;
        }catch(error){
            console.log("At getUserByName::ERROR",error.message)
            throw error
        }
    }

    async getUserById({userId}){
        try {
            const res=await this.users.get(userId)
            return res
        } catch (error) {
            console.log("At getUserById::ERROR",error.message)
            throw error
        }
    }
    
}

const authService=new AuthService();
export default authService;