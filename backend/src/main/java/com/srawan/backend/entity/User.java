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
    private String Fullname;

    @Column(nullable = false, unique = true)
    private String Email;

    @Column(nullable = false)
    private String Password;


    public User(String fullname, String email, String password){
        this.Fullname=fullname;
        this.Email=email;
        this.Password=password;
    }

    public Long getId(){
        return id;
    }

    public String getFullname(){
        return Fullname;
    }

    public void setFullname(String fullname){
        this.Fullname=fullname;
    }

    public String getEmail(){
        return Email;
    }

    public void setEmail(String email){
        this.Email=email;
    }

    public String getPassword(){
        return Password;
    }

    public void setPassword(String password){
        this.Password=password;
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
}
