"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LockKeyhole,
  ShieldAlert,
  Sparkles,
  Unlock,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./login.module.css";

const spring = { type: "spring", stiffness: 420, damping: 30, mass: 0.8 };

export default function LoginForm({ next, hint }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState(hint?.email || "");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    // Land on the password when the email is already known.
    const target = hint?.email && !email ? passwordRef : emailRef;
    target.current?.focus({ preventScroll: true });
  }, [hint?.email, email]);

  const sheen = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "submitting" || status === "unlocking") return;
    setError("");

    if (!email.trim() || !password) {
      setError("Enter both your admin email and password.");
      setShake((value) => value + 1);
      (email.trim() ? passwordRef : emailRef).current?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "same-origin",
        cache: "no-store",
      });
      let payload = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }
      if (!response.ok) {
        setStatus("idle");
        setPassword("");
        setError(
          payload.error ||
            "Sign in could not be completed. Please try again.",
        );
        setShake((value) => value + 1);
        passwordRef.current?.focus();
        return;
      }
      setStatus("unlocking");
      // A full navigation drops any cached studio state from the previous session.
      window.setTimeout(() => {
        router.replace(next);
        router.refresh();
      }, reduceMotion ? 180 : 780);
    } catch {
      setStatus("idle");
      setError("The network did not respond. Check your connection and retry.");
      setShake((value) => value + 1);
    }
  };

  const busy = status !== "idle";

  return (
    <motion.section
      className={styles.sheet}
      aria-labelledby="admin-login-title"
      key={shake}
      initial={false}
      animate={
        shake && !reduceMotion
          ? { x: [0, -9, 8, -6, 4, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.42, ease: "easeInOut" }}
    >
      <div className={styles.sheetHead}>
        <span className={styles.mark} aria-hidden="true">
          <Sparkles size={21} />
        </span>
        <div className={styles.sheetHeading}>
          <span className={styles.kicker}>Restricted area</span>
          <h1 className={styles.sheetTitle} id="admin-login-title">
            Content studio
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === "unlocking" ? (
          <motion.div
            key="unlocking"
            className={styles.unlocking}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <motion.span
              className={styles.unlockIcon}
              initial={reduceMotion ? false : { scale: 0.6, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={spring}
            >
              <Unlock size={24} aria-hidden="true" />
            </motion.span>
            <p className={styles.unlockText} role="status">
              Welcome back. Unlocking the studio…
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            className={styles.form}
            style={{ display: "grid", gap: 18 }}
            initial={false}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          >
            <p className={styles.sheetLead}>
              This workspace is for authorised stewards of the ministry. Sign in
              to manage messages, studies and recordings.
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.field}>
                <LockKeyhole size={17} aria-hidden="true" />
                <span className={styles.srOnly}>Admin email</span>
                <input
                  ref={emailRef}
                  className={styles.input}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Admin email"
                  aria-invalid={Boolean(error) || undefined}
                  disabled={busy}
                />
              </label>
              <label className={styles.field}>
                <Lock size={17} aria-hidden="true" />
                <span className={styles.srOnly}>Password</span>
                <input
                  ref={passwordRef}
                  className={styles.input}
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  aria-invalid={Boolean(error) || undefined}
                  disabled={busy}
                />
                <button
                  type="button"
                  className={styles.reveal}
                  onClick={() => setVisible((value) => !value)}
                  aria-label={visible ? "Hide password" : "Show password"}
                  aria-pressed={visible}
                  tabIndex={0}
                >
                  {visible ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </label>
            </div>

            {error && (
              <p className={styles.error} role="alert">
                <ShieldAlert size={15} aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}

            <motion.button
              type="submit"
              className={styles.submit}
              onPointerMove={sheen}
              disabled={busy}
              whileHover={reduceMotion ? undefined : { scale: 1.012 }}
              whileTap={reduceMotion ? undefined : { scale: 0.972 }}
              transition={spring}
            >
              <span className={styles.sheen} aria-hidden="true" />
              {busy ? (
                "Checking credentials…"
              ) : (
                <>
                  Unlock studio <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </motion.button>

            {hint && (
              <p className={styles.hint}>
                <CheckCircle2
                  size={13}
                  aria-hidden="true"
                  style={{ verticalAlign: "-2px", marginRight: 5 }}
                />
                Development login ·<code> {hint.email}</code> /
                <code> {hint.password}</code>. Set{" "}
                <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD_HASH</code>{" "}
                before deploying.
              </p>
            )}

            <p className={styles.finePrint}>
              Protected by a signed, HTTP-only session cookie. Every access
              attempt is rate limited and logged by the server.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
