import { useEffect, useState } from "react";

import api from "../api/axios";



function TaskComments({ taskId }) {


    const [comments, setComments] =
        useState([]);


    const [message, setMessage] =
        useState("");




    useEffect(() => {


        loadComments();


    }, []);





    async function loadComments() {


        try {


            const response =
                await api.get(
                    `/tasks/${taskId}/comments`
                );


            setComments(response.data);



        } catch (error) {

            console.log(error);

        }


    }








    async function addComment(e) {


        e.preventDefault();


        try {


            await api.post(
                `/tasks/${taskId}/comments`,
                {
                    message
                }
            );


            setMessage("");


            loadComments();



        } catch (error) {

            console.log(error);

        }


    }






    return (


        <div className="mt-5 border-t pt-3">


            <h3 className="font-bold">

                Comments

            </h3>




            {

                comments.map(comment => (


                    <p key={comment.id}>


                        <b>
                            {comment.createdBy}:
                        </b>


                        {" "}


                        {comment.message}


                    </p>


                ))

            }





            <form
                onSubmit={addComment}

                className="mt-3 flex gap-2"
            >


                <input

                    className="border p-2 flex-1"

                    value={message}

                    placeholder="Add comment"

                    onChange={
                        e => setMessage(e.target.value)
                    }

                />



                <button

                    className="bg-blue-600 text-white px-3 rounded"

                >

                    Send

                </button>



            </form>



        </div>


    )


}


export default TaskComments;