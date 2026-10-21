export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api/admin", "/sermons/*/draft"],
      },
    ],
    host: undefined,
  };
}
