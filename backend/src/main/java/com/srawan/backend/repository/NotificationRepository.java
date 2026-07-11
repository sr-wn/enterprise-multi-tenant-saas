package com.srawan.backend.repository;
import com.srawan.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.srawan.backend.entity.User;

public interface NotificationRepository extends JpaRepository<Notification , Long> {

   Page<Notification> findByUserOrderByCreatedAtDesc(

        User user,

        Pageable pageable

);

   long countByUserAndReadStatusFalse(User user);

   void deleteByUser(User user);
    
}
