package com.srawan.backend.repository;
import com.srawan.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.srawan.backend.entity.User;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification , Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
}
