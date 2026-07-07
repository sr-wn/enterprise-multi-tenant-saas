package com.srawan.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.srawan.backend.dto.AddCommentRequest;
import com.srawan.backend.dto.TaskCommentResponse;

import com.srawan.backend.entity.TaskComment;
import com.srawan.backend.entity.User;
import com.srawan.backend.entity.Task;

import com.srawan.backend.repository.TaskCommentRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.UnauthorizedActionException;

import java.util.List;



@Service
public class TaskCommentService {


private final TaskCommentRepository taskCommentRepository;

private final TaskRepository taskRepository;

private final UserRepository userRepository;





public TaskCommentService(

        TaskCommentRepository taskCommentRepository,

        TaskRepository taskRepository,

        UserRepository userRepository

){

    this.taskCommentRepository = taskCommentRepository;

    this.taskRepository = taskRepository;

    this.userRepository = userRepository;

}







public TaskCommentResponse addComment(Long taskId, AddCommentRequest request){


    User currentUser=getCurrentUser();



    Task task=taskRepository
            .findById(taskId)
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Task Not Found"
                )
            );







    if(
        !task.getProject()
                .getTenant()
                .id()
                .equals(
                    currentUser.getTenant().id()
                )
    ){


        throw new UnauthorizedActionException(

            "Cannot comment on another tenant task"

        );


    }






    TaskComment comment =
            new TaskComment();



    comment.setTask(task);


    comment.setUser(currentUser);


    comment.setMessage(
            request.getMessage()
    );






    TaskComment saved =
            taskCommentRepository.save(comment);





    return mapToResponse(saved);


}









public List<TaskCommentResponse> getComments(Long taskId){



    Task task =
            taskRepository

                    .findById(taskId)

                    .orElseThrow(

                        () -> new ResourceNotFoundException(
                            "Task not found"
                        )

                    );






    return taskCommentRepository

            .findByTask(task)

            .stream()

            .map(this::mapToResponse)

            .toList();


}









private User getCurrentUser(){



    String email =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();





    return userRepository

            .findByEmail(email)

            .orElseThrow(

                () -> new ResourceNotFoundException(
                    "User not found"
                )

            );


}









private TaskCommentResponse mapToResponse(TaskComment comment){



    return new TaskCommentResponse(

            comment.getId(),

            comment.getMessage(),

            comment.getUser()
                    .getEmail(),

            comment.getCreatedAt()

    );


}



}