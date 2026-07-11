package com.srawan.backend.repository;
import com.srawan.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;
public interface ProjectRepository extends JpaRepository<Project, Long> {

    long countByTenantId(Long tenantId);
    List<Project> findByTenant(Tenant tenant);
    Page<Project> findByTenant(
        Tenant tenant,
        Pageable pageable
);
    Page<Project> findByTenantAndAssignedTo(
        Tenant tenant,
        User assignedTo,
        Pageable pageable
);
}
