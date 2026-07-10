package com.srawan.backend.repository;

import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
long countByTenantId(Long tenantId);
    boolean existsByEmail(String email);
List<User> findByTenant(Tenant tenant);
    Optional<User> findByEmail(String email);
    
}
