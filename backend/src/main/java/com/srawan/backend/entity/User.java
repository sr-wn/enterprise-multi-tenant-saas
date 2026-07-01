package com.srawan.backend.entity;

import jakarta.persistence.*;
import com.srawan.backend.enums.Role;

@Entity
@Table(name="users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

public User(){}

    public User(String fullname, String email, String password){
        this.fullname=fullname;
        this.email=email;
        this.password=password;
    }

    public Long getId(){
        return id;
    }

    public String getFullname(){
        return fullname;
    }

    public void setFullname(String fullname){
        this.fullname=fullname;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email=email;
    }

    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password=password;
    }


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id",nullable=false)
    private Tenant tenant;


    public Tenant getTenant(){
        return tenant;
    }

    public void setTenant(Tenant tenant){
        this.tenant=tenant;
    }


    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Role role;

    public Role getRole(){
        return role;
    }

    public void setRole(Role role){
        this.role=role;
    }
}
