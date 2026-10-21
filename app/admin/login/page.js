import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getSession } from "../_lib/auth";
import { adminConfig, safeNextPath } from "../_lib/session";
import LoginForm from "./LoginForm";
import LockClock from "./LockClock";
import styles from "./login.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin sign in",
  description: "Authorised access to the YRPM content studio.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const next = safeNextPath(params?.next);
  const session = await getSession();
  if (session) redirect(next);

  const config = adminConfig();
  const hint =
    config.source === "development"
      ? { email: config.email, password: config.password }
      : null;

  return (
    <main className={styles.screen}>
      <span className={styles.aurora} aria-hidden="true" />
      <span className={styles.grain} aria-hidden="true" />

      <div className={styles.topRow}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={13} aria-hidden="true" /> Public site
        </Link>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          Secure session
        </span>
      </div>

      <LockClock />

      {config.configured ? (
        <LoginForm next={next} hint={hint} />
      ) : (
        <section className={styles.sheet} aria-labelledby="admin-locked-title">
          <div className={styles.sheetHead}>
            <span className={styles.mark} aria-hidden="true">
              <ShieldCheck size={21} />
            </span>
            <div className={styles.sheetHeading}>
              <span className={styles.kicker}>Locked</span>
              <h1 className={styles.sheetTitle} id="admin-locked-title">
                Admin access is not configured
              </h1>
            </div>
          </div>
          <p className={styles.sheetLead}>
            This deployment has no admin credentials, so sign-in is disabled on
            purpose. Set <code>ADMIN_EMAIL</code> and{" "}
            <code>ADMIN_PASSWORD_HASH</code> (or <code>ADMIN_PASSWORD</code>) in
            the environment, then restart the server.
          </p>
          <p className={styles.finePrint}>
            Run <code>npm run admin:hash -- &quot;your password&quot;</code> to
            generate the hash. See <code>docs/admin-access.md</code>.
          </p>
        </section>
      )}
    </main>
  );
}
