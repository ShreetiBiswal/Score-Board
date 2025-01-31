import * as XLSX from "xlsx";
import { useState, useRef, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import { useForm } from "react-hook-form";
import appwriteServices from "../appwrite/services";
import authService from "../appwrite/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UploadClassTest = () => {

  const [file, setFile] = useState(null);
  const [fileJson, setFileJson] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const {register,handleSubmit}=useForm();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [error,setError]= useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const resultPreviewRef = useRef(null);
  const org=useSelector((state)=>state.auth.org)
  const currClass=useSelector((state)=>state.auth.subClass)
  const navigate=useNavigate();


  useEffect(()=>{
    if(!currClass){
      alert("Illegal way of uploading class test")
      navigate("/")
    }
  },[])
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const PreviewGenerator = () => {
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFileJson(json);
        setShowTable(true);

        if (resultPreviewRef.current) {
          resultPreviewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid Excel file.');
    }
  };

  const toggleInfoPopup = () => {
    setShowInfo(!showInfo);
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const uploadClassTest=async ({Testname,totalMarks,duration,passMark})=>{
    setIsSubmitting(true); 
    
    try{
     const test= await appwriteServices.createTest({classId:currClass.$id,name:Testname,totalMarks:parseInt(totalMarks),passMark:passMark?parseInt(passMark):0,duration:duration?parseFloat(duration):0,subNames:fileJson[0].map(String)})
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for(let i=1;i<fileJson.length;i++){
        try {
          let id="";
          let name="";

          if(emailPattern.test(fileJson[i][0])){

            const currStd=await authService.getUserByEmail({email:fileJson[i][0]})
            id=currStd.$id;
            name=currStd.name;

          }else{

           
            const allIds=await authService.getUserByName({name:fileJson[i][0]})
           


            for(let j=0;j<allIds.length;j++){
              if(currClass.students.includes(allIds[j].$id)){
                id=allIds[j].$id
                name=allIds[j].name
                break
              }
            }
          }
        
          if(!name)name=fileJson[i][0]+"(NA)"
          
           await appwriteServices.uploadResult({studentId:id,student_Name:name,testId:test.$id,marks:fileJson[i].slice(1).map(String)})
           

        } catch (error) {
          console.log(error)
          alert("Some error occured while uploading this test,aborting operation. This test will be discarded.Check if list of students provided is correct.")
          await appwriteServices.deleteTest({testId:test.$id})
          setFile(null)
          setShowTable(false)
          setFileJson([])
          setIsCheckboxChecked(false)
          setError("")
          throw new Error("May be there was some problems with the members name and emails")
        }
      }

      alert("Test uploaded successfully")
      setFile(null)
      setShowTable(false)
      setFileJson([])
      setIsCheckboxChecked(false)
      setError("")
      navigate(`/org/${org.name}/${currClass.name}`)
     
    }catch(error){
      setError(error.message)
    }finally{
      setIsSubmitting(false);
    }
  }
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <form 
        onSubmit={handleSubmit(PreviewGenerator)} 
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Upload Class Test</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Test Name</label>
          <input
            type="text"
           {...register("Testname",{required:true})}
           required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Total Marks</label>
          <input
            type="number"
           {...register("totalMarks",{required:true})}
           required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Duration (optional)</label>
          <input
            type="text"
            {...register("duration",{required:false})}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pass Marks (optional)</label>
          <input
            type="number"
          {...register("passMark",{required:false})}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4 relative">
          <label className=" text-sm font-medium text-gray-700 flex items-center">
            Excel File Report
            <button
              type="button"
              onClick={toggleInfoPopup}
              className="ml-2 text-blue-400 text-xs bg-white border-blue-400 hover:bg-blue-500 hover:border-blue-600 hover:text-white border-2 rounded-full w-[0.9rem] h-[0.9rem] flex items-center justify-center"
              aria-label="info"
            >
              i
            </button>
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Generate Preview
        </button>
      </form>
      {showTable && fileJson.length !== 0 && (
        <div ref={resultPreviewRef} className="mt-8 bg-white p-6 rounded shadow-md w-full max-w-4xl">
          <h3 className="text-xl font-bold mb-4">Result Preview</h3>
          <TableComponent tableData={fileJson} />

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                onChange={handleCheckboxChange} 
                className="mr-2"
              />
              <span>Are the results displayed correct?</span>
            </label>
          </div>

          <button
    className={`mt-4 text-white font-bold py-2 px-4 rounded ${
        isCheckboxChecked && !isSubmitting
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-400 cursor-not-allowed'
    }`}
    disabled={!isCheckboxChecked || isSubmitting} // Disable when checkbox is not checked or submission is in progress
    onClick={handleSubmit(uploadClassTest)}
>
    {isSubmitting ? 'Submitting...' : 'Submit Test'} {/* Show progress */}
</button>
          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        </div>
      )}

      {showInfo && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Excel Sheet Format</h3>
            <p className="font-semibold mb-4">
              Please follow the structure below to ensure the Excel sheet is correctly formatted:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li><strong>Column 1:</strong> Student Name (If not unique, use Gmail)</li>
              <li><strong>Column 2:</strong> Subject 1</li>
              <li><strong>Column 3:</strong> Subject 2</li>
              <li><strong>Columns 4-n:</strong> Repeat for other subjects</li>
              <li>Do not leave empty cells; use &quot;NA&quot; or &quot;-&quot; if data is not applicable</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Below is a demo table format for better understanding:
            </p>
            <TableComponent 
              tableData={[
                ['Student Name', 'Math', 'Science'],
                ['John Doe', '85', '-'],
                ['Jane Smith', 'NA','31'],
              ]}
            />
            <button
              onClick={toggleInfoPopup}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadClassTest;
