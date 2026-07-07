package com.srawan.backend.repository;

import com.srawan.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.User;
import com.srawan.backend.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface TaskRepository extends JpaRepository<Task, Long> {
long countByProjectTenantId(Long tenantId);


long countByProjectTenantIdAndStatus(
        Long tenantId,
        TaskStatus status
);
    List<Task> findByProject(Project project);
    Page<Task> findByAssignedTo(
        User user,
        Pageable pageable
);
    
}
