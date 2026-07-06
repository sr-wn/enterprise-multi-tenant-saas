package com.srawan.backend.repository;

import com.srawan.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.User;


public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);
    List<Task> findByAssignedTo(User user);
    
}
