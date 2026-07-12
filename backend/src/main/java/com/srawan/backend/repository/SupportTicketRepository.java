package com.srawan.backend.repository;

import com.srawan.backend.entity.SupportTicket;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByTenantAndRequester(Tenant tenant, User requester);

    List<SupportTicket> findByTenant(Tenant tenant);

    Optional<SupportTicket> findByIdAndTenant(Long id, Tenant tenant);
}
