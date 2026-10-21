// Headless interaction smoke test for the studio. Not part of the Next build.
// Run: node scripts/studio-smoke.mjs
import { JSDOM } from "jsdom";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: "http://localhost/dashboard", pretendToBeVisual: true },
);

const { window } = dom;
globalThis.window = window;
globalThis.document = window.document;
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});
globalThis.HTMLElement = window.HTMLElement;
globalThis.Element = window.Element;
globalThis.Node = window.Node;
globalThis.Event = window.Event;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.PointerEvent = window.MouseEvent;
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
window.requestAnimationFrame = globalThis.requestAnimationFrame;
window.cancelAnimationFrame = globalThis.cancelAnimationFrame;
window.scrollTo = () => {};
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
});
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
window.ResizeObserver = Observer;
window.IntersectionObserver = Observer;
globalThis.ResizeObserver = Observer;
globalThis.IntersectionObserver = Observer;
if (!window.crypto?.randomUUID) {
  Object.defineProperty(window.crypto, "randomUUID", {
    value: () => `id-${Math.random().toString(36).slice(2)}`,
  });
}

const cssModule = {
  name: "css-module-stub",
  setup(b) {
    b.onResolve({ filter: /\.module\.css$/ }, (args) => ({
      path: args.path,
      namespace: "cssmod",
    }));
    b.onLoad({ filter: /.*/, namespace: "cssmod" }, () => ({
      contents:
        "export default new Proxy({}, { get: (_, key) => typeof key === 'string' ? key : undefined });",
      loader: "js",
    }));
    const stub = (name, contents) => ({
      name: `stub-${name}`,
      setup(buildApi) {
        buildApi.onResolve({ filter: new RegExp(`^${name}$`) }, () => ({
          path: name,
          namespace: "stub",
        }));
        buildApi.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
          contents,
          loader: "jsx",
        }));
      },
    });
    b.onResolve({ filter: /^next\/link$/ }, () => ({
      path: "link",
      namespace: "nextstub",
    }));
    b.onResolve({ filter: /^next\/image$/ }, () => ({
      path: "image",
      namespace: "nextstub",
    }));
    b.onResolve({ filter: /^next\/navigation$/ }, () => ({
      path: "navigation",
      namespace: "nextstub",
    }));
    b.onLoad({ filter: /.*/, namespace: "nextstub" }, (args) => {
      if (args.path === "navigation") {
        return {
          resolveDir: root,
          loader: "js",
          contents: `
            export function usePathname() { return "/"; }
            export function useRouter() {
              return {
                push: (u) => { globalThis.__lastNav = u; },
                replace: (u) => { globalThis.__lastNav = u; },
                refresh: () => { globalThis.__refreshed = true; },
              };
            }`,
        };
      }
      if (args.path === "link") {
        return {
          resolveDir: root,
          loader: "jsx",
          contents: `
            import React from "react";
            const Link = React.forwardRef(function Link({ href, children, prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, ...rest }, ref) {
              return <a ref={ref} href={typeof href === "string" ? href : "#"} {...rest}>{children}</a>;
            });
            export default Link;`,
        };
      }
      return {
        resolveDir: root,
        loader: "jsx",
        contents: `
          import React from "react";
          const Image = React.forwardRef(function Image({ src, alt = "", fill, priority, sizes, style, width, height, ...rest }, ref) {
            const source = typeof src === "string" ? src : src?.src || "";
            return <img ref={ref} src={source} alt={alt} width={fill ? undefined : width} height={fill ? undefined : height} style={style} {...rest} />;
          });
          export default Image;`,
      };
    });
    void stub;
  },
};

mkdirSync(path.join(root, "node_modules/.cache"), { recursive: true });
const outfile = path.join(root, "node_modules/.cache/studio-smoke-bundle.mjs");
await build({
  entryPoints: [path.join(root, "scripts/studio-entry.jsx")],
  outfile,
  bundle: true,
  format: "esm",
  platform: "browser",
  jsx: "automatic",
  loader: { ".js": "jsx" },
  define: { "process.env.NODE_ENV": '"development"' },
  plugins: [cssModule],
  logLevel: "silent",
});
writeFileSync(
  path.join(root, "node_modules/.cache/studio-smoke-built.txt"),
  String(Date.now()),
);

