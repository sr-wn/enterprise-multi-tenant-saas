package com.srawan.backend.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private String title;
 private String description;
 private String status;
 private String priority;
 private LocalDate dueDate;
 private LocalDateTime createdAt;

@ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
@JoinColumn(name = "project_id")
 private Project project;

 @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
 @JoinColumn(name = "assigned_to")
 private User assignedTo;

 @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
 @JoinColumn(name = "created_by")
 private User createdBy;


 @PrePersist
 public void beforeSave(){
     this.createdAt=LocalDateTime.now();
 }

 public Task(){}

 public Long getId(){
     return id;
 }

 public void setId(Long id){
     this.id=id;
 }

 public String getTitle(){
     return title;
 }

 public void setTitle(String title){
     this.title=title;
 }

 public String getDescription(){
     return description;
 }

 public void setDescription(String description){
     this.description=description;
 }

 public String getStatus(){
     return status;
 }

 public void setStatus(String status){
     this.status=status;
 }

 public String getPriority(){
     return priority;
 }

 public void setPriority(String priority){
     this.priority=priority;
 }

 public LocalDate getDueDate(){
     return dueDate;
 }

 public void setDueDate(LocalDate dueDate){
     this.dueDate=dueDate;
 }

 public LocalDateTime getCreatedAt(){
     return createdAt;
 }

 public void setCreatedAt(LocalDateTime createdAt){
     this.createdAt=createdAt;
 }

 public Project getProject(){
     return project;
 }

 public void setProject(Project project){
     this.project=project;
 }

 public User getAssignedTo(){
     return assignedTo;
 }

 public void setAssignedTo(User assignedTo){
     this.assignedTo=assignedTo;
 }

 public User getCreatedBy(){
     return createdBy;
 }

 public void setCreatedBy(User createdBy){
     this.createdBy=createdBy;
 }
    
}
