package com.srawan.backend.repository;
import com.srawan.backend.entity.TaskComment;
import com.srawan.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTask(Task task);
    
}
