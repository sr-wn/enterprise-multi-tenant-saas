import { useEffect, useState } from "react";

import Layout from "../layouts/Layout.jsx";

import api from "../api/axios";



function Projects() {


    const [projects, setProjects] = useState([]);
    const [name,setName] = useState("");

const [description,setDescription] = useState("");



    useEffect(() => {


        loadProjects();


    }, []);





    async function loadProjects() {


        try {


            const response =
                await api.get("/projects");



            setProjects(response.data.content);



        } catch (error) {


            console.log(error);


        }


    }

    async function createProject(e){


    e.preventDefault();


    try{


        await api.post(
            "/projects",
            {
                name,
                description
            }
        );


        setName("");

        setDescription("");


        loadProjects();



    }catch(error){


        console.log(error);


    }

}







    return (


        <Layout>


            <h1 className="text-3xl font-bold mb-6">

                Projects

            </h1>


            <form 
onSubmit={createProject}

className="mb-8 flex gap-3"
>


<input

className="border p-2 rounded"

placeholder="Project name"

value={name}

onChange={
(e)=>setName(e.target.value)
}

/>



<input

className="border p-2 rounded"

placeholder="Description"

value={description}

onChange={
(e)=>setDescription(e.target.value)
}

/>



<button

className="bg-blue-600 text-white px-4 rounded"

>

Create

</button>



</form>



            <div className="grid gap-4">


                {


                    projects.map(project => (



                        <div

                            key={project.id}

                            className="shadow rounded p-5"

                        >


                            <h2 className="font-bold text-xl">


                                {project.name}


                            </h2>



                            <p>

                                {project.description}

                            </p>



                        </div>



                    ))


                }



            </div>



        </Layout>


    )


}


export default Projects;