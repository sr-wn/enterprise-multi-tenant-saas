package com.srawan.backend.controller;


import com.srawan.backend.dto.TaskAttachmentResponse;
import com.srawan.backend.service.TaskAttachmentService;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/tasks")
public class TaskAttachmentController {


    private final TaskAttachmentService taskAttachmentService;



    public TaskAttachmentController(
            TaskAttachmentService taskAttachmentService
    ){

        this.taskAttachmentService =
                taskAttachmentService;

    }






    @PostMapping("/{id}/attachments")
    public TaskAttachmentResponse uploadFile(

            @PathVariable Long id,


            @RequestParam("file")
            MultipartFile file

    ) throws Exception {


        return taskAttachmentService.upload(

                id,

                file

        );


    }


    @GetMapping("/{id}/attachments")
public List<TaskAttachmentResponse> getAttachments(

        @PathVariable Long id

){


    return taskAttachmentService
            .getAttachments(id);


}


}