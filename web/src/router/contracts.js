import AppLayout from "@/layouts/AppLayout";

export default [
	{
		path: "/client-transactions/contracts",
		component: AppLayout,
		children: [
			{
				path: "list/:contractsClientId?",
				name: "listContracts",
				props: true,
				component: () => import("@/pages/Contracts/ListContracts")
			},
			{
				path: "add/:clientId?",
				name: "addContract",
				props: true,
				component: () => import("@/pages/Contracts/AddContract")
			},
			{
				path: "edit/:contractId?",
				name: "editContract",
				props: true,
				component: () => import("@/pages/Contracts/AddContract")
			}
		]
	}
];
