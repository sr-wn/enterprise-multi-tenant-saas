import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";


function getValidToken() {
    const saved = localStorage.getItem("token");
    if (!saved) return null;

    try {
        const decoded = jwtDecode(saved);
        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
            localStorage.removeItem("token");
            return null;
        }
        return saved;
    } catch {
        localStorage.removeItem("token");
        return null;
    }
}

export function AuthProvider({children}){


    const savedToken = getValidToken();


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