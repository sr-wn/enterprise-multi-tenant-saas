package com.srawan.backend.dto;


public class DashBoardResponse {


    private String companyName;


    private long totalProjects;


    private long totalUsers;


    private long totalTasks;


    private long todoTasks;


    private long inProgressTasks;


    private long completedTasks;





    public DashBoardResponse(

            String companyName,

            long totalProjects,

            long totalUsers,

            long totalTasks,

            long todoTasks,

            long inProgressTasks,

            long completedTasks

    ){

        this.companyName = companyName;

        this.totalProjects = totalProjects;

        this.totalUsers = totalUsers;

        this.totalTasks = totalTasks;

        this.todoTasks = todoTasks;

        this.inProgressTasks = inProgressTasks;

        this.completedTasks = completedTasks;

    }






    public String getCompanyName(){

        return companyName;

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