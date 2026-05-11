import { createRootRoute } from "@tanstack/react-router";
import { App } from "@/App";
import "@/styles/globals.css";

export const Route = createRootRoute({
	component: App,
});
