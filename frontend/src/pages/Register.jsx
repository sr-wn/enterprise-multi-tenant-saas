import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import BrandLogo from "../components/BrandLogo";

function Register() {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/tenants/register", {
        companyName,
        companyEmail,
        adminName,
        adminEmail,
        adminPassword,
      });

      setSuccess("Registration successful. Redirecting to login...");
      setCompanyName("");
      setCompanyEmail("");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to register company.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 surface-canvas">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Link to="/" className="no-underline">
            <BrandLogo size="var(--text-2xl)" dotSize={7} />
          </Link>
        </div>

        {/* Card */}
        <div className="card p-6 sm:p-8">
          <h1
            className="text-primary font-semibold text-center mb-1 m-0"
            style={{ fontSize: "var(--text-xl)" }}
          >
            Register your company
          </h1>
          <p
            className="text-secondary text-center mb-6 m-0"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Set up your workspace in under a minute
          </p>

          {/* Success */}
          {success && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg"
              style={{
                backgroundColor: "rgba(34,197,94,0.08)",
                color: "var(--color-success)",
                fontSize: "var(--text-sm)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                color: "var(--color-error)",
                fontSize: "var(--text-sm)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Company Section */}
            <div>
              <h2
                className="text-secondary font-medium mb-3 m-0 pb-2 border-b border-default"
                style={{ fontSize: "var(--text-sm)", letterSpacing: "0.03em", textTransform: "uppercase" }}
              >
                Company Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="reg-company-name" className="block text-secondary font-medium mb-1.5" style={{ fontSize: "var(--text-sm)" }}>
                    Company name
                  </label>
                  <input
                    id="reg-company-name"
                    className="input-base"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reg-company-email" className="block text-secondary font-medium mb-1.5" style={{ fontSize: "var(--text-sm)" }}>
                    Company email
                  </label>
                  <input
                    id="reg-company-email"
                    className="input-base"
                    type="email"
                    placeholder="hello@acme.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Admin Section */}
            <div>
              <h2
                className="text-secondary font-medium mb-3 m-0 pb-2 border-b border-default"
                style={{ fontSize: "var(--text-sm)", letterSpacing: "0.03em", textTransform: "uppercase" }}
              >
                Admin Account
              </h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="reg-admin-name" className="block text-secondary font-medium mb-1.5" style={{ fontSize: "var(--text-sm)" }}>
                    Full name
                  </label>
                  <input
                    id="reg-admin-name"
                    className="input-base"
                    placeholder="Jane Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reg-admin-email" className="block text-secondary font-medium mb-1.5" style={{ fontSize: "var(--text-sm)" }}>
                    Admin email
                  </label>
                  <input
                    id="reg-admin-email"
                    className="input-base"
                    type="email"
                    placeholder="jane@acme.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reg-admin-password" className="block text-secondary font-medium mb-1.5" style={{ fontSize: "var(--text-sm)" }}>
                    Password
                  </label>
                  <input
                    id="reg-admin-password"
                    className="input-base"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" strokeOpacity="1" />
                  </svg>
                  Creating workspace...
                </>
              ) : (
                "Create workspace"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-5 text-secondary m-0"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Already registered?{" "}
          <Link
            to="/login"
            className="font-medium no-underline hover:underline"
            style={{ color: "var(--color-accent-600)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;