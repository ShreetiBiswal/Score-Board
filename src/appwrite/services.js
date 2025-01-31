import { Client,ID,Query,Databases } from "appwrite";
import conf from "../conf/conf.js";
class Service{

    client=new Client();
    databases;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)

        this.databases=new Databases(this.client)
    }

    async getUserDetails(userId){
        try {

            const userDetailsArray=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserDetailsId,
                [Query.equal("userId",userId)]
            )
    
           
           
    
            const userDetails=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserDetailsId,
                userDetailsArray.documents[0].$id
            )

            return userDetails;
            
            
        } catch (error) {
            console.log("At getUserDetails::ERROR:",error.message)
            throw error
        }
    }

    async createOrg({name,address,ownerId}){
        try {

            const newOrg= await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrgId,
                ID.unique(),
                {
                    name,
                    address,
                    ownerId,
                    members:[ownerId]
                }
            )

            this.joinAnOrg({orgId:newOrg.$id,userId:ownerId})
          return newOrg
            
        } catch (error) {
            console.log("At createOrg::ERROR!!",error?.message)
            throw error
        }
    }

    async joinAnOrg({orgId,userId}){

       try {


        const org=await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteOrgId,
            orgId,
        )

        if(!org.members.includes(userId)){
            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrgId,
                orgId,
                {
                    members:[...org.members,userId]
                }
            )
        }

        const userDetailsArray=await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteUserDetailsId,
            [Query.equal("userId",userId)]
        )

       

        const userDetails=await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteUserDetailsId,
            userDetailsArray.documents[0].$id
        )

       
       if(!userDetails.orgs.includes(orgId)){
        await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteUserDetailsId,
            userDetails.$id,
            {orgs:[...userDetails.orgs,orgId]}
        )

       }
       } catch (error) {
        console.log("At joinOrg::ERROR!",error.message)
        throw error
       }

    }

    async exitOrg({orgId,userId}){

        
      try {
        const userDetailsArray=await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteUserDetailsId,
            [Query.equal("userId",userId)]
        )
       

        const userDetails=await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteUserDetailsId,
            userDetailsArray.documents[0].$id
        )

       
        await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteUserDetailsId,
            userDetails.$id,
            {orgs:userDetails.orgs.filter((oId)=>(oId!==orgId))}
        )

        const classes=await this.getClassFromOrg({orgId:orgId})

        for(let c in classes){
            if(classes[c].students.includes(userId)){
                await this.leaveClass({classId:classes[c].$id,userId})
            }
        }

        console.log("exited")
      } catch (error) {
        
        console.log("At exitOrg::ERROR!",error.message)
        throw error
      }

    }

    async deleteOrg({orgId}){

       try {
    
        const org=await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteOrgId,
            orgId
        )

        
        for(let i=0;i<org.members.length;i++){
          await  this.exitOrg({orgId,userId:org.members[i]})
        }
        

        await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteOrgId,
            orgId
        )

        const classList=await this.getClassFromOrg({orgId})

        for(let i=0;i<classList.length;i++){
            await this.deleteClass({classId:classList[i].$id})
        }
       } catch (error) {
        
        console.log("At deleteOrg::ERROR!",error.message);
        throw error
       }
        
    }

    async uploadResult({studentId,student_Name,testId,grade,marks}){

       try {
        const res=await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteResultId,
            ID.unique(),
            {
                studentId,
                student_Name,
                testId,
                grade,
                marks
            }
        )

        return res;
       } catch (error) {
        console.log("at upload Result::Error")
        throw error;
       }
    }

    async updateResult({resId,marks}){
        try {
            const updatedRes=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResultId,
                resId,
                {
                    marks
                }
            )

            return updatedRes;
        } catch (error) {
            console.log("At updating result:",error)
            throw error;
        }
    }

    async deleteRes({resId}){
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResultId,
                resId
            )
        } catch (error) {
            console.log("at deleteRes::ERROR",error.message)
            throw error
        }
    }

    async createTest({classId,subId,name,totalMarks,passMark,duration,subNames}){

        try {
            const createdTest=await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTestId,
                ID.unique(),
                {
                    date:new Date(Date.now()),
                    classId,
                    subId,
                    name,
                    totalMarks,
                    passMark,
                    duration,
                    subNames
                }

            )
            return createdTest;
        } catch (error) {
            console.log("At create Test::ERROR",error.message)
            throw error;
        }
    }

    async updateTestDetails({name,totalMarks,passMark,duration,testID,subNames}){
        try {

            const updatedTest=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTestId,
                testID,
                {name,
                    totalMarks,
                    passMark,
                    duration,
                    subNames
                }
            )

            return updatedTest;
            
        } catch (error) {
            console.log("At updateTestName::ERROR",error.message)
            throw error;
        }
    }

    async deleteTest({testId}){
        try {
           

            const resList=await this.getResultFromTest({testId})

            for(let i=0;i<resList.length;i++){
                await this.deleteRes({resId:resList[i].$id})
            }
            const res=await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTestId,
                testId
            )

            return res;
        } catch (error) {
            console.log("At deleTest::ERROR",error.message)
            throw error;
        }
    }

    async createSubject({classId,name,teacherId}){
        try {
            const newSub=await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                ID.unique(),
                {
                    classId,
                    name,
                    teacherId
                }

            )
            return newSub;
        } catch (error) {
            console.log("At create Subject",error.message)
            throw error
        }
    }

    async addTeacher({subId,teacherId}){
        try {
            const updatedClass=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId,
                {
                    teacherId
                }
            )
            return updatedClass;
        } catch (error) {
            console.log("At add Teacher::ERROR",error.message)
            throw error
        }
    }

    async removeSub({subId}){
        try {
            const res=await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId
            )

            const testList=await this.getTestFromSub({subId})

            for(let i=0;i<testList.length;i++){
                await this.deleteTest({testID:testList[i].$id})
            }
            return res;
        } catch (error) {
            console.log("At removeSub::ERROR",error.message)
            throw error
        }
    }

    async joinSub({subId,studentID}){

        try {
            const sub=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId
            )

            const updatedSub=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId,
                {
                    students:[...sub.students,studentID]
                }
            )

            return updatedSub;
        } catch (error) {
            console.log("At joinSub",error.message)
            throw error
        }
    }

    async leaveSub({subId,studentID}){
        try {
            const sub=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId
            )

            const updatedSub=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId,
                {
                    students:sub.students.filter((sId)=>(sId!=studentID))
                }
            )

            return updatedSub;
        } catch (error) {
            console.log("At joinSub",error.message)
            throw error
        }
    }

    async createClass({name,orgId,admin,students}){
        try {
            const createdClass=await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                ID.unique(),
                {
                    name,
                    orgId,
                    admin,
                    students
                }
            )

            return createdClass;
        } catch (error) {
            console.log("At create class::ERROR",error.message)
            throw error
        }
    }

    async joinClass({classId,userId}){
        try {
            const prevClass=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                classId
            )

            if(prevClass?.students.includes(userId))throw new Error("You are already part of this class")

            await this.joinAnOrg({orgId:prevClass.orgId,userId})

            const newClass=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                classId,
                {
                    students:[...prevClass.students,userId]
                }
            )

            return newClass;
        } catch (error) {
            console.log("At joinClass::ERROR",error.message)
            throw error
        }
    }

    async leaveClass({classId,userId}){
        try {
            const prevClass=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                classId
            )
          
            const newClass=await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                classId,
                {
                    students:prevClass.students.filter((stdId)=>(userId!=stdId))
                }
            )

            return newClass;
        } catch (error) {
            console.log("At leaveClass::ERROR",error.message)
            throw error
        }
    }

    async deleteClass({classId}){
        try {
        
            const testList=await this.getTestFromClass({classId})

            for(let i=0;i<testList.length;i++){
                await this.deleteTest({testId:testList[i].$id})
            }

            const subList=await this.getSubFromClass({classId})

            for(let i=0;i<subList.length;i++){
                await this.removeSub({subId:subList[i].$id})
            }

            const delClass=await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                classId
            )

            return delClass;
        } catch (error) {
            console.log("At deleteClass::ERROR",error.message)
            throw error;
        }
    }

    async getOrg({orgId}){
        try {
            const org=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrgId,
                orgId
            )
            return org;
        } catch (error) {
            console.log("At getOrg::ERROR",error.message)
            throw error
        }
    }

    async getClass({classId}){
        try {
            const gotClass=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                classId
            )
            return gotClass;
        } catch (error) {
            console.log("At getClass::ERROR",error.message)
            throw error
        }
    }

    async getTest({testId}){
        try {
            const test=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTestId,
                testId
            )
            return test;
        } catch (error) {
            console.log("At getTest::ERROR",error.message)
            throw error
        }
    }

    async getSub({subId}){
        try {
            const sub=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                subId
            )
            return sub;
        } catch (error) {
            console.log("At getOrg::ERROR",error.message)
            throw error
        }
    }

    async getResult({resId}){
        try {
            const res=await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResultId,
                resId
            )
            return res;
        } catch (error) {
            console.log("At getResult::ERROR",error.message)
            throw error
        }
    }

    async getClassFromOrg({orgId}){
        try {
            const classArr=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteClassId,
                [Query.equal("orgId",orgId)]
            )

            let classList=[]

            for(let i=0;i<classArr.documents.length;i++){
                const currClass=await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteClassId,
                    classArr.documents[i].$id
                )

                classList.push(currClass);
            }

            return classList;
        } catch (error) {
            console.log("At getClassFromOrg::ERROR",error.message)
            throw error
        }
    }

    async getTestFromClass({classId}){
        try {
            const testArr=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTestId,
                [Query.equal("classId",classId)]
            )

            let testList=[]

            for(let i=0;i<testArr.documents.length;i++){
                const currTest=await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteTestId,
                    testArr.documents[i].$id
                )

                testList.push(currTest);
            }

            return testList;
        } catch (error) {
            console.log("At getTestFromClass::ERROR",error.message)
            throw error
        }
    }

    async getSubFromClass({classId}){
        try {
            const subArr=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteSubjectId,
                [Query.equal("classId",classId)]
            )

            let subList=[]

            for(let i=0;i<subArr.documents.length;i++){
                const currClass=await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteSubjectId,
                    subArr.documents[i].$id
                )

                subList.push(currClass);
            }

            return subList;
        } catch (error) {
            console.log("At getSubFromClass::ERROR",error.message)
            throw error
        }
    }

    async getTestFromSub({subId}){
        try {
            const testArr=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTestId,
                [Query.equal("subId",subId)]
            )

            let testList=[]

            for(let i=0;i<testArr.documents.length;i++){
                const currTest=await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteTestId,
                    testArr.documents[i].$id
                )

                testList.push(currTest);
            }

            return testList;
        } catch (error) {
            console.log("At getTestFromSub::ERROR",error.message)
            throw error
        }
    }

    async getResultOfStudent({testId,studentId}){
        try {
            const resArr=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteResultId,
                [Query.equal("testId",testId),
                 Query.equal("studentId",studentId)
                ]
            )

            let resList=[]

            for(let i=0;i<resArr.documents.length;i++){
                const currRes=await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteResultId,
                    resArr.documents[i].$id
                )

                resList.push(currRes);
            }
            return resList;
        } catch (error) {
            console.log("At getResultOfStudent::ERROR",error.message)
            throw error
        }
    }

    async getResultFromTest({testId}){
    
        try {
            const resArr=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteResultId,
                [Query.equal("testId",testId)]
            )

            let resList=[]

            for(let i=0;i<resArr.documents.length;i++){
                const currRes=await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteResultId,
                    resArr.documents[i].$id
                )

                resList.push(currRes);
            }

            return resList;
        } catch (error) {
            console.log("At getResultFromTest::ERROR",error.message)
            throw error
        }
    }
}
const appwriteServices=new Service()

export default appwriteServices;