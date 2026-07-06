package com.srawan.backend.controller;

import com.srawan.backend.service.TaskService;

import org.springframework.security.access.prepost.PreAuthorize;
import com.srawan.backend.dto.UpdateTaskStatusRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import com.srawan.backend.dto.CreateTaskRequest;
import com.srawan.backend.dto.TaskResponse;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse createTask(@RequestBody CreateTaskRequest request){

        return taskService.createTask(request);

    }


    @GetMapping("/my")
    public List<TaskResponse> myTasks(){

        return taskService.myTasks();

    }


    @PatchMapping("/{id}/status")
    public TaskResponse updateStatus(@PathVariable Long id, @RequestBody UpdateTaskStatusRequest request){
        return taskService.updateStatus(id, request);
    }
    
}
