import AppLayout from "@/layouts/AppLayout";

export default [
	{
		path: "/contracts",
		component: AppLayout,
		children: [
			{
				path: "list",
				name: "listContracts",
				component: () => import("@/pages/Contracts/ListContracts")
			},
			{
				path: "add",
				name: "addContract",
				component: () => import("@/pages/Contracts/AddContract")
			}
		]
	}
];
