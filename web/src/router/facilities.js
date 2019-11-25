import AppLayout from "@/layouts/AppLayout";

export default [
	{
		path: "/client-transactions/facilities",
		component: AppLayout,
		children: [
			{
				path: "list",
				name: "listFacilities",
				component: () => import("@/pages/Facilities/ListFacilities")
			},
			{
				path: "add",
				name: "addFacility",
				component: () => import("@/pages/Facilities/AddFacility")
			}
		]
	}
];
