package com.srawan.backend.repository;

import com.srawan.backend.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
    
}
