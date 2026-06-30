package com.srawan.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.srawan.backend.entity.Tenant;
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    boolean existsByCompanyEmail(String companyEmail);
}
