import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import DashBoard from "../pages/DashBoard";
import Projects from "../pages/Projects.jsx";
import Tasks from "../pages/Tasks.jsx";
import Users from "../pages/Users.jsx";
import Notifications from "../pages/Notifications.jsx";
import ProjectDetails from "../pages/ProjectDetails.jsx";
import { AuthContext } from "../context/AuthContext";



function AppRoutes() {
    const { token } = useContext(AuthContext);

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
                path="/"
                element={token ? <Navigate to="/dashboard" replace /> : <Landing />}
            />

            <Route
                path="*"
                element={<Navigate to={token ? "/dashboard" : "/"} replace />}
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
                path="/projects/:id"
                element={
                    <ProtectedRoute>
                        <ProjectDetails />
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

            <Route

                path="/users"

                element={

                    <ProtectedRoute>

                        <Users />

                    </ProtectedRoute>

                }

            />

            <Route

                path="/notifications"

                element={

                    <ProtectedRoute>

                        <Notifications />

                    </ProtectedRoute>

                }

            />

        </Routes>

    );

}


export default AppRoutes;