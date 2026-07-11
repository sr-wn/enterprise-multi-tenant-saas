package com.srawan.backend.repository;

import com.srawan.backend.entity.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;



import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.User;
import java.util.List; 


public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long>{


    List<TaskAttachment> findByTask(Task task);

    void deleteByTask(Task task);

    void deleteByUploadedBy(User user);
    
}
