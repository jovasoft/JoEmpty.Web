<template>
	<div class="layout-wrapper layout-2">
		<div class="layout-inner">
			<app-layout-sidenav />

			<div class="layout-container">
				<app-layout-navbar />

				<div class="layout-content">
					<div class="router-transitions container-fluid flex-grow-1 container-p-y">
						<notifications group="app" :width="300" position="bottom right" />
						<router-view :key="$route.fullPath" />
					</div>

					<app-layout-footer />
				</div>
			</div>
		</div>
		<div class="layout-overlay" @click="closeSidenav"></div>
	</div>
</template>

<script>
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Footer from "../components/Footer";

export default {
	components: {
		"app-layout-navbar": Navbar,
		"app-layout-sidenav": Sidenav,
		"app-layout-footer": Footer
	},

	mounted() {
		this.layoutHelpers.init();
		this.layoutHelpers.update();
		this.layoutHelpers.setAutoUpdate(true);
	},

	beforeDestroy() {
		this.layoutHelpers.destroy();
	},

	methods: {
		closeSidenav() {
			this.layoutHelpers.setCollapsed(true);
		}
	}
};
</script>
