package com.srawan.backend.service;

import com.srawan.backend.dto.CreateUserRequest;
import com.srawan.backend.dto.UserResponse;

import com.srawan.backend.entity.User;
import com.srawan.backend.entity.Task;

import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.TaskCommentRepository;
import com.srawan.backend.repository.TaskActivityRepository;
import com.srawan.backend.repository.TaskAttachmentRepository;
import com.srawan.backend.repository.NotificationRepository;

import com.srawan.backend.exception.DuplicateResourceException;
import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.UnauthorizedActionException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final TaskRepository taskRepository;

    private final TaskCommentRepository taskCommentRepository;

    private final TaskActivityRepository taskActivityRepository;

    private final TaskAttachmentRepository taskAttachmentRepository;

    private final NotificationRepository notificationRepository;



    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TaskRepository taskRepository, TaskCommentRepository taskCommentRepository, TaskActivityRepository taskActivityRepository, TaskAttachmentRepository taskAttachmentRepository, NotificationRepository notificationRepository) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.taskRepository = taskRepository;

        this.taskCommentRepository = taskCommentRepository;

        this.taskActivityRepository = taskActivityRepository;

        this.taskAttachmentRepository = taskAttachmentRepository;

        this.notificationRepository = notificationRepository;

    }   





    public UserResponse createUser(CreateUserRequest request){


        if(userRepository.existsByEmail(request.email())){


            throw new DuplicateResourceException(
                "User with email already exists"
            );


        }



        User admin=(User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();





        User user=new User(

            request.fullName(),

            request.email(),

            passwordEncoder.encode(
                request.password()
            ),

            request.role()

        );





        user.setTenant(
            admin.getTenant()
        );





        User savedUser=userRepository.save(user);




        return new UserResponse(

            savedUser.getId(),

            savedUser.getFullname(),

            savedUser.getEmail(),

            savedUser.getRole()

        );

    }

    public org.springframework.data.domain.Page<UserResponse> getUsers(org.springframework.data.domain.Pageable pageable){

        User currentUser =
                getCurrentUser();



    return userRepository

            .findByTenant(
                    currentUser.getTenant(),
                    pageable
            )

            .map(user ->

                new UserResponse(

                    user.getId(),

                    user.getFullname(),

                    user.getEmail(),

                    user.getRole()

                )

            );

}


 @Transactional
 public void deleteUser(Long userId){

    User admin = getCurrentUser();

    User target = userRepository.findById(userId)
            .orElseThrow(
                    () -> new ResourceNotFoundException("User not found")
            );

    if(!target.getTenant().id().equals(admin.getTenant().id())){
        throw new UnauthorizedActionException(
            "Cannot delete a user from another tenant"
        );
    }

    if(target.getId().equals(admin.getId())){
        throw new UnauthorizedActionException(
            "You cannot delete your own account"
        );
    }

    // Remove artifacts authored by the user
    notificationRepository.deleteByUser(target);
    taskCommentRepository.deleteByUser(target);
    taskAttachmentRepository.deleteByUploadedBy(target);
    taskActivityRepository.deleteByPerformedBy(target);

    // Reassign the user's tasks to the admin so work is preserved
    for(Task task : taskRepository.findByAssignedTo(target)){
        task.setAssignedTo(admin);
        taskRepository.save(task);
    }

    for(Task task : taskRepository.findByCreatedBy(target)){
        task.setCreatedBy(admin);
        taskRepository.save(task);
    }

    userRepository.delete(target);

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
                    () -> new RuntimeException("User not found")
            );
 }


}