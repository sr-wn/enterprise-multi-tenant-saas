import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

function TaskComments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  async function loadComments() {
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      setComments(response.data);
      // Scroll to bottom when loaded
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadComments();
  }, [taskId]);

  async function addComment(e) {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/tasks/${taskId}/comments`, { message });
      setMessage("");
      await loadComments();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-primary font-medium mb-3" style={{ fontSize: "var(--text-sm)" }}>
        Comments
      </h3>

      <div className="surface-canvas border border-default rounded-lg overflow-hidden flex flex-col">
        
        {/* Comment list */}
        <div 
          ref={scrollRef}
          className="p-3 space-y-4 max-h-48 overflow-y-auto"
        >
          {comments.length === 0 ? (
            <p className="text-tertiary text-center text-sm py-4 m-0">No comments yet</p>
          ) : (
            comments.map((comment) => {
              const initials = comment.user ? comment.user[0].toUpperCase() : "U";
              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0 mt-0.5">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-primary font-medium" style={{ fontSize: "var(--text-xs)" }}>
                        {comment.user}
                      </span>
                      {comment.createdAt && (
                        <span className="text-tertiary" style={{ fontSize: "10px" }}>
                          {new Date(comment.createdAt).toLocaleString(undefined, { 
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </div>
                    <div className="text-secondary leading-snug" style={{ fontSize: "var(--text-sm)" }}>
                      {comment.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area */}
        <form onSubmit={addComment} className="border-t border-default p-2 flex gap-2 surface-primary">
          <input
            className="flex-1 bg-transparent border-none text-sm px-2 py-1 outline-none text-primary placeholder:text-tertiary focus:ring-0 focus:outline-none"
            value={message}
            placeholder="Write a comment..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn-primary py-1 px-3 text-xs"
            disabled={loading || !message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskComments;
