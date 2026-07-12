import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
      setError("");
      setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      login(token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 surface-canvas"
    >
      <div className="w-full max-w-sm">
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
            Sign in
          </h1>
          <p
            className="text-secondary text-center mb-6 m-0"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Welcome back to your workspace
          </p>

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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-secondary font-medium mb-1.5"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Email
              </label>
              <input
                id="login-email"
                className="input-base"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-secondary font-medium mb-1.5"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Password
              </label>
              <input
                id="login-password"
                className="input-base"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p
          className="text-center mt-5 text-secondary m-0"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium no-underline hover:underline"
            style={{ color: "var(--color-accent-600)" }}
          >
            Register your company
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
