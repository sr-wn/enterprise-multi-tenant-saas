package com.srawan.backend.mapper;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.dto.TenantResponse;

public class TenantMapper {

    private TenantMapper(){}
    public static TenantResponse toResponse(Tenant tenant){
        return new TenantResponse(
            tenant.id(),
            tenant.getCompanyName(),
            tenant.getCompanyEmail()
        );
    }
}
