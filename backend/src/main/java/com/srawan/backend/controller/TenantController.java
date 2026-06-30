package com.srawan.backend.controller;



import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.srawan.backend.service.TenantService;
import com.srawan.backend.dto.TenantRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.srawan.backend.dto.TenantResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;
    
    public TenantController(TenantService tenantService){
        this.tenantService=tenantService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TenantResponse createTenant(@RequestBody TenantRequest request){
        return tenantService.createTenant(request);
    }
@GetMapping
public List<TenantResponse> getAllTenants(){
    return tenantService.getAllTenants();
}

    @GetMapping("/{id}")
    public TenantResponse getTenantById(@PathVariable Long id){
        return tenantService.getTenantById(id);
    }


    @PutMapping("/{id}")
    public TenantResponse updateTenant(@PathVariable Long id, @RequestBody TenantRequest request){
        return tenantService.updateTenant(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTenant(@PathVariable Long id){
        tenantService.deleteTenant(id);
    }

}