const consoleMessages = [];
const originalError = console.error;
console.error = (...args) => {
  consoleMessages.push(
    args
      .map((value) => (value instanceof Error ? value.message : String(value)))
      .join(" "),
  );
};

const results = [];
const check = (label, condition, detail = "") => {
  results.push({ label, ok: Boolean(condition), detail });
  if (!condition) console.error(`FAIL  ${label} ${detail}`);
  else console.log(`ok    ${label}`);
};

const { mount, mountLogin, mountLibrary, mountSermonRoute, mountPublicInteractive, act } = await import(
  pathToFileURL(outfile).href
);
const container = window.document.getElementById("root");
await mount(container);

const text = () => window.document.body.textContent.replace(/\s+/g, " ");
const all = (selector) => [...window.document.querySelectorAll(selector)];
const byText = (selector, label) =>
  all(selector).find((el) => el.textContent.trim().startsWith(label));
const dock = () =>
  window.document.querySelector('nav[aria-label="Studio sections"]');
const dockButton = (label) =>
  [...dock().querySelectorAll("button")].find(
    (el) => el.getAttribute("aria-label") === label,
  );
const flush = async (ms = 500) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
};

check("studio renders overview", text().includes("Content Studio"));
check("overview greeting", /Welcome back|Good (morning|afternoon|evening)/.test(text()));
check("dock has five sections", dock().querySelectorAll("button").length === 5);
check("site link in dock", text().includes("Site"));

await act(async () => dockButton("Divine").click());
await flush();
check("divine board opens", text().includes("Proclaim the Word."));

await act(async () => byText("button", "New divine message").click());
await flush(600);
const dialog = window.document.querySelector('[role="dialog"]');
check("editor opens", Boolean(dialog));
check("audio tab present for divine", text().includes("Audio"));

const titleInput = dialog.querySelector('input[placeholder="The Unshackable Foundation"], input[placeholder="The Unshakable Foundation"]');
const setValue = (element, value) => {
  const proto = element.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(element, value);
  element.dispatchEvent(new window.Event("input", { bubbles: true }));
};
await act(async () => setValue(titleInput, "Smoke Test Message"));
await flush(120);
const subInput = dialog.querySelector('input[placeholder="Standing when nations tremble"]');
await act(async () => setValue(subInput, "A headless check"));
await flush(120);

await act(async () => byText('[role="dialog"] button', "Save").click());
await flush(600);
const stored = JSON.parse(window.localStorage.getItem("yrpm:studio:v1") || "null");
check("save closes the editor", !window.document.querySelector('[role="dialog"]'));
check(
  "message persisted",
  stored?.sermons?.some((item) => item.title === "Smoke Test Message"),
);
await flush(500);
check("new message on the board", text().includes("Smoke Test Message"));

const publishButton = window.document.querySelector(
  'button[aria-label="Publish Smoke Test Message"]',
);
if (publishButton) {
  await act(async () => publishButton.click());
  await flush(500);
}
const publishedState = JSON.parse(
  window.localStorage.getItem("yrpm:studio:v1") || "null",
);
check(
  "publish toggle works",
  publishedState?.sermons?.find((s) => s.title === "Smoke Test Message")
    ?.status === "published",
);

await act(async () => dockButton("Sabbath").click());
await flush();
check("sabbath board opens", text().includes("Study together."));
check("sabbath has no audio tab", !text().includes("Upload from this device"));

