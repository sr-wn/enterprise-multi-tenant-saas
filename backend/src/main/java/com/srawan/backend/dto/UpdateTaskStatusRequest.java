package com.srawan.backend.dto;
import com.srawan.backend.enums.TaskStatus;

public class UpdateTaskStatusRequest {
    private TaskStatus status;

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
}
