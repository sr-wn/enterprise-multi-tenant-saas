package com.srawan.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Column;

@Entity
@Table(name="tenants")
public class Tenant {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String companyName;

    @Column(nullable=false , unique=true)
    private String companyEmail;

    public Tenant(){
        
    }

    public Tenant(String companyName, String companyEmail){
        this.companyName = companyName;
        this.companyEmail = companyEmail;
    }

    public Long id(){
        return id;
    }

    public String getCompanyName(){
        return companyName;
    }

    public void setCompanyName(String companyName){
        this.companyName = companyName;
    }

    public String getCompanyEmail(){
        return companyEmail;
    }
  public void setCompanyEmail(String companyEmail){
        this.companyEmail = companyEmail;
    }



    @OneToMany(mappedBy="tenant",
        cascade=jakarta.persistence.CascadeType.ALL,
        orphanRemoval=true
    )
    private List<User> users=new ArrayList<>();
}
