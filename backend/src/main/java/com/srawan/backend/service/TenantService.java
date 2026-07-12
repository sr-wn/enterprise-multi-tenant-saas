package com.srawan.backend.service;

import com.srawan.backend.dto.TenantResponse;
import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;
import com.srawan.backend.repository.TenantRepository;
import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.repository.NotificationRepository;
import com.srawan.backend.repository.TaskActivityRepository;
import com.srawan.backend.dto.RegisterTenantRequest;
import com.srawan.backend.dto.TenantRequest;
import java.util.List;
import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.DuplicateResourceException;
import com.srawan.backend.exception.UnauthorizedActionException;
import com.srawan.backend.mapper.TenantMapper;
import com.srawan.backend.enums.Role;

import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Pageable;

import jakarta.transaction.Transactional;



@Service
public class TenantService {
    private final TenantRepository tenantRepository;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectService projectService;
    private final NotificationRepository notificationRepository;
    private final TaskActivityRepository taskActivityRepository;



    public TenantService(
            TenantRepository tenantRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ProjectService projectService,
            NotificationRepository notificationRepository,
            TaskActivityRepository taskActivityRepository
    ){
        this.tenantRepository=tenantRepository;
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.projectService=projectService;
        this.notificationRepository=notificationRepository;
        this.taskActivityRepository=taskActivityRepository;
    }

@Transactional
    public TenantResponse registerTenant(RegisterTenantRequest request){
        if(tenantRepository.existsByCompanyEmail(request.companyEmail())){
            throw new DuplicateResourceException("Tenant with email Already Exists");
        }

        if(userRepository.existsByEmail(request.adminEmail())){
            throw new DuplicateResourceException("Admin with email Already Exists");
        }
        Tenant tenant=new Tenant(request.companyName(), request.companyEmail());
        Tenant savedTenant=tenantRepository.save(tenant);
        User admin=new User(request.adminName(), request.adminEmail(), passwordEncoder.encode(request.adminPassword()), Role.ADMIN);
        admin.setTenant(savedTenant);
        User savedAdmin=userRepository.save(admin);
        return TenantMapper.toResponse(savedTenant);
    }

    

    public TenantResponse createTenant(TenantRequest request){

        if(tenantRepository.existsByCompanyEmail(request.companyEmail())){
        throw new DuplicateResourceException("Tenant with email already exists");
    }
        Tenant tenant=new Tenant(request.companyName(), request.companyEmail());
        Tenant savedTenant=tenantRepository.save(tenant);

        return TenantMapper.toResponse((savedTenant));
    }


    public List<TenantResponse> getAllTenants(){
        return tenantRepository.findAll()
        .stream()
        .map(tenant->TenantMapper.toResponse(tenant))
        .collect(Collectors.toList());
    }

    public TenantResponse getTenantById(Long id){
        Tenant tenant=tenantRepository.findById(id)
        .orElseThrow(()->new ResourceNotFoundException("Tenant not found"));
return TenantMapper.toResponse(tenant);
    }


    public TenantResponse updateTenant(Long id , TenantRequest request){
        Tenant tenant=tenantRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Tenant not found"));
    
        tenant.setCompanyName(request.companyName());
    tenant.setCompanyEmail(request.companyEmail());
Tenant updatedTenant=tenantRepository.save(tenant);

return TenantMapper.toResponse(updatedTenant);
    }


@Transactional
    public void dissolveTenant(){
        User currentUser = getCurrentUser();

        if(!Role.ADMIN.name().equals(currentUser.getRole().name())){
            throw new UnauthorizedActionException("Only an admin can dissolve the tenancy");
        }

        Tenant tenant = currentUser.getTenant();

        // 1. Delete all projects (cascades tasks + their activities/comments/attachments)
        projectService
                .getProjects(Pageable.unpaged())
                .getContent()
                .forEach(project -> projectService.deleteProject(project.getId()));

        // 2. Delete users (notifications + activities first to satisfy FK constraints)
        for(User user : userRepository.findByTenant(tenant)){
            notificationRepository.deleteByUser(user);
            taskActivityRepository.deleteByPerformedBy(user);
            userRepository.delete(user);
        }

        // 3. Finally remove the tenant itself
        tenantRepository.delete(tenant);
    }


    private User getCurrentUser(){
        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

}
