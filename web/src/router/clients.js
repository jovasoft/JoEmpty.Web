import AppLayout from "@/layouts/AppLayout";

export default [
	{
		path: "/client-transactions/clients",
		component: AppLayout,
		children: [
			{
				path: "list",
				name: "listClients",
				component: () => import("@/pages/Clients/ListClients")
			},
			{
				path: "add/:clientId?",
				name: "addClients",
				props: true,
				component: () => import("@/pages/Clients/AddClient")
			}
		]
	}
];
