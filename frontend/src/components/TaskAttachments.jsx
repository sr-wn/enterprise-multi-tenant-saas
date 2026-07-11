import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

function TaskAttachments({ taskId }) {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  async function loadAttachments() {
    try {
      const response = await api.get(`/tasks/${taskId}/attachments`);
      setAttachments(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function uploadAttachment(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      loadAttachments();
    } catch (err) {
      console.log(err);
      setError("Unable to upload attachment.");
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function formatBytes(bytes, decimals = 1) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-primary font-medium m-0" style={{ fontSize: "var(--text-sm)" }}>
          Attachments
        </h3>
        
        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={uploadAttachment}
            className="hidden"
            id={`file-upload-${taskId}`}
          />
          <label 
            htmlFor={`file-upload-${taskId}`}
            className={`btn-ghost py-1 px-2 text-xs cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
            {uploading ? "Uploading..." : "Attach file"}
          </label>
        </div>
      </div>

      {error && <p className="text-error text-xs mb-2 m-0">{error}</p>}

      {attachments.length === 0 ? (
        <p className="text-tertiary text-sm italic m-0">No attachments</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.filePath}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2 border border-default rounded-lg hover:border-strong hover:bg-black/5 dark:hover:bg-white/5 transition-fast no-underline group"
            >
              <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/10 flex items-center justify-center text-secondary group-hover:text-primary transition-fast">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-primary font-medium text-sm truncate">
                  {attachment.fileName}
                </div>
                <div className="text-tertiary text-xs truncate">
                  {attachment.uploadedBy} • {formatBytes(attachment.fileSize || 0)}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskAttachments;
