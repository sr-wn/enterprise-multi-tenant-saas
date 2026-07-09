import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";


function Login(){


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    const {login} = useContext(AuthContext);


    const navigate = useNavigate();



    async function handleLogin(e){


        e.preventDefault();


        try{


            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


            const token = response.data.token;


            login(token);


            navigate("/dashboard");



        }catch(error){

            alert("Invalid Login");

        }


    }



    return(

        <div>


            <h1>Login</h1>


            <form onSubmit={handleLogin}>


                <input

                    placeholder="Email"

                    value={email}

                    onChange={
                        (e)=>setEmail(e.target.value)
                    }

                />



                <input

                    placeholder="Password"

                    type="password"

                    value={password}

                    onChange={
                        (e)=>setPassword(e.target.value)
                    }

                />



                <button>
                    Login
                </button>



            </form>



        </div>

    );

}


export default Login;