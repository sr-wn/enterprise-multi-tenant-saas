package com.srawan.backend.service;

import com.srawan.backend.dto.DashBoardResponse;

import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.TaskActivity;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;

import com.srawan.backend.enums.TaskStatus;

import com.srawan.backend.repository.NotificationRepository;
import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.TaskActivityRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.exception.ResourceNotFoundException;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class DashBoardService {


    private final ProjectRepository projectRepository;

    private final TaskRepository taskRepository;

    private final UserRepository userRepository;

    private final TaskActivityRepository taskActivityRepository;

    private final NotificationRepository notificationRepository;


    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private static final DateTimeFormatter WEEK_FMT = DateTimeFormatter.ofPattern("MMM d", Locale.ENGLISH);


    public DashBoardService(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            UserRepository userRepository,
            TaskActivityRepository taskActivityRepository,
            NotificationRepository notificationRepository
    ){
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskActivityRepository = taskActivityRepository;
        this.notificationRepository = notificationRepository;
    }


    public DashBoardResponse getDashboard(){

        User currentUser = getCurrentUser();
        Tenant tenant = currentUser.getTenant();

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime fourteenDaysAgo = now.minusDays(14);
        LocalDateTime fourWeeksAgo = now.minusDays(28);

        List<Task> tasks =
                taskRepository.findByProjectTenant(tenant, Pageable.unpaged()).getContent();

        List<Project> projects =
                projectRepository.findByTenant(tenant, Pageable.unpaged()).getContent();

        long totalUsers = userRepository.countByTenantId(tenant.id());

        List<TaskActivity> feed =
                taskActivityRepository.findFeedByTenant(
                        tenant, Pageable.ofSize(12));

        List<TaskActivity> completionActivities =
                taskActivityRepository.findSinceByTenant(
                        tenant, fourWeeksAgo);


        // ---- Summary strip ----
        long activeProjects = projects.size();
        long newProjectsThisWeek = countCreatedInWindow(projects, sevenDaysAgo, now);
        long newProjectsLastWeek = countCreatedInWindow(projects, fourteenDaysAgo, sevenDaysAgo);

        long openTasks = tasks.stream().filter(t -> t.getStatus() != TaskStatus.DONE).count();
        long createdThisWeek = countTasksCreatedInWindow(tasks, sevenDaysAgo, now);
        long createdLastWeek = countTasksCreatedInWindow(tasks, fourteenDaysAgo, sevenDaysAgo);
        long completedThisWeek = countCompletionsInWindow(completionActivities, sevenDaysAgo, now);
        long completedLastWeek = countCompletionsInWindow(completionActivities, fourteenDaysAgo, sevenDaysAgo);
        long openChangeThis = createdThisWeek - completedThisWeek;
        long openChangeLast = createdLastWeek - completedLastWeek;

        long overdueTasks = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getStatus() != TaskStatus.DONE && t.getDueDate().isBefore(today))
                .count();
        long overdueThisWeek = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getStatus() != TaskStatus.DONE
                        && t.getDueDate().isBefore(today)
                        && !t.getDueDate().isBefore(sevenDaysAgo.toLocalDate()))
                .count();
        long overdueLastWeek = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getStatus() != TaskStatus.DONE
                        && t.getDueDate().isBefore(sevenDaysAgo.toLocalDate())
                        && !t.getDueDate().isBefore(fourteenDaysAgo.toLocalDate()))
                .count();


        List<DashBoardResponse.SummaryStat> summary = new ArrayList<>();
        summary.add(buildStat("activeProjects", "Active Projects", activeProjects,
                newProjectsThisWeek - newProjectsLastWeek, newProjectsLastWeek, true));
        summary.add(buildStat("openTasks", "Open Tasks", openTasks,
                openChangeThis - openChangeLast, openChangeLast, false));
        summary.add(buildStat("overdueTasks", "Overdue Tasks", overdueTasks,
                overdueThisWeek - overdueLastWeek, overdueLastWeek, false));
        summary.add(buildStat("completedThisWeek", "Completed This Week", completedThisWeek,
                completedThisWeek - completedLastWeek, completedLastWeek, true));
        summary.add(new DashBoardResponse.SummaryStat(
                "teamMembers", "Team Members", totalUsers, null, null, true, false));


        // ---- Velocity (last 4 weeks) ----
        DashBoardResponse.Velocity velocity = buildVelocity(tasks, completionActivities, today);


        // ---- Breakdowns ----
        List<DashBoardResponse.StatusBreakdownItem> statusBreakdown = buildStatusBreakdown(tasks);
        List<DashBoardResponse.PriorityBreakdownItem> priorityBreakdown = buildPriorityBreakdown(tasks);


        // ---- Projects overview ----
        List<DashBoardResponse.ProjectStat> projectStats = buildProjectStats(projects, today);


        // ---- Activity feed ----
        List<DashBoardResponse.ActivityItem> activityItems = buildActivityFeed(feed);


        // ---- Attention panel ----
        DashBoardResponse.Attention attention = buildAttention(currentUser, today);


        return new DashBoardResponse(
                tenant.getCompanyName(),
                summary,
                velocity,
                statusBreakdown,
                priorityBreakdown,
                projectStats,
                activityItems,
                attention
        );

    }


    private DashBoardResponse.SummaryStat buildStat(
            String key, String label, long value, long delta, long prev, boolean upIsGood){

        Double pct = computePct(delta, prev);
        return new DashBoardResponse.SummaryStat(
                key, label, value, delta, pct, upIsGood ? delta >= 0 : delta <= 0, true);
    }


    private Double computePct(long delta, long prev){
        if(prev == 0){
            return delta > 0 ? 100.0 : 0.0;
        }
        return Math.round((delta * 100.0 / prev) * 10.0) / 10.0;
    }


    private long countCreatedInWindow(List<Project> projects, LocalDateTime from, LocalDateTime to){
        return projects.stream()
                .filter(p -> p.getCreatedAt() != null
                        && !p.getCreatedAt().isBefore(from)
                        && p.getCreatedAt().isBefore(to))
                .count();
    }


    private long countTasksCreatedInWindow(List<Task> tasks, LocalDateTime from, LocalDateTime to){
        return tasks.stream()
                .filter(t -> t.getCreatedAt() != null
                        && !t.getCreatedAt().isBefore(from)
                        && t.getCreatedAt().isBefore(to))
                .count();
    }


    private long countCompletionsInWindow(List<TaskActivity> activities, LocalDateTime from, LocalDateTime to){
        return activities.stream()
                .filter(a -> "STATUS CHANGED".equals(a.getAction())
                        && "DONE".equals(a.getNewValue())
                        && !a.getCreatedAt().isBefore(from)
                        && a.getCreatedAt().isBefore(to))
                .count();
    }


    private DashBoardResponse.Velocity buildVelocity(List<Task> tasks, List<TaskActivity> completions, LocalDate today){
        List<String> labels = new ArrayList<>();
        List<Long> created = new ArrayList<>();
        List<Long> completed = new ArrayList<>();

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        for(int i = 3; i >= 0; i--){
            LocalDate weekStart = monday.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(7);

            labels.add(weekStart.format(WEEK_FMT));

            long createdCount = tasks.stream()
                    .filter(t -> t.getCreatedAt() != null)
                    .filter(t -> {
                        LocalDate d = t.getCreatedAt().toLocalDate();
                        return !d.isBefore(weekStart) && d.isBefore(weekEnd);
                    })
                    .count();

            long completedCount = completions.stream()
                    .filter(a -> "STATUS CHANGED".equals(a.getAction()) && "DONE".equals(a.getNewValue()))
                    .filter(a -> {
                        LocalDate d = a.getCreatedAt().toLocalDate();
                        return !d.isBefore(weekStart) && d.isBefore(weekEnd);
                    })
                    .count();

            created.add(createdCount);
            completed.add(completedCount);
        }

        return new DashBoardResponse.Velocity(labels, created, completed);
    }


    private List<DashBoardResponse.StatusBreakdownItem> buildStatusBreakdown(List<Task> tasks){
        Map<TaskStatus, Long> counts = tasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));

        List<DashBoardResponse.StatusBreakdownItem> result = new ArrayList<>();
        for(TaskStatus status : TaskStatus.values()){
            result.add(new DashBoardResponse.StatusBreakdownItem(
                    status.name(), counts.getOrDefault(status, 0L)));
        }
        return result;
    }


    private List<DashBoardResponse.PriorityBreakdownItem> buildPriorityBreakdown(List<Task> tasks){
        Map<String, Long> grouped = tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> {
                            String p = t.getPriority();
                            return (p == null || p.isBlank()) ? "None" : p;
                        },
                        Collectors.counting()
                ));

        return grouped.entrySet().stream()
                .map(e -> new DashBoardResponse.PriorityBreakdownItem(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(DashBoardResponse.PriorityBreakdownItem::getCount).reversed())
                .collect(Collectors.toList());
    }


    private List<DashBoardResponse.ProjectStat> buildProjectStats(List<Project> projects, LocalDate today){
        List<DashBoardResponse.ProjectStat> result = new ArrayList<>();

        for(Project project : projects){
            List<Task> projectTasks = taskRepository.findByProject(project);
            long total = projectTasks.size();
            long done = projectTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
            double progress = total == 0 ? 0.0 : Math.round((done * 100.0 / total) * 10.0) / 10.0;

            LocalDate nextDue = null;
            for(Task t : projectTasks){
                if(t.getStatus() != TaskStatus.DONE && t.getDueDate() != null){
                    if(nextDue == null || t.getDueDate().isBefore(nextDue)){
                        nextDue = t.getDueDate();
                    }
                }
            }
            boolean dueSoon = nextDue != null && !nextDue.isAfter(today.plusDays(3));

            List<DashBoardResponse.Member> members = new ArrayList<>();
            Map<Long, User> seen = new LinkedHashMap<>();
            for(Task t : projectTasks){
                User u = t.getAssignedTo();
                if(u != null && !seen.containsKey(u.getId())){
                    seen.put(u.getId(), u);
                }
            }
            for(User u : seen.values()){
                members.add(new DashBoardResponse.Member(
                        u.getFullname(), u.getEmail(), initialsOf(u)));
            }

            result.add(new DashBoardResponse.ProjectStat(
                    project.getId(),
                    project.getName(),
                    project.getDescription(),
                    done,
                    total,
                    progress,
                    nextDue == null ? null : nextDue.format(DATE_FMT),
                    dueSoon,
                    members
            ));
        }

        return result;
    }


    private List<DashBoardResponse.ActivityItem> buildActivityFeed(List<TaskActivity> feed){
        List<DashBoardResponse.ActivityItem> result = new ArrayList<>();

        for(TaskActivity a : feed){
            if(a.getTask() == null){
                continue;
            }
            User actor = a.getPerformedBy();
            String actorName = actor != null && actor.getFullname() != null
                    ? actor.getFullname() : (actor != null ? actor.getEmail() : "Someone");
            String actorEmail = actor != null ? actor.getEmail() : "";
            String title = a.getTask().getTitle();
            String type = deriveType(a.getAction());
            String text = deriveText(a, title);

            result.add(new DashBoardResponse.ActivityItem(
                    a.getId(),
                    actorName,
                    actorEmail,
                    a.getTask().getId(),
                    title,
                    type,
                    text,
                    a.getCreatedAt() == null ? null : a.getCreatedAt().format(TS_FMT)
            ));
        }

        return result;
    }


    private String deriveType(String action){
        if(action == null) return "activity";
        if("STATUS CHANGED".equals(action)) return "status";
        if("TASK UPDATED".equals(action)) return "update";
        if(action.contains("COMMENT")) return "comment";
        if(action.contains("ATTACHMENT")) return "attachment";
        return "activity";
    }


    private String deriveText(TaskActivity a, String title){
        String action = a.getAction();
        if("STATUS CHANGED".equals(action)){
            String newStatus = a.getNewValue() == null ? "" : a.getNewValue();
            if("DONE".equals(newStatus)){
                return "moved '" + title + "' to Done";
            }
            return "moved '" + title + "' from " + lower(a.getOldValue()) + " to " + lower(newStatus);
        }
        if("TASK UPDATED".equals(action)){
            return "updated details of '" + title + "'";
        }
        if(action != null && action.contains("COMMENT")){
            return "commented on '" + title + "'";
        }
        if(action != null && action.contains("ATTACHMENT")){
            return "added an attachment to '" + title + "'";
        }
        return "updated '" + title + "'";
    }


    private String lower(String value){
        return value == null ? "" : value.toLowerCase().replace('_', ' ');
    }


    private DashBoardResponse.Attention buildAttention(User currentUser, LocalDate today){
        List<Task> myTasks = taskRepository.findByAssignedTo(currentUser);

        List<DashBoardResponse.AttentionItem> overdue = myTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getStatus() != TaskStatus.DONE && t.getDueDate().isBefore(today))
                .sorted(Comparator.comparing(Task::getDueDate))
                .limit(8)
                .map(t -> new DashBoardResponse.AttentionItem(
                        t.getId(),
                        t.getTitle(),
                        t.getDueDate().format(DATE_FMT),
                        t.getProject() != null ? t.getProject().getName() : null
                ))
                .collect(Collectors.toList());

        List<DashBoardResponse.NotificationItem> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(currentUser, Pageable.ofSize(6))
                        .stream()
                        .map(n -> new DashBoardResponse.NotificationItem(
                                n.getId(),
                                n.getMessage(),
                                n.getCreatedAt() == null ? null : n.getCreatedAt().format(TS_FMT)
                        ))
                        .collect(Collectors.toList());

        long unreadCount = notificationRepository.countByUserAndReadStatusFalse(currentUser);

        return new DashBoardResponse.Attention(overdue, notifications, unreadCount);
    }


    private String initialsOf(User user){
        String source = (user.getFullname() != null && !user.getFullname().isBlank())
                ? user.getFullname() : user.getEmail();
        if(source == null || source.isBlank()){
            return "?";
        }
        String[] parts = source.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < Math.min(2, parts.length); i++){
            if(!parts[i].isEmpty()){
                sb.append(Character.toUpperCase(parts[i].charAt(0)));
            }
        }
        return sb.toString();
    }


    private User getCurrentUser(){
        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

}
