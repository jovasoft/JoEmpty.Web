import AppLayout from "@/layouts/AppLayout";

export default [
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
	}
];
