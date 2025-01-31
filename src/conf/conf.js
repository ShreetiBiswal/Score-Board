const conf={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteOrgId:String(import.meta.env.VITE_APPWRITE_ORG_ID),
    appwriteResultId:String(import.meta.env.VITE_APPWRITE_RESULT_ID),
    appwriteClassId:String(import.meta.env.VITE_APPWRITE_CLASS_ID),
    appwriteSubjectId:String(import.meta.env.VITE_APPWRITE_SUBJECT_ID),
    appwriteTestId:String(import.meta.env.VITE_APPWRITE_TEST_ID),
    appwriteUserDetailsId:String(import.meta.env.VITE_APPWRITE_USERDETAILS_ID),
    appwriteAPIKey:String(import.meta.env.VITE_APPWRITE_API_KEY)
}


export default conf;