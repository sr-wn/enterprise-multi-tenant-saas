package com.srawan.backend.dto;


import java.util.List;


public class DashBoardResponse {


    private String companyName;

    private List<SummaryStat> summary;

    private Velocity velocity;

    private List<StatusBreakdownItem> statusBreakdown;

    private List<PriorityBreakdownItem> priorityBreakdown;

    private List<ProjectStat> projects;

    private List<ActivityItem> activity;

    private Attention attention;


    public DashBoardResponse(
            String companyName,
            List<SummaryStat> summary,
            Velocity velocity,
            List<StatusBreakdownItem> statusBreakdown,
            List<PriorityBreakdownItem> priorityBreakdown,
            List<ProjectStat> projects,
            List<ActivityItem> activity,
            Attention attention
    ){
        this.companyName = companyName;
        this.summary = summary;
        this.velocity = velocity;
        this.statusBreakdown = statusBreakdown;
        this.priorityBreakdown = priorityBreakdown;
        this.projects = projects;
        this.activity = activity;
        this.attention = attention;
    }


    public String getCompanyName(){
        return companyName;
    }

    public List<SummaryStat> getSummary(){
        return summary;
    }

    public Velocity getVelocity(){
        return velocity;
    }

    public List<StatusBreakdownItem> getStatusBreakdown(){
        return statusBreakdown;
    }

    public List<PriorityBreakdownItem> getPriorityBreakdown(){
        return priorityBreakdown;
    }

    public List<ProjectStat> getProjects(){
        return projects;
    }

    public List<ActivityItem> getActivity(){
        return activity;
    }

    public Attention getAttention(){
        return attention;
    }


    public static class SummaryStat {
        private final String key;
        private final String label;
        private final long value;
        private final Long delta;
        private final Double deltaPct;
        private final boolean favorable;
        private final boolean hasTrend;

        public SummaryStat(String key, String label, long value, Long delta, Double deltaPct, boolean favorable, boolean hasTrend){
            this.key = key;
            this.label = label;
            this.value = value;
            this.delta = delta;
            this.deltaPct = deltaPct;
            this.favorable = favorable;
            this.hasTrend = hasTrend;
        }

        public String getKey(){ return key; }
        public String getLabel(){ return label; }
        public long getValue(){ return value; }
        public Long getDelta(){ return delta; }
        public Double getDeltaPct(){ return deltaPct; }
        public boolean isFavorable(){ return favorable; }
        public boolean isHasTrend(){ return hasTrend; }
    }


    public static class Velocity {
        private final List<String> labels;
        private final List<Long> created;
        private final List<Long> completed;

        public Velocity(List<String> labels, List<Long> created, List<Long> completed){
            this.labels = labels;
            this.created = created;
            this.completed = completed;
        }

        public List<String> getLabels(){ return labels; }
        public List<Long> getCreated(){ return created; }
        public List<Long> getCompleted(){ return completed; }
    }


    public static class StatusBreakdownItem {
        private final String status;
        private final long count;

        public StatusBreakdownItem(String status, long count){
            this.status = status;
            this.count = count;
        }

        public String getStatus(){ return status; }
        public long getCount(){ return count; }
    }


    public static class PriorityBreakdownItem {
        private final String priority;
        private final long count;

        public PriorityBreakdownItem(String priority, long count){
            this.priority = priority;
            this.count = count;
        }

        public String getPriority(){ return priority; }
        public long getCount(){ return count; }
    }


    public static class ProjectStat {
        private final Long id;
        private final String name;
        private final String description;
        private final long doneTasks;
        private final long totalTasks;
        private final double progress;
        private final String nextDueDate;
        private final boolean dueSoon;
        private final List<Member> members;

        public ProjectStat(Long id, String name, String description, long doneTasks, long totalTasks, double progress, String nextDueDate, boolean dueSoon, List<Member> members){
            this.id = id;
            this.name = name;
            this.description = description;
            this.doneTasks = doneTasks;
            this.totalTasks = totalTasks;
            this.progress = progress;
            this.nextDueDate = nextDueDate;
            this.dueSoon = dueSoon;
            this.members = members;
        }

        public Long getId(){ return id; }
        public String getName(){ return name; }
        public String getDescription(){ return description; }
        public long getDoneTasks(){ return doneTasks; }
        public long getTotalTasks(){ return totalTasks; }
        public double getProgress(){ return progress; }
        public String getNextDueDate(){ return nextDueDate; }
        public boolean isDueSoon(){ return dueSoon; }
        public List<Member> getMembers(){ return members; }
    }


    public static class Member {
        private final String name;
        private final String email;
        private final String initials;

        public Member(String name, String email, String initials){
            this.name = name;
            this.email = email;
            this.initials = initials;
        }

        public String getName(){ return name; }
        public String getEmail(){ return email; }
        public String getInitials(){ return initials; }
    }


    public static class ActivityItem {
        private final Long id;
        private final String actorName;
        private final String actorEmail;
        private final Long taskId;
        private final String taskTitle;
        private final String type;
        private final String text;
        private final String timestamp;

        public ActivityItem(Long id, String actorName, String actorEmail, Long taskId, String taskTitle, String type, String text, String timestamp){
            this.id = id;
            this.actorName = actorName;
            this.actorEmail = actorEmail;
            this.taskId = taskId;
            this.taskTitle = taskTitle;
            this.type = type;
            this.text = text;
            this.timestamp = timestamp;
        }

        public Long getId(){ return id; }
        public String getActorName(){ return actorName; }
        public String getActorEmail(){ return actorEmail; }
        public Long getTaskId(){ return taskId; }
        public String getTaskTitle(){ return taskTitle; }
        public String getType(){ return type; }
        public String getText(){ return text; }
        public String getTimestamp(){ return timestamp; }
    }


    public static class Attention {
        private final List<AttentionItem> overdue;
        private final List<NotificationItem> notifications;
        private final long unreadCount;

        public Attention(List<AttentionItem> overdue, List<NotificationItem> notifications, long unreadCount){
            this.overdue = overdue;
            this.notifications = notifications;
            this.unreadCount = unreadCount;
        }

        public List<AttentionItem> getOverdue(){ return overdue; }
        public List<NotificationItem> getNotifications(){ return notifications; }
        public long getUnreadCount(){ return unreadCount; }
    }


    public static class AttentionItem {
        private final Long id;
        private final String title;
        private final String dueDate;
        private final String projectName;

        public AttentionItem(Long id, String title, String dueDate, String projectName){
            this.id = id;
            this.title = title;
            this.dueDate = dueDate;
            this.projectName = projectName;
        }

        public Long getId(){ return id; }
        public String getTitle(){ return title; }
        public String getDueDate(){ return dueDate; }
        public String getProjectName(){ return projectName; }
    }


    public static class NotificationItem {
        private final Long id;
        private final String message;
        private final String createdAt;

        public NotificationItem(Long id, String message, String createdAt){
            this.id = id;
            this.message = message;
            this.createdAt = createdAt;
        }

        public Long getId(){ return id; }
        public String getMessage(){ return message; }
        public String getCreatedAt(){ return createdAt; }
    }

}
