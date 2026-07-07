package com.srawan.backend.dto;


public class DashBoardResponse {


    private long totalProjects;


    private long totalUsers;


    private long totalTasks;


    private long todoTasks;


    private long inProgressTasks;


    private long completedTasks;





    public DashBoardResponse(

            long totalProjects,

            long totalUsers,

            long totalTasks,

            long todoTasks,

            long inProgressTasks,

            long completedTasks

    ){

        this.totalProjects = totalProjects;

        this.totalUsers = totalUsers;

        this.totalTasks = totalTasks;

        this.todoTasks = todoTasks;

        this.inProgressTasks = inProgressTasks;

        this.completedTasks = completedTasks;

    }






    public long getTotalProjects(){

        return totalProjects;

    }



    public long getTotalUsers(){

        return totalUsers;

    }



    public long getTotalTasks(){

        return totalTasks;

    }



    public long getTodoTasks(){

        return todoTasks;

    }



    public long getInProgressTasks(){

        return inProgressTasks;

    }



    public long getCompletedTasks(){

        return completedTasks;

    }


}