import { createRoot } from "react-dom/client";
import { act } from "react";
import StudioApp from "../app/dashboard/_components/StudioApp";
import SermonLibrary from "../components/SermonLibrary";
import SermonRoute from "../app/sermons/_components/SermonRoute";
import LoginForm from "../app/admin/login/LoginForm";
import Navbar from "../components/Navbar";
import VisitorFAQ from "../components/VisitorFAQ";
import SermonShowcase from "../components/SermonShowcase";
import Footer from "../components/Footer";

export async function mount(container, props = {}) {
  const root = createRoot(container);
  await act(async () => {
    root.render(<StudioApp adminEmail="admin@yrpm.local" {...props} />);
  });
  return root;
}

export async function mountLogin(container, props) {
  const root = createRoot(container);
  await act(async () => {
    root.render(<LoginForm {...props} />);
  });
  return root;
}

export async function mountLibrary(container) {
  const root = createRoot(container);
  await act(async () => {
    root.render(<SermonLibrary />);
  });
  return root;
}

export async function mountSermonRoute(container, props) {
  const root = createRoot(container);
  await act(async () => {
    root.render(<SermonRoute {...props} />);
  });
  return root;
}

export async function mountPublicInteractive(container) {
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <>
        <Navbar />
        <SermonShowcase />
        <VisitorFAQ />
        <Footer />
      </>,
    );
  });
  return root;
}

export { act };
