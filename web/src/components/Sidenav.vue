<template>
	<sidenav class="sidenav sidenav-vertical bg-sidenav-theme layout-sidenav">
		<!-- Inner -->
		<div class="app-brand py-3" style="height:66px">
			<img :src="`${publicUrl}img/logo.png`" alt class="app-brand-logo ui-w-40" />
			<router-link to="/" class="app-brand-text sidenav-text font-weight-normal ml-2" style="font-size:1.1rem">JoEmpty</router-link>
			<a href="javascript:void(0)" class="layout-sidenav-toggle sidenav-link text-large ml-auto" @click="toggleSidenav">
				<i class="ion ion-md-menu align-middle"></i>
			</a>
		</div>
		<div class="sidenav-divider mt-0"></div>
		<div class="sidenav-inner py-1">
			<sidenav-router-link icon="ion ion-ios-contact" to="/dashboard" :exact="true">Home</sidenav-router-link>
		</div>
	</sidenav>
</template>

<script>
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from "@/vendor/libs/sidenav";

export default {
	name: "app-layout-sidenav",
	components: {
		/* eslint-disable vue/no-unused-components */
		Sidenav,
		SidenavLink,
		SidenavRouterLink,
		SidenavMenu,
		SidenavHeader,
		SidenavBlock,
		SidenavDivider
		/* eslint-enable vue/no-unused-components */
	},

	methods: {
		isMenuActive(url) {
			return this.$route.path.indexOf(url) === 0;
		},

		isMenuOpen(url) {
			return this.$route.path.indexOf(url) === 0;
		},

		toggleSidenav() {
			this.layoutHelpers.toggleCollapsed();
		}
	}
};
</script>
