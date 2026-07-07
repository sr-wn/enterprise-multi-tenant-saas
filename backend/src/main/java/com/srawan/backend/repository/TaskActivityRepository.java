package com.srawan.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.TaskActivity;

public interface TaskActivityRepository extends JpaRepository<TaskActivity, Long> {

    List<TaskActivity> findByTask(Task task);

    
}
