import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";


function Navbar(){


const {logout}=useContext(AuthContext);


const navigate = useNavigate();



function handleLogout(){

    logout();

    navigate("/login");

}



return (

<div className="h-16 shadow flex justify-between items-center px-6">


<h1 className="font-bold">

Dashboard

</h1>



<button

onClick={handleLogout}

className="bg-red-500 text-white px-4 py-2 rounded"

>

Logout

</button>


</div>

)


}


export default Navbar;