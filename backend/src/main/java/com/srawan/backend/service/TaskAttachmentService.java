package com.srawan.backend.service;


import com.srawan.backend.dto.TaskAttachmentResponse;

import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.TaskAttachment;
import com.srawan.backend.entity.User;

import com.srawan.backend.mapper.TaskAttachmentMapper;

import com.srawan.backend.repository.TaskAttachmentRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.UserRepository;


import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class TaskAttachmentService {
    
private final TaskAttachmentRepository taskAttachmentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskAttachmentService(TaskAttachmentRepository taskAttachmentRepository, TaskRepository taskRepository, UserRepository userRepository) {
        this.taskAttachmentRepository = taskAttachmentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }



    public TaskAttachmentResponse upload(Long taskId, MultipartFile file) throws Exception {

        User currentUser=getCurrentUser();

        Task task=taskRepository.findById(taskId).orElseThrow(()->new RuntimeException("Task Not Found"));


        if(!task.getProject().getTenant().id().equals(currentUser.getTenant().id())){
            throw new RuntimeException("Cannot access another tenant's project");
    }


    String uploadDir="uploads/";
    Files.createDirectories(Paths.get(uploadDir));
    String filepath=uploadDir+System.currentTimeMillis()+"-"+file.getOriginalFilename();
Path path=Paths.get(filepath);

Files.write(path,file.getBytes());
TaskAttachment attachment=new TaskAttachment();

attachment.setUploadedBy(currentUser);
attachment.setFileName(file.getOriginalFilename());
attachment.setFilePath(filepath);
attachment.setFileType(file.getContentType());
attachment.setTask(task);
TaskAttachment saved=taskAttachmentRepository.save(attachment);

return TaskAttachmentMapper.toResponse(saved);
    }


private User getCurrentUser() {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));
    }



    public List<TaskAttachmentResponse> getAttachments(
        Long taskId
){


    User currentUser =
            getCurrentUser();



    Task task =
            taskRepository
                    .findById(taskId)
                    .orElseThrow(
                        () -> new RuntimeException(
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

        throw new RuntimeException(
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
