import Vue from "vue";
import Router from "vue-router";
import Meta from "vue-meta";
import store from "./store/store";
import globals from "@/globals";

// Layouts
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import LandingLayout from "@/layouts/BlankLayout";

Vue.use(Router);
Vue.use(Meta);

const router = new Router({
	base: process.env.BASE_URL,
	mode: "history",
	routes: [
		{
			path: "/",
			meta: {
				public: true
			},
			component: LandingLayout,
			children: [
				{
					path: "",
					name: "landing",
					component: () => import("@/pages/Landing")
				}
			]
		},
		{
			path: "/dashboard",
			component: AppLayout,
			children: [
				{
					path: "",
					name: "dashboard",
					component: () => import("@/pages/Dashboard/Home")
				}
			]
		},
		{
			path: "/auth",
			meta: {
				public: true,
				onlyWhenLoggedOut: true
			},
			component: AuthLayout,
			children: [
				{
					path: "login",
					name: "login",
					component: () => import("@/pages/Auth/Login")
				},
				{
					path: "register",
					name: "register",
					component: () => import("@/pages/Auth/Register")
				},
				{
					path: "forgot-password",
					name: "forgot-password",

					component: () => import("@/pages/Auth/ForgotPassword")
				}
			]
		},
		{
			path: "/user",
			component: AppLayout,
			children: [
				{
					path: "account-settings",
					name: "account-settings",
					component: () => import("@/pages/User/AccountSettings")
				}
			]
		},
		{
			path: "*",
			component: () => import("@/pages/Error/404")
		}
	]
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
