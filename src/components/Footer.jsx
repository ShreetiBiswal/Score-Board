import { FaGithub, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
      
              <div className="flex">
              <FaEnvelope size={24}/>
             <p className="ml-1">biswalshreeti@gmail.com</p>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Mail</span>  
              </div>
        
          {/* Social Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
           
            <a 
              href="https://github.com/your-github" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-blue-400 relative group" 
              aria-label="GitHub"
            >
              <FaGithub size={24} />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">GitHub</span>
            </a>
            <Link 
              to={"/about"} 
              className="text-white hover:text-blue-400 relative group" 
              aria-label="About"
            >
              <FaInfoCircle size={24} />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">About</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center">
          <p>&copy; 2024 ScoreBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;