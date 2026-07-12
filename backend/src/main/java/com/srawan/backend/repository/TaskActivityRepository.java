package com.srawan.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.TaskActivity;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface TaskActivityRepository extends JpaRepository<TaskActivity, Long> {

    List<TaskActivity> findByTask(Task task);

    void deleteByTask(Task task);

    void deleteByPerformedBy(User user);

    @Query("select a from TaskActivity a where a.task.project.tenant = :tenant order by a.createdAt desc")
    List<TaskActivity> findFeedByTenant(@Param("tenant") Tenant tenant, Pageable pageable);

    @Query("select a from TaskActivity a where a.task.project.tenant = :tenant and a.createdAt >= :since order by a.createdAt desc")
    List<TaskActivity> findSinceByTenant(@Param("tenant") Tenant tenant, @Param("since") LocalDateTime since);

}
