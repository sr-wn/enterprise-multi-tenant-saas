package com.srawan.backend.controller;


import com.srawan.backend.dto.AddCommentRequest;
import com.srawan.backend.dto.TaskCommentResponse;

import com.srawan.backend.service.TaskCommentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/tasks")
public class TaskCommentController {


    private final TaskCommentService taskCommentService;




    public TaskCommentController(
            TaskCommentService taskCommentService
    ){

        this.taskCommentService = taskCommentService;

    }





    @PostMapping("/{id}/comments")
    public TaskCommentResponse addComment(

            @PathVariable Long id,

            @RequestBody AddCommentRequest request

    ){


        return taskCommentService.addComment(
                id,
                request
        );


    }






    @GetMapping("/{id}/comments")
    public List<TaskCommentResponse> getComments(

            @PathVariable Long id

    ){


        return taskCommentService.getComments(id);


    }



}