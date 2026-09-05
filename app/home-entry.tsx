"use client";

import { useSyncExternalStore } from "react";
import HomePage from "./home";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
}

// Render the builder at build time, then apply optional review controls in the
// browser. The public homepage needs no server or query-dependent HTML.
export default function HomeEntry() {
  const query = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const params = new URLSearchParams(query);
  const requestedFocus = params.get("focus");
  const focus = requestedFocus === "teams" || requestedFocus === "fulcrum" ? requestedFocus : "work";

  return <>
    {(params.has("focus") || params.has("review")) && <meta name="robots" content="noindex, follow" />}
    <HomePage focus={focus} reviewing={params.get("review") === "1"} />
  </>;
}
