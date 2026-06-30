package com.srawan.backend.service;

import com.srawan.backend.dto.TenantResponse;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.repository.TenantRepository;
import com.srawan.backend.dto.TenantRequest;
import java.util.List;
import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.mapper.TenantMapper;

import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import com.srawan.backend.exception.DuplicateResourceException;


@Service
public class TenantService {
    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository){
        this.tenantRepository=tenantRepository;
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