await act(async () => byText("button", "New study note").click());
await flush(600);
const studyDialog = window.document.querySelector('[role="dialog"]');
check("study editor opens", Boolean(studyDialog));
check(
  "study editor omits audio",
  ![...studyDialog.querySelectorAll("button")].some((el) =>
    el.textContent.includes("Audio"),
  ),
);
await act(async () =>
  setValue(
    studyDialog.querySelector('input[placeholder="The Unshakable Foundation"]'),
    "Smoke Study Note",
  ),
);
await flush(120);
const scriptureTab = [...studyDialog.querySelectorAll("button")].find(
  (el) => el.textContent.trim() === "Scripture",
);
await act(async () => scriptureTab.click());
await flush(600);
const passageInput = studyDialog.querySelector(
  'input[placeholder="Hebrews 12"]',
);
await act(async () => setValue(passageInput, "John 3:16"));
await act(async () => byText('[role="dialog"] button', "Add").click());
await flush(120);
check("passage chip added", studyDialog.textContent.includes("John 3:16"));
await act(async () => byText('[role="dialog"] button', "Save").click());
await flush(600);
const stored2 = JSON.parse(window.localStorage.getItem("yrpm:studio:v1") || "null");
check(
  "study note persisted with passage",
  stored2?.sermons?.some(
    (item) =>
      item.title === "Smoke Study Note" &&
      item.passages.includes("John 3:16") &&
      item.type === "Sabbath School",
  ),
);

await act(async () => dockButton("Library").click());
await flush();
check("library opens", text().includes("The whole library."));
check("library lists saved content", text().includes("Smoke Study Note"));

await act(async () => dockButton("Settings").click());
await flush();
check("settings opens", text().includes("Tune the studio."));
const motionSwitch = window.document.querySelector(
  'button[aria-label="Reduce studio motion"]',
);
await act(async () => motionSwitch.click());
await flush(120);
check(
  "motion preference persists",
  window.localStorage.getItem("yrpm:studio:motion") === "reduced",
);
await act(async () => motionSwitch.click());

await act(async () => dockButton("Overview").click());
await flush();
check("overview returns", text().includes("Content review"));

// Escape must close a clean editor.
await act(async () => dockButton("Divine").click());
await flush();
await act(async () => byText("button", "Edit").click());
await flush(600);
check("edit dialog opens", Boolean(window.document.querySelector('[role="dialog"]')));
await act(async () => {
  window.document.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
  );
});
await flush(600);
check(
  "escape closes the editor",
  !window.document.querySelector('[role="dialog"]'),
);

// Public integration: drafts stay out of the listing; detail pages resolve live content.
const publicRoot = window.document.createElement("div");
window.document.body.appendChild(publicRoot);
await mountLibrary(publicRoot);
await flush(400);
check(
  "public listing shows the published studio message",
  publicRoot.textContent.includes("Smoke Test Message"),
);
check(
  "public listing hides the draft study",
  !publicRoot.textContent.includes("Smoke Study Note"),
);

const routeRoot = window.document.createElement("div");
window.document.body.appendChild(routeRoot);
await mountSermonRoute(routeRoot, {
  type: "Divine Service",
  slug: "smoke-test-message",
});
await flush(400);
check(
  "studio-created slug renders on the public route",
  routeRoot.textContent.includes("Smoke Test Message"),
);
check(
  "published route omits the draft label",
  !routeRoot.textContent.includes("Draft preview"),
);

const draftRoot = window.document.createElement("div");
window.document.body.appendChild(draftRoot);
await mountSermonRoute(draftRoot, {
  type: "Sabbath School",
  slug: "smoke-study-note",
});
await flush(400);
check(
  "draft study route renders with a preview label",
  draftRoot.textContent.includes("Smoke Study Note") &&
    draftRoot.textContent.includes("Draft preview"),
);

check(
  "studio header displays the signed-in admin email and sign-out control",
  text().includes("admin@yrpm.local") &&
    Boolean(
      window.document.querySelector('button[aria-label="Sign out of the studio"]'),
    ),
);

// Admin login form: empty validation, password visibility toggle, rejected and accepted login.
const loginRoot = window.document.createElement("div");
window.document.body.appendChild(loginRoot);
await mountLogin(loginRoot, {
  next: "/dashboard",
  hint: { email: "admin@yrpm.local", password: "studio-preview" },
});
await flush(250);
const toggleBtn = loginRoot.querySelector('button[aria-label="Show password"]');
const pwInput = loginRoot.querySelector('input[name="password"]');
await act(async () => toggleBtn.click());
check(
  "login password visibility toggle switches input type",
  pwInput?.getAttribute("type") === "text",
);

