import AppLayout from "@/layouts/AppLayout";

export default [
	{
		path: "/client-transactions/facilities",
		component: AppLayout,
		children: [
			{
				path: "list/:clientId?/:contractId?",
				name: "listFacilities",
				props: true,
				component: () => import("@/pages/Facilities/ListFacilities")
			},
			{
				path: "add/:clientId?/:contractId?",
				name: "addFacility",
				props: true,
				component: () => import("@/pages/Facilities/AddFacility")
			},
			{
				path: "edit/:facilityId?",
				name: "editFacility",
				props: true,
				component: () => import("@/pages/Facilities/AddFacility")
			}
		]
	}
];
