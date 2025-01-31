import ReactDOM from "react-dom/client"
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Org from "./pages/Org.jsx";
import ClassPg from "./pages/ClassPg.jsx";
import UploadClassTest from "./pages/UploadClassTest.jsx";
import Test from "./pages/Test.jsx";
import Members from "./pages/Members.jsx";
import Error from "./pages/Error.jsx";
import About from "./pages/About.jsx";


const root=ReactDOM.createRoot(document.getElementById("root"));

const router=createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/login",
                element:<Login/>
            },
            {
                path:"/register",
                element:<Register/>
            },
            {
                path:"/org/:orgName",
                element:(<Org/>)
            },
            {
                path:"/org/:orgName/:className",
                element:<ClassPg/>
            },
            {
                path:"/org/:orgName/:className/uploadClassTest",
                element:<UploadClassTest/>
            },
            {
                path:"/org/:orgName/:className/sub/:subname",
                element:<h1>Yo YO NIgga</h1>
            },
            {
                path:"/org/:orgName/:className/viewTest/:test",
                element:<Test/>
            },
            {
                path:"org/:orgName/:className/members",
                element:<Members/>
            },
            {
                path:"/about",
                element:<About/>
            }
        ],
        errorElement:<Error/>
    }
])

root.render(
    <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
    </Provider>
)