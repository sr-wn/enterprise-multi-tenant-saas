import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import DashBoard from "../pages/DashBoard";
import Projects from "../pages/Projects.jsx";
import Tasks from "../pages/Tasks.jsx";



function AppRoutes() {


    return (

        <Routes>


            <Route
                path="/login"
                element={<Login />}
            />


            <Route
                path="/register"
                element={<Register />}
            />


            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute><DashBoard />
                    </ProtectedRoute>}
            />

            <Route

                path="/projects"

                element={

                    <ProtectedRoute>

                        <Projects />

                    </ProtectedRoute>

                }

            />


            <Route

                path="/tasks"

                element={

                    <ProtectedRoute>

                        <Tasks />

                    </ProtectedRoute>

                }

            />


        </Routes>

    );

}


export default AppRoutes;