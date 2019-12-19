import Vue from "vue";
import Router from "vue-router";
import Meta from "vue-meta";
import store from "../store/store";
import globals from "@/globals";

// routes
import authRoutes from "./auth";
import clientsRoutes from "./clients";
import errorRoutes from "./error";
import userRoutes from "./user";
import contractsRoutes from "./contracts";
import facilitiesRoutes from "./facilities";

Vue.use(Router);
Vue.use(Meta);

const ROUTES = [{ path: "", redirect: "/client-transactions/clients/list" }]
	.concat(authRoutes)
	.concat(clientsRoutes)
	.concat(errorRoutes)
	.concat(userRoutes)
	.concat(contractsRoutes)
	.concat(facilitiesRoutes);

const router = new Router({
	base: process.env.BASE_URL,
	mode: "history",
	routes: ROUTES
});

router.onError(error => {
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	if (isChunkLoadFailed) {
		window.location.reload();
	}
});

router.afterEach(() => {
	// Remove initial splash screen
	const splashScreen = document.querySelector(".app-splash-screen");
	if (splashScreen) {
		splashScreen.style.opacity = 0;
		setTimeout(() => splashScreen && splashScreen.parentNode.removeChild(splashScreen), 300);
	}

	// On small screens collapse sidenav
	if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
		setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10);
	}

	// Scroll to top of the page
	globals().scrollTop(0, 0);
});

router.beforeEach((to, from, next) => {
	// Set loading state
	document.body.classList.add("app-loading");

	// Check if user logged
	const isPublic = to.matched.some(record => record.meta.public);
	const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut);
	let loggedIn = store.getters["auth/loggedIn"];

	if (!isPublic && !loggedIn) {
		return setTimeout(
			() =>
				next({
					path: "/auth/login",
					query: { redirect: to.fullPath }
				}),
			10
		);
	}

	if (loggedIn && onlyWhenLoggedOut) {
		return setTimeout(() => next("/"), 10);
	}

	setTimeout(() => next(), 10);
});

export default router;
