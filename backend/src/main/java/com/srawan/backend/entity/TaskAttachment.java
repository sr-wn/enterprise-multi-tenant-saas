package com.srawan.backend.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
public class TaskAttachment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;




    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;




    private String fileName;




    private String fileType;




    private String filePath;



    private Long fileSize;



    private LocalDateTime uploadedAt;





    @PrePersist
    public void onUpload(){

        uploadedAt = LocalDateTime.now();

    }







    public Long getId(){

        return id;

    }






    public Task getTask(){

        return task;

    }



    public void setTask(Task task){

        this.task = task;

    }






    public User getUploadedBy(){

        return uploadedBy;

    }



    public void setUploadedBy(User uploadedBy){

        this.uploadedBy = uploadedBy;

    }







    public String getFileName(){

        return fileName;

    }



    public void setFileName(String fileName){

        this.fileName = fileName;

    }







    public String getFileType(){

        return fileType;

    }



    public void setFileType(String fileType){

        this.fileType = fileType;

    }







    public String getFilePath(){

        return filePath;

    }



    public void setFilePath(String filePath){
        this.filePath = filePath;
    }



    public Long getFileSize(){
        return fileSize;
    }



    public void setFileSize(Long fileSize){
        this.fileSize = fileSize;
    }



    public LocalDateTime getUploadedAt(){

        return uploadedAt;

    }



}