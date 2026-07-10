import { useEffect, useState } from "react";

import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";


function DashBoard(){


    const [stats,setStats] = useState(null);



    useEffect(()=>{


        async function loadDashboard(){


            try{


                const response = await api.get(
                    "/dashboard"
                );


                setStats(response.data);



            }catch(error){

                console.log(error);

            }

        }


        loadDashboard();


    },[]);




    if(!stats){


        return(

            <Layout>

                Loading...

            </Layout>

        )

    }





    return(

        <Layout>


            <h1 className="text-3xl font-bold mb-6">

                Dashboard Overview

            </h1>




            <div className="grid grid-cols-3 gap-5">


                <div className="shadow p-5 rounded">

                    <h2>Total Projects</h2>

                    <p className="text-3xl">

                        {stats.totalProjects}

                    </p>

                </div>




                <div className="shadow p-5 rounded">

                    <h2>Total Users</h2>

                    <p className="text-3xl">

                        {stats.totalUsers}

                    </p>

                </div>





                <div className="shadow p-5 rounded">

                    <h2>Total Tasks</h2>

                    <p className="text-3xl">

                        {stats.totalTasks}

                    </p>

                </div>





                <div className="shadow p-5 rounded">

                    <h2>TODO</h2>

                    <p className="text-3xl">

                        {stats.todoCount}

                    </p>

                </div>





                <div className="shadow p-5 rounded">

                    <h2>In Progress</h2>

                    <p className="text-3xl">

                        {stats.inProgressCount}

                    </p>

                </div>




                <div className="shadow p-5 rounded">

                    <h2>Done</h2>

                    <p className="text-3xl">

                        {stats.doneCount}

                    </p>

                </div>



            </div>


        </Layout>

    )

}


export default DashBoard;