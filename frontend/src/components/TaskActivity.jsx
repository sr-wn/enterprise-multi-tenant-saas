import { useEffect, useState } from "react";
import api from "../api/axios";

function TaskActivity({ taskId }) {
  const [activity, setActivity] = useState([]);

  async function loadActivity() {
    try {
      const response = await api.get(`/tasks/${taskId}/activity`);
      setActivity(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!taskId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadActivity();
  }, [taskId]);

  if (activity.length === 0) return null;

  return (
    <div>
      <h3 className="text-primary font-medium mb-3" style={{ fontSize: "var(--text-sm)" }}>
        Activity
      </h3>
      
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-default before:to-transparent">
        {activity.map((item, index) => {
          
          // Determine icon based on action type (assuming action strings like "STATUS_CHANGE", "CREATED", etc)
          const isStatus = item.action.toLowerCase().includes("status");
          const isCreate = item.action.toLowerCase().includes("creat");
          
          return (
            <div key={index} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5"
                style={{ 
                  backgroundColor: "var(--color-surface-canvas)",
                  border: "2px solid",
                  borderColor: isCreate ? "var(--color-status-done)" : (isStatus ? "var(--color-status-in-progress)" : "var(--color-border-strong)")
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isCreate ? "var(--color-status-done)" : (isStatus ? "var(--color-status-in-progress)" : "var(--color-border-strong)") }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-sm text-secondary leading-tight">
                  <span className="font-medium text-primary">{item.performedBy}</span>
                  {" "}
                  {item.action === "CREATED" ? "created this task" : "changed " + item.action.toLowerCase().replace('_', ' ')}
                  
                  {item.oldValue || item.newValue ? (
                    <span className="ml-1">
                      {item.oldValue && <span className="line-through text-tertiary mr-1">{item.oldValue}</span>}
                      {item.newValue && <span className="font-medium text-primary">{item.newValue}</span>}
                    </span>
                  ) : null}
                </div>
                <div className="text-tertiary mt-0.5" style={{ fontSize: "11px" }}>
                  {new Date(item.createdAt).toLocaleString(undefined, { 
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskActivity;