globalThis.fetch = async (_url, init) => {
  const body = JSON.parse(init?.body || "{}");
  if (body.password === "studio-preview") {
    return {
      ok: true,
      status: 200,
      json: async () => ({ ok: true, email: body.email }),
    };
  }
  return {
    ok: false,
    status: 401,
    json: async () => ({ ok: false, error: "Email or password is incorrect." }),
  };
};

await act(async () => setValue(pwInput, "wrong-password"));
await act(async () => {
  loginRoot
    .querySelector("form")
    .dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
});
await flush(250);
check(
  "login form surfaces server error on invalid password",
  loginRoot.textContent.includes("Email or password is incorrect."),
);

const pwInputAfter = loginRoot.querySelector('input[name="password"]');
await act(async () => setValue(pwInputAfter, "studio-preview"));
await act(async () => {
  loginRoot
    .querySelector("form")
    .dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
});
await flush(900);
check(
  "login form unlocks and navigates to next path on valid credentials",
  loginRoot.textContent.includes("Unlocking the studio") ||
    globalThis.__lastNav === "/dashboard",
);

// Public site interactive verification: Navbar menu, Ministries dropdown, Theme switch, Homepage Sermon Cards, FAQ clicks, Footer wordmark.
const siteRoot = window.document.createElement("div");
window.document.body.appendChild(siteRoot);
await mountPublicInteractive(siteRoot);
await flush(300);

const menuBtn = siteRoot.querySelector("button.nav-menu-trigger");
await act(async () => menuBtn.click());
await flush(250);
check(
  "navbar menu bar button opens the architectural navigation drawer",
  Boolean(siteRoot.querySelector("#architectural-nav-drawer")),
);

const closeMenuBtn = siteRoot.querySelector("#architectural-nav-drawer .mobile-close");
await act(async () => closeMenuBtn.click());
await flush(650);
check(
  "navbar drawer close button dismisses the menu",
  menuBtn.getAttribute("aria-expanded") === "false" &&
    !siteRoot.querySelector("#architectural-nav-drawer"),
);

const megaTrigger = siteRoot.querySelector("button.nav-drop-trigger");
await act(async () => megaTrigger.click());
await flush(250);
check(
  "ministries dropdown opens on click",
  Boolean(siteRoot.querySelector("#ministries-menu")),
);

const themeBtn = siteRoot.querySelector("button.theme-switch-btn");
const initialTheme = window.document.documentElement.dataset.theme || "light";
await act(async () => themeBtn.click());
await flush(150);
check(
  "theme switcher toggles between Architectural Linen light and Midnight Obsidian dark",
  window.document.documentElement.dataset.theme !== initialTheme,
);

const homeSermonCards = siteRoot.querySelectorAll(".sermons-showcase .arch-sermon-card");
check(
  "homepage sermon showcase renders architectural sermon cards",
  homeSermonCards.length >= 6,
);

const faqBtn2 = siteRoot.querySelector("#faq-question-1");
await act(async () => faqBtn2.click());
await flush(150);
check(
  "visitor FAQ item expands when clicked",
  faqBtn2?.getAttribute("aria-expanded") === "true",
);

const expandAllBtn = siteRoot.querySelector(".faq-expand-all-btn");
await act(async () => expandAllBtn.click());
await flush(150);
check(
  "visitor FAQ expand-all button opens all questions",
  siteRoot.querySelectorAll(".visit-faq-item.is-open").length === 4,
);

check(
  "footer maintains and restyles the YASHUA POWER wordmark monument",
  Boolean(siteRoot.querySelector(".footer-wordmark-monument")) &&
    siteRoot.querySelector(".footer-wordmark")?.textContent.replace(/\s+/g, "") === "YASHUAPOWER",
);

const failures = results.filter((item) => !item.ok);
console.log(
  `\n${results.length - failures.length}/${results.length} interaction checks passed`,
);
const uniqueMessages = [...new Set(consoleMessages)].filter(
  (line) => !line.includes("not wrapped in act") && !line.includes("ReactDOMTestUtils"),
);
if (uniqueMessages.length) {
  console.log("\nRuntime console output:");
  uniqueMessages.slice(0, 12).forEach((line) => console.log(" -", line.slice(0, 220)));
}
process.exit(failures.length ? 1 : 0);
