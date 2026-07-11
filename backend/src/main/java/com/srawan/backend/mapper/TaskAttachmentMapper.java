package com.srawan.backend.mapper;


import com.srawan.backend.dto.TaskAttachmentResponse;

import com.srawan.backend.entity.TaskAttachment;


public class TaskAttachmentMapper {


    private TaskAttachmentMapper(){}





    public static TaskAttachmentResponse toResponse(

            TaskAttachment attachment

    ){



        return new TaskAttachmentResponse(

                attachment.getId(),

                attachment.getFileName(),

                attachment.getFileType(),

                attachment.getFilePath().replace("\\", "/"),

                attachment
                        .getUploadedBy()
                        .getEmail(),

                attachment.getUploadedAt()

        );


    }



}