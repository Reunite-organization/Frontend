export function routeFor(page, id) {
  switch (page) {
    case "home":
      return "/";
    case "cases":
      return "/cases";
    case "case-detail":
      return `/cases/${id}`;
    case "map":
      return "/map";
    case "report":
      return "/report";
    case "memories":
      return "/memories";
    case "memory-detail":
      return `/memories/${id}`;
    case "create-memory":
      return "/create-memory";
    case "login":
      return "/login";
    case "profile":
      return "/profile";
    case "admin":
      return "/admin";
    case "chat":
      return "/chat";
    default:
      return "/";
  }
}
