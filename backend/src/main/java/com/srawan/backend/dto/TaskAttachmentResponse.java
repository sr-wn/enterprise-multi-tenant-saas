package com.srawan.backend.dto;


import java.time.LocalDateTime;


public class TaskAttachmentResponse {


    private Long id;


    private String fileName;


    private String fileType;


    private String filePath;


    private String uploadedBy;


    private LocalDateTime uploadedAt;






    public TaskAttachmentResponse(

            Long id,

            String fileName,

            String fileType,

            String filePath,

            String uploadedBy,

            LocalDateTime uploadedAt

    ){


        this.id = id;

        this.fileName = fileName;

        this.fileType = fileType;

        this.filePath = filePath;

        this.uploadedBy = uploadedBy;

        this.uploadedAt = uploadedAt;


    }







    public Long getId(){

        return id;

    }




    public String getFileName(){

        return fileName;

    }




    public String getFileType(){

        return fileType;

    }




    public String getFilePath(){

        return filePath;

    }




    public String getUploadedBy(){

        return uploadedBy;

    }




    public LocalDateTime getUploadedAt(){

        return uploadedAt;

    }


}