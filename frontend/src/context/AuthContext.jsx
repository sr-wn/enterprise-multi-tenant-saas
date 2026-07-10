import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();


export function AuthProvider({children}){


    const savedToken =
    localStorage.getItem("token");


const [token,setToken] =
    useState(savedToken);


const [user,setUser] =
    useState(
        savedToken
        ? jwtDecode(savedToken)
        : null
    );


  function login(jwt){


    localStorage.setItem(
        "token",
        jwt
    );


    setToken(jwt);


    setUser(
        jwtDecode(jwt)
    );

}


   function logout(){

    localStorage.removeItem("token");

    setToken(null);

    setUser(null);

}

    return(
        <AuthContext.Provider
           value={{

    token,

    user,

    login,

    logout

}}
        >

            {children}

        </AuthContext.Provider>
    );
}