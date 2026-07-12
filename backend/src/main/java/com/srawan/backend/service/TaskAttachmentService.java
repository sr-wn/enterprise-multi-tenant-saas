package com.srawan.backend.service;


import com.srawan.backend.dto.TaskAttachmentResponse;

import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.TaskAttachment;
import com.srawan.backend.entity.User;

import com.srawan.backend.mapper.TaskAttachmentMapper;

import com.srawan.backend.repository.TaskAttachmentRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.UnauthorizedActionException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;


import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;



@Service
public class TaskAttachmentService {
    

private final TaskAttachmentRepository taskAttachmentRepository;

private final TaskRepository taskRepository;

private final UserRepository userRepository;

private final Cloudinary cloudinary;



public TaskAttachmentService(TaskAttachmentRepository taskAttachmentRepository, TaskRepository taskRepository, UserRepository userRepository, Cloudinary cloudinary) {

    this.taskAttachmentRepository = taskAttachmentRepository;

    this.taskRepository = taskRepository;

    this.userRepository = userRepository;

    this.cloudinary = cloudinary;

}






public TaskAttachmentResponse upload(Long taskId, MultipartFile file) throws Exception {



    User currentUser=getCurrentUser();




    Task task=taskRepository
            .findById(taskId)
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Task Not Found"
                )
            );






    if(!task.getProject().getTenant().id().equals(currentUser.getTenant().id())){


        throw new UnauthorizedActionException(
            "Cannot access another tenant's task"
        );


    }







    Map<?, ?> result = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                    "folder", "task-attachments",
                    "resource_type", "auto"
            )
    );

    String secureUrl = (String) result.get("secure_url");
    Long bytes = result.get("bytes") != null
            ? ((Number) result.get("bytes")).longValue()
            : file.getSize();



    TaskAttachment attachment=new TaskAttachment();



    attachment.setUploadedBy(currentUser);

    attachment.setFileName(file.getOriginalFilename());

    attachment.setFilePath(secureUrl);

    attachment.setFileType(file.getContentType());

    attachment.setFileSize(bytes);

    attachment.setTask(task);




    TaskAttachment saved=
            taskAttachmentRepository.save(attachment);




    return TaskAttachmentMapper.toResponse(saved);


}









private User getCurrentUser() {


    String email=
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();




    return userRepository

            .findByEmail(email)

            .orElseThrow(

                () -> new ResourceNotFoundException(
                    "User Not Found"
                )

            );


}










public List<TaskAttachmentResponse> getAttachments(Long taskId){



    User currentUser =
            getCurrentUser();





    Task task =
            taskRepository

                    .findById(taskId)

                    .orElseThrow(

                        () -> new ResourceNotFoundException(
                            "Task not found"
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

                "Cannot access another tenant task"

        );



    }






    return taskAttachmentRepository

            .findByTask(task)

            .stream()

            .map(
                TaskAttachmentMapper::toResponse
            )

            .toList();


}



}