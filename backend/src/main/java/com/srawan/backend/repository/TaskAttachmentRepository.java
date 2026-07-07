package com.srawan.backend.repository;

import com.srawan.backend.entity.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;



import com.srawan.backend.entity.Task;
import java.util.List; 


public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long>{


    List<TaskAttachment> findByTask(Task task);
    
}
