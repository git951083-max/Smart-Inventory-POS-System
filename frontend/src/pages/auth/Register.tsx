import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { registerUser } from "../../service/auth.service";

// ── Role options from User model ──────────────────────────────────────────────
const ROLES = [
  { value: "USER", label: "User", icon: "👤", desc: "Basic access" },
  { value: "EMPLOYEE", label: "Employee", icon: "🧑‍💼", desc: "Staff member" },
  { value: "MANAGER", label: "Manager", icon: "📊", desc: "Team manager" },
  { value: "ADMIN", label: "Admin", icon: "🛡️", desc: "Full control" },
];

// ── Eye icons ─────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Floating orb component ────────────────────────────────────────────────────
function Orb({ className }: { className: string }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />;
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // ── Mount animation ───────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Grid lines fade in
      tl.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 }
      );

      // Orbs animate in chaotically then settle
      tl.fromTo(
        [orb1Ref.current, orb2Ref.current, orb3Ref.current],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, stagger: 0.15, ease: "elastic.out(1, 0.5)" },
        "<0.2"
      );

      // Card slides up + fade
      tl.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, rotateX: 8, scale: 0.96 },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1, ease: "expo.out" },
        "<0.3"
      );

      // Logo pops
      tl.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(2)" },
        "<0.1"
      );

      // Heading words stagger
      tl.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "<0.15"
      );

      // Fields cascade in
      tl.fromTo(
        fieldRefs.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        "<0.1"
      );

      // Button bounces in
      tl.fromTo(
        btnRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" },
        "<0.1"
      );

      // Continuous orb float
      gsap.to(orb1Ref.current, {
        y: -30,
        x: 20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orb2Ref.current, {
        y: 25,
        x: -15,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
      gsap.to(orb3Ref.current, {
        y: -20,
        x: 25,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Button hover animation ─────────────────────────────────────────────────
  const handleBtnEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleBtnLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // ── Error shake ────────────────────────────────────────────────────────────
  const shakeCard = () => {
    gsap.to(cardRef.current, {
      x: -8,
      duration: 0.07,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut",
      onComplete: () => gsap.set(cardRef.current, { x: 0 }),
    });
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Button press animation
    gsap.to(btnRef.current, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });

    try {
      await registerUser(formData);

      // Success: card flies up and out
      gsap.to(cardRef.current, {
        y: -40,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => navigate("/login"),
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Registration failed");
      shakeCard();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050810] px-4"
      style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* ── Grid Background ── */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Radial vignette ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, #050810 80%)",
        }}
      />

      {/* ── Orbs ── */}
      <div
        ref={orb1Ref}
        className="pointer-events-none absolute left-[-80px] top-[-60px] h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{ background: "rgba(99,102,241,0.18)" }}
      />
      <div
        ref={orb2Ref}
        className="pointer-events-none absolute right-[-60px] bottom-[-40px] h-[350px] w-[350px] rounded-full blur-[90px]"
        style={{ background: "rgba(14,165,233,0.14)" }}
      />
      <div
        ref={orb3Ref}
        className="pointer-events-none absolute right-[30%] top-[20%] h-[200px] w-[200px] rounded-full blur-[80px]"
        style={{ background: "rgba(168,85,247,0.10)" }}
      />

      {/* ── Card ── */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md"
        style={{ perspective: "1000px" }}
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(10, 14, 28, 0.85)",
            border: "1px solid rgba(99,102,241,0.18)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* ── Logo ── */}
          <div ref={logoRef} className="mb-6 flex justify-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(14,165,233,0.3))",
                border: "1px solid rgba(99,102,241,0.4)",
                boxShadow: "0 0 24px rgba(99,102,241,0.25)",
              }}
            >
              📦
            </div>
          </div>

          {/* ── Heading ── */}
          <div ref={headingRef} className="mb-7 text-center">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #e0e7ff 0%, #93c5fd 50%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Account
            </h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
              Join the inventory management system
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div ref={(el) => { fieldRefs.current[0] = el; }}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.7)" }}>
                Full Name
              </label>
              <div
                className="relative rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "name" ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "name" ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "name" ? "0 0 20px rgba(99,102,241,0.12)" : "none",
                }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Akash Sharma"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div ref={(el) => { fieldRefs.current[1] = el; }}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.7)" }}>
                Email Address
              </label>
              <div
                className="relative rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "email" ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "email" ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "email" ? "0 0 20px rgba(99,102,241,0.12)" : "none",
                }}
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="akash@example.com"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div ref={(el) => { fieldRefs.current[2] = el; }}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.7)" }}>
                Password
              </label>
              <div
                className="relative rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "password" ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "password" ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "password" ? "0 0 20px rgba(99,102,241,0.12)" : "none",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  className="w-full bg-transparent px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition-all duration-200 hover:scale-110"
                  style={{ color: showPassword ? "rgba(99,102,241,0.9)" : "rgba(100,116,139,0.7)" }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Password strength */}
              {formData.password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = Math.min(
                      Math.floor(formData.password.length / 3) +
                      (formData.password.match(/[A-Z]/) ? 1 : 0) +
                      (formData.password.match(/[0-9]/) ? 1 : 0) +
                      (formData.password.match(/[^A-Za-z0-9]/) ? 1 : 0),
                      4
                    );
                    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
                    return (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-500"
                        style={{
                          background: level <= strength ? colors[strength - 1] : "rgba(255,255,255,0.08)",
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Role */}
            <div ref={(el) => { fieldRefs.current[3] = el; }}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.7)" }}>
                Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className="relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200"
                    style={{
                      background:
                        formData.role === role.value
                          ? "rgba(99,102,241,0.15)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        formData.role === role.value
                          ? "1px solid rgba(99,102,241,0.5)"
                          : "1px solid rgba(255,255,255,0.07)",
                      boxShadow:
                        formData.role === role.value
                          ? "0 0 16px rgba(99,102,241,0.15)"
                          : "none",
                    }}
                  >
                    <span className="text-base">{role.icon}</span>
                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: formData.role === role.value ? "#c7d2fe" : "rgba(148,163,184,0.8)" }}
                      >
                        {role.label}
                      </p>
                      <p className="text-[10px]" style={{ color: "rgba(100,116,139,0.6)" }}>
                        {role.desc}
                      </p>
                    </div>
                    {formData.role === role.value && (
                      <div
                        className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
                        style={{ background: "rgba(99,102,241,0.7)" }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div ref={(el) => { fieldRefs.current[4] = el; }} className="pt-1">
              <button
                ref={btnRef}
                type="submit"
                disabled={loading}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
                className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {/* Shimmer effect */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  style={{ animation: loading ? "none" : "shimmer 2.5s infinite" }}
                />
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-20deg); }
                    60%, 100% { transform: translateX(200%) skewX(-20deg); }
                  }
                `}</style>

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>
            </div>
          </form>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-xs" style={{ color: "rgba(100,116,139,0.7)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold transition-colors duration-200"
              style={{ color: "rgba(129,140,248,0.9)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;