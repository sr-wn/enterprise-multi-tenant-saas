package com.srawan.backend.mapper;

import com.srawan.backend.entity.TaskActivity;
import com.srawan.backend.dto.TaskActivityResponse;

public class ActivityMapper {

    private ActivityMapper(){}

    public static TaskActivityResponse toResponse(TaskActivity taskActivity) {
        return new TaskActivityResponse(taskActivity.getPerformedBy().getEmail(), taskActivity.getAction(), taskActivity.getOldValue(), taskActivity.getNewValue(), taskActivity.getCreatedAt());
    }
    
}
