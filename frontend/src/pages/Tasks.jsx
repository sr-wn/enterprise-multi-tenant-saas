import { useEffect, useState } from "react";

import Layout from "../layouts/Layout.jsx";

import api from "../api/axios";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";



function Tasks() {


    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    const [users, setUsers] = useState([]);
    const { user } =
        useContext(AuthContext);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [projectId, setProjectId] = useState("");

    const [assignedUserId, setAssignedUserId] = useState("");

    const [priority, setPriority] = useState("LOW");

    const [dueDate, setDueDate] = useState("");



    useEffect(() => {


        loadTasks();

        loadProjects();

        loadUsers();


    }, []);


    async function loadProjects() {


        try {


            const response =
                await api.get("/projects");


            setProjects(
                response.data.content
            );



        } catch (error) {

            console.log(error);

        }

    }






    async function loadUsers() {


        try {


            const response =
                await api.get("/users");


            setUsers(
                response.data
            );



        } catch (error) {

            console.log(error);

        }

    }




    async function loadTasks() {


        try {


            const response =
                await api.get("/tasks/my");


            setTasks(response.data.content);



        } catch (error) {


            console.log(error);


        }


    }

    async function updateStatus(taskId, status) {


        try {


            await api.patch(
                `/tasks/${taskId}/status`,
                {
                    status
                }
            );


            loadTasks();



        } catch (error) {


            console.log(error);


        }


    }


    async function createTask(e) {


        e.preventDefault();



        try {


            await api.post(

                "/tasks",

                {

                    title,

                    description,

                    projectId,

                    assignedUserId,

                    priority,

                    dueDate

                }

            );



            setTitle("");

            setDescription("");

            setDueDate("");



            loadTasks();



        } catch (error) {


            console.log(error);


        }



    }







    return (

        <Layout>


            <h1 className="text-3xl font-bold mb-6">

                My Tasks

            </h1>
            {user?.role === "ADMIN" &&
                <form
                    onSubmit={createTask}

                    className="grid gap-3 mb-8"
                >


                    <input

                        className="border p-2"

                        placeholder="Title"

                        value={title}

                        onChange={
                            e => setTitle(e.target.value)
                        }

                    />



                    <input

                        className="border p-2"

                        placeholder="Description"

                        value={description}

                        onChange={
                            e => setDescription(e.target.value)
                        }

                    />





                    <select

                        className="border p-2"

                        onChange={
                            e => setProjectId(e.target.value)
                        }

                    >


                        <option>
                            Select Project
                        </option>


                        {

                            projects.map(project => (


                                <option

                                    key={project.id}

                                    value={project.id}

                                >

                                    {project.name}

                                </option>


                            ))

                        }


                    </select>







                    <select

                        className="border p-2"

                        onChange={
                            e => setAssignedUserId(e.target.value)
                        }

                    >


                        <option>
                            Assign User
                        </option>


                        {

                            users.map(user => (


                                <option

                                    key={user.id}

                                    value={user.id}

                                >

                                    {user.fullname}

                                </option>


                            ))

                        }


                    </select>







                    <select

                        className="border p-2"

                        value={priority}

                        onChange={
                            e => setPriority(e.target.value)
                        }

                    >


                        <option value="LOW">
                            LOW
                        </option>


                        <option value="MEDIUM">
                            MEDIUM
                        </option>


                        <option value="HIGH">
                            HIGH
                        </option>


                    </select>






                    <input

                        type="date"

                        className="border p-2"

                        value={dueDate}

                        onChange={
                            e => setDueDate(e.target.value)
                        }

                    />




                    <button

                        className="bg-blue-600 text-white p-2 rounded"

                    >

                        Create Task

                    </button>


                </form>
            }



            <div className="grid gap-4">


                {


                    tasks.map(task => (


                        <div

                            key={task.id}

                            className="shadow rounded p-5"

                        >


                            <h2 className="font-bold text-xl">

                                {task.title}

                            </h2>



                            <p>

                                {task.description}

                            </p>



                            <p>

                                Priority: {task.priority}

                            </p>



                            <p>

                                Status: {task.status}

                            </p>

                            <div className="flex gap-3 mt-4">


                                <button

                                    className="bg-yellow-500 text-white px-3 py-1 rounded"

                                    onClick={
                                        () => updateStatus(
                                            task.id,
                                            "IN_PROGRESS"
                                        )
                                    }

                                >

                                    Start

                                </button>



                                <button

                                    className="bg-green-600 text-white px-3 py-1 rounded"

                                    onClick={
                                        () => updateStatus(
                                            task.id,
                                            "DONE"
                                        )
                                    }

                                >

                                    Complete

                                </button>


                            </div>



                        </div>


                    ))

                }



            </div>



        </Layout>


    )


}


export default Tasks;