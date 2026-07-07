package com.srawan.backend.dto;


import jakarta.validation.constraints.NotBlank;



public class CreateProjectRequest {



    @NotBlank(message = "Project name is required")
    private String name;




    @NotBlank(message = "Project description is required")
    private String description;






    public String getName(){

        return name;

    }




    public String getDescription(){

        return description;

    }



}