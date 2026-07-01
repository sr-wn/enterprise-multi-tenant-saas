package com.srawan.backend.service;

import com.srawan.backend.dto.TenantResponse;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.repository.TenantRepository;
import com.srawan.backend.dto.RegisterTenantRequest;
import com.srawan.backend.dto.TenantRequest;
import java.util.List;
import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.mapper.TenantMapper;
import com.srawan.backend.enums.Role;

import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.srawan.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import com.srawan.backend.entity.User;
import com.srawan.backend.exception.DuplicateResourceException;



@Service
public class TenantService {
    private final TenantRepository tenantRepository;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    public TenantService(TenantRepository tenantRepository, UserRepository userRepository, PasswordEncoder passwordEncoder  ){
        this.tenantRepository=tenantRepository;
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
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
        User admin=new User(request.adminName(), request.adminEmail(), passwordEncoder.encode(request.adminPassword()));
        admin.setRole(Role.ADMIN);
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


public void deleteTenant(Long id){
    Tenant tenant=tenantRepository.findById(id).orElseThrow(()->new ResourceAccessException("Tenant Not found"));
    tenantRepository.delete(tenant);
}

}
