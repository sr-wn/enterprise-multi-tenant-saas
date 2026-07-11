package com.srawan.backend.repository;
import com.srawan.backend.entity.TaskComment;
import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTask(Task task);

    void deleteByTask(Task task);

    void deleteByUser(User user);
    
}
