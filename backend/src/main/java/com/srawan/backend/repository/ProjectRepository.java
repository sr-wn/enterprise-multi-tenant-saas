package com.srawan.backend.repository;
import com.srawan.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.srawan.backend.entity.Tenant;
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTenant(Tenant tenant);
}
