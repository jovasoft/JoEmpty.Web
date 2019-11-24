import AuthLayout from "@/layouts/AuthLayout";

export default [
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
	}
];
